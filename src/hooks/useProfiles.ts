import { useCallback, useEffect, useRef, useState } from 'react';
import type { ConnectionState, PlatformId } from '../types';
import { PLATFORMS, PLATFORM_IDS } from '../platforms';
import { fetchProfile } from '../lib/connectors';

const STORAGE_KEY = 'codesync-profiles-v1';

const blank = () =>
  Object.fromEntries(PLATFORM_IDS.map((id) => [id, { username: '', status: 'idle' }])) as Record<
    PlatformId,
    ConnectionState
  >;

const initial = () => {
  const empty = blank();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return empty;
    const parsed = JSON.parse(stored) as Partial<Record<PlatformId, ConnectionState>>;
    for (const id of PLATFORM_IDS) {
      const item = parsed[id];
      // Never restore an in-flight state; a saved successful public profile is safe to show.
      if (item?.status === 'connected' && item.data?.source === 'live') empty[id] = item;
    }
  } catch { /* Ignore corrupt or unavailable browser storage. */ }
  return empty;
};

export function useProfiles() {
  const [conns, setConns] = useState<Record<PlatformId, ConnectionState>>(initial);
  // Guards against stale responses when a platform is reconnected/disconnected mid-request.
  const tokens = useRef<Record<string, number>>({});

  const patch = useCallback((id: PlatformId, p: Partial<ConnectionState>) => {
    setConns((c) => ({ ...c, [id]: { ...c[id], ...p } }));
  }, []);

  const connect = useCallback(
    async (id: PlatformId, raw: string) => {
      const username = raw.trim();
      const err = PLATFORMS[id].validate(username);
      if (err) {
        patch(id, { username, status: 'error', error: err, data: undefined });
        return;
      }
      const token = (tokens.current[id] = (tokens.current[id] ?? 0) + 1);
      patch(id, { username, status: 'loading', error: undefined });
      try {
        const data = await fetchProfile(id, username);
        if (tokens.current[id] !== token) return;
        patch(id, { status: 'connected', data, error: undefined });
      } catch (e) {
        if (tokens.current[id] !== token) return;
        patch(id, {
          status: 'error',
          error: e instanceof Error ? e.message : 'Request failed.',
          data: undefined,
        });
      }
    },
    [patch],
  );

  const disconnect = useCallback((id: PlatformId) => {
    tokens.current[id] = (tokens.current[id] ?? 0) + 1;
    setConns((c) => ({ ...c, [id]: { username: '', status: 'idle' } }));
  }, []);

  // Store only completed live public-profile snapshots. This lets a user return without re-entering handles.
  useEffect(() => {
    const saved = Object.fromEntries(PLATFORM_IDS.map((id) => {
      const item = conns[id];
      return [id, item.status === 'connected' && item.data?.source === 'live' ? item : { username: '', status: 'idle' }];
    }));
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch { /* Storage is optional. */ }
  }, [conns]);

  return { conns, connect, disconnect };
}
