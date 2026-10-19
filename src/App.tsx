import { useMemo, useState } from 'react';
import type { PlatformId, ProfileData, View } from './types';
import { PLATFORMS, PLATFORM_IDS } from './platforms';
import { DEMO } from './lib/demo';
import { useProfiles } from './hooks/useProfiles';
import { Sidebar } from './components/Sidebar';
import { SummaryCards } from './components/SummaryCards';
import { PlatformCard } from './components/PlatformCard';
import { ProfileRow } from './components/ProfileRow';
import { RatingChart } from './components/RatingChart';
import { SolvedChart } from './components/SolvedChart';

export default function App() {
  const [view, setView] = useState<View>('overview');
  const [demoMode, setDemoMode] = useState(false);
  const { conns, connect, disconnect } = useProfiles();
  const refreshAll = () => {
    for (const id of PLATFORM_IDS) {
      if (conns[id].status === 'connected' && conns[id].username) void connect(id, conns[id].username);
    }
  };

  // Connected data wins; otherwise fall back to labeled demo data when demo mode is on.
  const profiles = useMemo(() => {
    const out: Partial<Record<PlatformId, ProfileData>> = {};
    for (const id of PLATFORM_IDS) {
      const c = conns[id];
      if (c.status === 'connected' && c.data) out[id] = c.data;
      else if (demoMode && c.status !== 'loading' && c.status !== 'error') out[id] = DEMO[id];
    }
    return out;
  }, [conns, demoMode]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar view={view} onView={setView} demoMode={demoMode} onDemoMode={setDemoMode} />

      <main className="min-w-0 flex-1 p-5 md:p-8">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              {view === 'overview' ? 'Overview' : 'My Profiles'}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {view === 'overview'
                ? 'Live public coding stats, in one place.'
                : 'Add your public usernames. No platform password is ever requested.'}
            </p>
          </div>
          {view === 'overview' && PLATFORM_IDS.some((id) => conns[id].status === 'connected') && (
            <button onClick={refreshAll} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-200 hover:bg-white/5">
              Refresh live data
            </button>
          )}
        </header>

        {view === 'overview' ? (
          <div className="space-y-6">
            <SummaryCards conns={conns} profiles={profiles} />
            <div className="grid gap-6 xl:grid-cols-2">
              <RatingChart profiles={profiles} />
              <SolvedChart profiles={profiles} />
            </div>
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {PLATFORM_IDS.map((id) => (
                <PlatformCard
                  key={id}
                  meta={PLATFORMS[id]}
                  conn={conns[id]}
                  profile={profiles[id]}
                  onManage={() => setView('profiles')}
                  onRetry={() => connect(id, conns[id].username)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid max-w-3xl gap-4">
            {PLATFORM_IDS.map((id) => (
              <ProfileRow
                key={id}
                meta={PLATFORMS[id]}
                conn={conns[id]}
                onConnect={(u) => connect(id, u)}
                onDisconnect={() => disconnect(id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
