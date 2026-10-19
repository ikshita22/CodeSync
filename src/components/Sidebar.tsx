import type { View } from '../types';

interface Props {
  view: View;
  onView: (v: View) => void;
  demoMode: boolean;
  onDemoMode: (v: boolean) => void;
}

const items: { id: View; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: 'M3 12l9-8 9 8M5 10v10h5v-6h4v6h5V10' },
  {
    id: 'profiles',
    label: 'My Profiles',
    icon: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM4 21a8 8 0 0 1 16 0',
  },
];

export function Sidebar({ view, onView, demoMode, onDemoMode }: Props) {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 border-b border-white/5 bg-[#0e1016] p-4 md:min-h-screen md:w-60 md:border-b-0 md:border-r">
      <div className="flex items-center gap-2.5 px-1">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-400 font-mono text-sm font-bold text-white">
          {'</>'}
        </div>
        <span className="text-lg font-semibold tracking-tight text-white">CodeSync</span>
      </div>

      <nav className="flex gap-1 md:flex-col">
        {items.map((it) => {
          const active = view === it.id;
          return (
            <button
              key={it.id}
              onClick={() => onView(it.id)}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
              }`}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d={it.icon} />
              </svg>
              {it.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-white/5 bg-white/[0.03] p-3">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={demoMode}
            onChange={(e) => onDemoMode(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-amber-400"
          />
          <span className="text-xs leading-snug text-zinc-400">
            <span className="block font-medium text-zinc-200">Demo mode</span>
            Fill platforms you haven't connected with sample data (always labeled DEMO).
          </span>
        </label>
      </div>
    </aside>
  );
}
