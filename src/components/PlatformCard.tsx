import type { ConnectionState, ProfileData } from '../types';
import type { PlatformMeta } from '../platforms';
import { Badge } from './Badge';

interface Props {
  meta: PlatformMeta;
  conn: ConnectionState;
  /** data to show: live/connected data, or demo fallback when demo mode is on */
  profile?: ProfileData;
  onManage: () => void;
  onRetry: () => void;
}

function Stat({ label, value }: { label: string; value?: string | number }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-0.5 text-lg font-semibold text-white">{value ?? '—'}</div>
    </div>
  );
}

export function PlatformCard({ meta, conn, profile, onManage, onRetry }: Props) {
  const isDemo = profile?.source === 'demo';

  let badge = <Badge tone="muted">Not connected</Badge>;
  if (conn.status === 'loading') badge = <Badge tone="busy">Loading…</Badge>;
  else if (conn.status === 'error') badge = <Badge tone="error">Error</Badge>;
  else if (conn.status === 'connected') badge = <Badge tone={isDemo ? 'demo' : 'live'}>{isDemo ? 'Connected · demo stats' : 'Connected · live'}</Badge>;
  else if (profile) badge = <Badge tone="demo">Demo preview</Badge>;

  return (
    <div className="flex flex-col rounded-xl border border-white/5 bg-[#12151d] p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: meta.color }} />
          <h3 className="font-semibold text-white">{meta.name}</h3>
        </div>
        {badge}
      </div>

      <div className="mt-4 min-h-[132px] flex-1">
        {conn.status === 'loading' && (
          <div className="space-y-3" aria-busy="true" aria-label={`Loading ${meta.name}`}>
            <div className="skeleton h-5 w-2/3" />
            <div className="grid grid-cols-3 gap-3">
              <div className="skeleton h-10" />
              <div className="skeleton h-10" />
              <div className="skeleton h-10" />
            </div>
            <div className="skeleton h-4 w-1/2" />
          </div>
        )}

        {conn.status === 'error' && (
          <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 text-sm text-rose-200">
            <p>{conn.error}</p>
            <div className="mt-3 flex gap-2">
              {conn.username && (
                <button onClick={onRetry} className="rounded-md bg-rose-500/20 px-3 py-1 text-xs font-medium hover:bg-rose-500/30">
                  Retry
                </button>
              )}
              <button onClick={onManage} className="rounded-md bg-white/5 px-3 py-1 text-xs font-medium text-zinc-200 hover:bg-white/10">
                Edit username
              </button>
            </div>
          </div>
        )}

        {conn.status !== 'loading' && conn.status !== 'error' && !profile && (
          <div className="flex h-full flex-col items-start justify-center gap-3 rounded-lg border border-dashed border-white/10 p-4">
            <p className="text-sm text-zinc-400">No data yet. Add your {meta.name} username to get started.</p>
            <button onClick={onManage} className="rounded-md bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-400">
              Connect {meta.name}
            </button>
          </div>
        )}

        {conn.status !== 'loading' && conn.status !== 'error' && profile && (
          <div>
            <div className="text-sm text-zinc-400">
              {isDemo && conn.status !== 'connected' ? 'Sample profile' : <>@{profile.username}</>}
              {profile.rank && <span className="ml-2 text-zinc-300">· {profile.rank}</span>}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {meta.hasRating && <Stat label="Rating" value={profile.rating} />}
              {meta.hasRating && <Stat label="Max" value={profile.maxRating} />}
              {meta.hasSolved && <Stat label="Solved" value={profile.solved} />}
              {profile.metrics.map((m) => (
                <Stat key={m.label} label={m.label} value={m.value} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs text-zinc-500">
        <span>
          Source:{' '}
          {profile ? (isDemo ? 'DEMO data (not from ' + meta.name + ')' : meta.name) : '—'}
        </span>
        {conn.status === 'connected' && conn.username && (
          <a href={meta.profileUrl(conn.username)} target="_blank" rel="noreferrer" className="text-indigo-300 hover:underline">
            View profile ↗
          </a>
        )}
      </div>
    </div>
  );
}
