import { useMemo, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { PlatformId, ProfileData } from '../types';
import { PLATFORMS, PLATFORM_IDS } from '../platforms';
import { Badge } from './Badge';

interface Props {
  profiles: Partial<Record<PlatformId, ProfileData>>;
}

const fmtDate = (t: number) =>
  new Date(t).toLocaleDateString('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' });

export function RatingChart({ profiles }: Props) {
  const [selected, setSelected] = useState<'all' | PlatformId>('all');

  const available = PLATFORM_IDS.filter((id) => profiles[id]?.ratingHistory?.length);
  const shown = selected === 'all' ? available : available.filter((id) => id === selected);
  const hasDemo = shown.some((id) => profiles[id]?.source === 'demo');

  const rows = useMemo(() => {
    const map = new Map<number, Record<string, number>>();
    for (const id of shown) {
      for (const pt of profiles[id]?.ratingHistory ?? []) {
        const row = map.get(pt.t) ?? { t: pt.t };
        row[id] = pt.rating;
        map.set(pt.t, row);
      }
    }
    return [...map.values()].sort((a, b) => a.t - b.t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profiles, selected]);

  return (
    <section className="rounded-xl border border-white/5 bg-[#12151d] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-white">Rating history</h2>
          {hasDemo && <Badge tone="demo">DEMO data</Badge>}
        </div>
        <div className="flex flex-wrap gap-1" role="tablist" aria-label="Rating platform">
          {(['all', ...available] as const).map((id) => {
            const active = selected === id;
            return (
              <button
                key={id}
                role="tab"
                aria-selected={active}
                onClick={() => setSelected(id)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  active ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5'
                }`}
              >
                {id === 'all' ? 'All' : PLATFORMS[id].name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 h-72">
        {rows.length === 0 ? (
          <div className="grid h-full place-items-center rounded-lg border border-dashed border-white/10 text-center text-sm text-zinc-500">
            No rating history yet.
            <br />
            Connect LeetCode, Codeforces or CodeChef, or turn on Demo mode.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rows} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="#ffffff10" vertical={false} />
              <XAxis
                dataKey="t"
                type="number"
                scale="time"
                domain={['dataMin', 'dataMax']}
                tickFormatter={fmtDate}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis stroke="#6b7280" fontSize={12} domain={['auto', 'auto']} width={48} />
              <Tooltip
                labelFormatter={(t) => fmtDate(Number(t))}
                contentStyle={{ background: '#0b0d12', border: '1px solid #ffffff1a', borderRadius: 8, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {shown.map((id) => (
                <Line
                  key={id}
                  type="monotone"
                  dataKey={id}
                  name={PLATFORMS[id].name + (profiles[id]?.source === 'demo' ? ' (demo)' : '')}
                  stroke={PLATFORMS[id].color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
