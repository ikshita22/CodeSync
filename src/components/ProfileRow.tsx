import { useEffect, useState, type FormEvent } from 'react';
import type { ConnectionState } from '../types';
import type { PlatformMeta } from '../platforms';
import { Badge, Spinner } from './Badge';

interface Props { meta: PlatformMeta; conn: ConnectionState; onConnect: (username: string) => void; onDisconnect: () => void; }

export function ProfileRow({ meta, conn, onConnect, onDisconnect }: Props) {
  const [value, setValue] = useState(conn.username);
  useEffect(() => setValue(conn.username), [conn.username]);
  const loading = conn.status === 'loading';
  const connected = conn.status === 'connected';
  const submit = (e: FormEvent) => { e.preventDefault(); if (!loading) onConnect(value); };

  return (
    <form onSubmit={submit} className="rounded-xl border border-white/5 bg-[#12151d] p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: meta.color }} /><h3 className="font-semibold text-white">{meta.name}</h3></div>
        {connected ? <Badge tone={conn.data?.source === 'demo' ? 'demo' : 'live'}>{conn.data?.source === 'demo' ? 'Connected · demo stats' : 'Connected · live'}</Badge>
          : conn.status === 'error' ? <Badge tone="error">Error</Badge>
            : loading ? <Badge tone="busy">Connecting…</Badge> : <Badge tone="muted">Not connected</Badge>}
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={meta.placeholder} disabled={loading} aria-label={`${meta.name} username`} aria-invalid={conn.status === 'error'} autoComplete="off" spellCheck={false}
          className={`min-w-0 flex-1 rounded-lg border bg-[#0b0d12] px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-indigo-400 disabled:opacity-60 ${conn.status === 'error' ? 'border-rose-500/50' : 'border-white/10'}`} />
        <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:opacity-60">
          {loading && <Spinner />}{connected ? 'Refresh' : 'Connect'}
        </button>
        {(connected || conn.status === 'error') && <button type="button" onClick={onDisconnect} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5">Clear</button>}
      </div>
      <p className="mt-2 min-h-[1.25rem] text-xs" role="status">
        {conn.status === 'error' && <span className="text-rose-300">{conn.error}</span>}
        {connected && conn.data?.source === 'demo' && <span className="text-amber-300/90">Saved @{conn.username}. Showing DEMO stats only.</span>}
        {connected && conn.data?.source === 'live' && <span className="text-emerald-300/90">Live data for @{conn.data.username} · updated {new Date(conn.data.fetchedAt).toLocaleString()}.</span>}
        {conn.status === 'idle' && <span className="text-zinc-600">Public profile username only — no password needed.</span>}
      </p>
    </form>
  );
}
