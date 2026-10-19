import type { Metric, PlatformId, ProfileData } from '../types';
import { PLATFORMS } from '../platforms';

// Vite proxies unreliable cross-origin APIs while developing locally. Deployed apps
// can set VITE_API_PROXY_URL to their own server proxy; otherwise public APIs are used directly.
const api = (service: string, path: string, remote: string) => {
  const proxy = import.meta.env.VITE_API_PROXY_URL;
  if (proxy) return `${proxy.replace(/\/$/, '')}/${service}${path}`;
  return import.meta.env.DEV ? `/api/${service}${path}` : remote;
};

const json = async <T>(url: string, init?: RequestInit): Promise<T> => {
  let response: Response;
  try { response = await fetch(url, init); } catch { throw new Error('Could not reach this platform. Check your connection and try again.'); }
  if (!response.ok) {
    if (response.status === 404) throw new Error('This public profile was not found.');
    if (response.status === 403 || response.status === 429) throw new Error('This platform is rate-limiting requests. Please try again shortly.');
    throw new Error(`The platform returned an error (${response.status}). Please try again.`);
  }
  return response.json() as Promise<T>;
};

const uniqueSolved = (submissions: { contestId?: number; verdict?: string; problem?: { contestId?: number; index?: string; name?: string } }[]) => new Set(
  submissions.filter((s) => s.verdict === 'OK').map((s) => `${s.contestId ?? s.problem?.contestId ?? 'gym'}:${s.problem?.index ?? s.problem?.name ?? ''}`),
).size;

async function codeforces(username: string): Promise<ProfileData> {
  type Api<T> = { status: string; result?: T; comment?: string };
  type User = { handle: string; rating?: number; maxRating?: number; rank?: string; maxRank?: string };
  type History = { ratingUpdateTimeSeconds: number; newRating: number };
  type Submission = { contestId?: number; verdict?: string; problem?: { contestId?: number; index?: string; name?: string } };
  const base = api('codeforces', '/api/', 'https://codeforces.com/api/');
  const [info, history, submissions] = await Promise.all([
    json<Api<User[]>>(`${base}user.info?handles=${encodeURIComponent(username)}`),
    json<Api<History[]>>(`${base}user.rating?handle=${encodeURIComponent(username)}`),
    json<Api<Submission[]>>(`${base}user.status?handle=${encodeURIComponent(username)}&from=1&count=10000`),
  ]);
  if (info.status !== 'OK' || !info.result?.[0]) throw new Error(info.comment ?? 'This Codeforces handle was not found.');
  if (history.status !== 'OK' || submissions.status !== 'OK') throw new Error('Codeforces could not load the complete profile. Please retry.');
  const user = info.result[0];
  return {
    platform: 'codeforces', username: user.handle, source: 'live', fetchedAt: Date.now(), rating: user.rating, maxRating: user.maxRating, rank: user.rank,
    solved: uniqueSolved(submissions.result ?? []),
    ratingHistory: (history.result ?? []).map((p) => ({ t: p.ratingUpdateTimeSeconds * 1000, rating: p.newRating })),
    metrics: [{ label: 'Contests', value: String(history.result?.length ?? 0) }, { label: 'Best rank', value: user.maxRank ?? '—' }],
  };
}

async function leetcode(username: string): Promise<ProfileData> {
  type Submission = { difficulty: string; count: number };
  type LcUser = { username: string; profile?: { ranking?: number }; submitStatsGlobal?: { acSubmissionNum?: Submission[] } };
  type ContestRanking = { rating?: number };
  type History = { attended: boolean; rating: number; contest: { startTime: number } };
  type Result = { data?: { matchedUser?: LcUser | null; userContestRanking?: ContestRanking | null; userContestRankingHistory?: History[] | null }; errors?: { message: string }[] };
  // Contest fields are root queries, not fields on matchedUser. Keeping them separate
  // is required by LeetCode's public GraphQL schema.
  const query = `query profile($username: String!) { matchedUser(username: $username) { username profile { ranking } submitStatsGlobal { acSubmissionNum { difficulty count } } } userContestRanking(username: $username) { rating } userContestRankingHistory(username: $username) { attended rating contest { startTime } } }`;
  const payload = await json<Result>(api('leetcode', '/graphql', 'https://leetcode.com/graphql'), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ query, variables: { username } }) });
  const user = payload.data?.matchedUser;
  if (!user) throw new Error(payload.errors?.[0]?.message ?? 'This LeetCode username was not found.');
  const counts = Object.fromEntries((user.submitStatsGlobal?.acSubmissionNum ?? []).map((x) => [x.difficulty, x.count]));
  const history = (payload.data?.userContestRankingHistory ?? []).filter((x) => x.attended && x.rating > 0);
  return {
    platform: 'leetcode', username: user.username, source: 'live', fetchedAt: Date.now(), rating: payload.data?.userContestRanking?.rating ? Math.round(payload.data.userContestRanking.rating) : undefined,
    rank: user.profile?.ranking ? `#${user.profile.ranking.toLocaleString()}` : undefined, solved: counts.All ?? (counts.Easy ?? 0) + (counts.Medium ?? 0) + (counts.Hard ?? 0),
    ratingHistory: history.map((x) => ({ t: x.contest.startTime * 1000, rating: Math.round(x.rating) })),
    metrics: [{ label: 'Easy', value: String(counts.Easy ?? 0) }, { label: 'Medium', value: String(counts.Medium ?? 0) }, { label: 'Hard', value: String(counts.Hard ?? 0) }],
  };
}

async function github(username: string): Promise<ProfileData> {
  type User = { login: string; public_repos: number; followers: number; following: number; public_gists: number };
  const user = await json<User>(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers: { accept: 'application/vnd.github+json' } });
  const metrics: Metric[] = [{ label: 'Public repos', value: String(user.public_repos) }, { label: 'Followers', value: String(user.followers) }, { label: 'Following', value: String(user.following) }, { label: 'Public gists', value: String(user.public_gists) }];
  return { platform: 'github', username: user.login, source: 'live', fetchedAt: Date.now(), metrics };
}

async function codechef(username: string): Promise<ProfileData> {
  type User = { username?: string; currentRating?: number; highestRating?: number; stars?: string; globalRank?: number; countryRank?: number; problemsSolved?: number };
  type Response = User & { data?: User };
  const response = await json<Response>(api('codechef', `/api/users/${encodeURIComponent(username)}`, `https://www.codechef.com/api/users/${encodeURIComponent(username)}`));
  const user = response.data ?? response;
  if (!user.username) throw new Error('This CodeChef username was not found.');
  return { platform: 'codechef', username: user.username, source: 'live', fetchedAt: Date.now(), rating: user.currentRating, maxRating: user.highestRating, rank: user.stars, solved: user.problemsSolved, metrics: [{ label: 'Global rank', value: user.globalRank ? `#${user.globalRank.toLocaleString()}` : '—' }, { label: 'Country rank', value: user.countryRank ? `#${user.countryRank.toLocaleString()}` : '—' }] };
}

/** Loads only public profile data. This app never requests or stores platform passwords. */
export async function fetchProfile(platform: PlatformId, username: string): Promise<ProfileData> {
  if (platform === 'codeforces') return codeforces(username);
  if (platform === 'leetcode') return leetcode(username);
  if (platform === 'github') return github(username);
  if (platform === 'codechef') return codechef(username);
  throw new Error(`${PLATFORMS[platform].name} does not offer a browser-safe public stats endpoint. Your account is not connected.`);
}
