import type { PlatformId, ProfileData, RatingPoint } from '../types';

/**
 * DEMO DATA — invented sample values used only to preview the UI.
 * Nothing in this file comes from a real account or platform.
 */
const series = (values: number[]): RatingPoint[] =>
  values.map((rating, i) => ({ t: Date.UTC(2026, 2 + i, 1), rating }));

const base = { source: 'demo' as const, fetchedAt: 0 };

export const DEMO: Record<PlatformId, ProfileData> = {
  leetcode: {
    ...base,
    platform: 'leetcode',
    username: 'demo_user',
    rating: 1843,
    maxRating: 1871,
    rank: 'Knight',
    solved: 412,
    ratingHistory: series([1520, 1588, 1612, 1701, 1690, 1764, 1810, 1843]),
    metrics: [
      { label: 'Easy', value: '168' },
      { label: 'Medium', value: '201' },
      { label: 'Hard', value: '43' },
    ],
  },
  codeforces: {
    ...base,
    platform: 'codeforces',
    username: 'demo_user',
    rating: 1486,
    maxRating: 1523,
    rank: 'Specialist',
    solved: 538,
    ratingHistory: series([1210, 1265, 1340, 1318, 1402, 1455, 1523, 1486]),
    metrics: [
      { label: 'Contests', value: '34' },
      { label: 'Best rank', value: '#412' },
    ],
  },
  codechef: {
    ...base,
    platform: 'codechef',
    username: 'demo_user',
    rating: 1702,
    maxRating: 1745,
    rank: '4★',
    solved: 297,
    ratingHistory: series([1450, 1498, 1560, 1611, 1655, 1630, 1688, 1702]),
    metrics: [
      { label: 'Contests', value: '27' },
      { label: 'Global rank', value: '#2,184' },
    ],
  },
  hackerrank: {
    ...base,
    platform: 'hackerrank',
    username: 'demo_user',
    solved: 186,
    metrics: [
      { label: 'Gold badges', value: '4' },
      { label: 'Certificates', value: '3' },
    ],
  },
  github: {
    ...base,
    platform: 'github',
    username: 'demo_user',
    metrics: [
      { label: 'Public repos', value: '23' },
      { label: 'Followers', value: '41' },
      { label: 'Stars earned', value: '97' },
    ],
  },
};
