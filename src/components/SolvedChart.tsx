import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { PlatformId, ProfileData } from '../types';
import { PLATFORMS, PLATFORM_IDS } from '../platforms';
import { Badge } from './Badge';

interface Props {
  profiles: Partial<Record<PlatformId, ProfileData>>;
}

export function SolvedChart({ profiles }: Props) {
  const data = PLATFORM_IDS.filter((id) => profiles[id]?.solved !== undefined).map((id) => ({
    id,
    name: PLATFORMS[id].name,
    solved: profiles[id]!.solved!,
    color: PLATFORMS[id].color,
    demo: profiles[id]!.source === 'demo',
  }));
  const hasDemo = data.some((d) => d.demo);

  return (
    <section className="rounded-xl border border-white/5 bg-[#12151d] p-5">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-white">Problems solved by platform</h2>
        {hasDemo && <Badge tone="demo">DEMO data</Badge>}
      </div>

      <div className="mt-4 h-72">
        {data.length === 0 ? (
          <div className="grid h-full place-items-center rounded-lg border border-dashed border-white/10 text-center text-sm text-zinc-500">
            No solved-problem counts yet.
            <br />
            Connect a platform, or turn on Demo mode.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} width={40} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: '#ffffff08' }}
                contentStyle={{ background: '#0b0d12', border: '1px solid #ffffff1a', borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="solved" name="Solved" radius={[6, 6, 0, 0]}>
                {data.map((d) => (
                  <Cell key={d.id} fill={d.color} fillOpacity={d.demo ? 0.55 : 1} />
                ))}
                <LabelList dataKey="solved" position="top" fill="#d1d5db" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      {hasDemo && <p className="mt-2 text-xs text-zinc-500">Faded bars are demo values, not real statistics.</p>}
    </section>
  );
}
