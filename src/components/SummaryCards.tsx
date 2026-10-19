import type { ConnectionState, PlatformId, ProfileData } from '../types';
import { PLATFORMS, PLATFORM_IDS } from '../platforms';
import { Badge } from './Badge';

interface Props {
  conns: Record<PlatformId, ConnectionState>;
  profiles: Partial<Record<PlatformId, ProfileData>>;
}

function Card({
  label,
  value,
  sub,
  badge,
}: {
  label: string;
  value: string;
  sub: string;
  badge?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#12151d] p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</span>
        {badge && <Badge tone="demo">includes demo</Badge>}
      </div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</div>
      <div className="mt-1 text-xs text-zinc-500">{sub}</div>
    </div>
  );
}

export function SummaryCards({ conns, profiles }: Props) {
  const connected = PLATFORM_IDS.filter((id) => conns[id].status === 'connected');
  const list = PLATFORM_IDS.map((id) => profiles[id]).filter((p): p is ProfileData => !!p);

  const solvedList = list.filter((p) => p.solved !== undefined);
  const totalSolved = solvedList.reduce((s, p) => s + (p.solved ?? 0), 0);
  const solvedDemo = solvedList.some((p) => p.source === 'demo');

  const rated = list.filter((p) => p.rating !== undefined);
  const top = rated.reduce<ProfileData | null>((best, p) => (!best || p.rating! > best.rating! ? p : best), null);
  const ratedDemo = rated.some((p) => p.source === 'demo');

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Card
        label="Connected platforms"
        value={`${connected.length} / ${PLATFORM_IDS.length}`}
        sub={connected.length ? connected.map((id) => PLATFORMS[id].name).join(', ') : 'None connected yet'}
      />
      <Card
        label="Problems solved"
        value={solvedList.length ? totalSolved.toLocaleString() : '—'}
        sub={solvedList.length ? `Across ${solvedList.length} platform${solvedList.length > 1 ? 's' : ''}` : 'No data'}
        badge={solvedDemo}
      />
      <Card
        label="Top rating"
        value={top ? String(top.rating) : '—'}
        sub={top ? `${PLATFORMS[top.platform].name} · ${rated.length} rated platform${rated.length > 1 ? 's' : ''}` : 'No rating data'}
        badge={ratedDemo}
      />
    </div>
  );
}
