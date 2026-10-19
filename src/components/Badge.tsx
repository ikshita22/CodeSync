import type { ReactNode } from 'react';

type Tone = 'demo' | 'live' | 'ok' | 'error' | 'muted' | 'busy';

const tones: Record<Tone, string> = {
  demo: 'bg-amber-500/10 text-amber-300 ring-amber-400/30',
  live: 'bg-emerald-500/10 text-emerald-300 ring-emerald-400/30',
  ok: 'bg-emerald-500/10 text-emerald-300 ring-emerald-400/30',
  error: 'bg-rose-500/10 text-rose-300 ring-rose-400/30',
  muted: 'bg-zinc-500/10 text-zinc-400 ring-zinc-400/20',
  busy: 'bg-sky-500/10 text-sky-300 ring-sky-400/30',
};

export function Badge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg className={`h-4 w-4 animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
