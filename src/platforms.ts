import type { PlatformId } from './types';

export interface PlatformMeta {
  id: PlatformId;
  name: string;
  color: string;
  hasRating: boolean;
  hasSolved: boolean;
  placeholder: string;
  profileUrl: (username: string) => string;
  /** returns an error message, or null when the username looks valid */
  validate: (username: string) => string | null;
}

const check = (re: RegExp, msg: string) => (u: string) => {
  if (!u) return 'Enter a username first.';
  return re.test(u) ? null : msg;
};

export const PLATFORMS: Record<PlatformId, PlatformMeta> = {
  leetcode: {
    id: 'leetcode',
    name: 'LeetCode',
    color: '#FFA116',
    hasRating: true,
    hasSolved: true,
    placeholder: 'LeetCode username',
    profileUrl: (u) => `https://leetcode.com/u/${encodeURIComponent(u)}/`,
    validate: check(/^[A-Za-z0-9_-]{1,40}$/, 'Use 1–40 letters, numbers, "_" or "-".'),
  },
  codeforces: {
    id: 'codeforces',
    name: 'Codeforces',
    color: '#4aa3ff',
    hasRating: true,
    hasSolved: true,
    placeholder: 'Codeforces handle',
    profileUrl: (u) => `https://codeforces.com/profile/${encodeURIComponent(u)}`,
    validate: check(/^[A-Za-z0-9_.-]{3,24}$/, 'Handles are 3–24 characters: letters, numbers, ".", "_" or "-".'),
  },
  codechef: {
    id: 'codechef',
    name: 'CodeChef',
    color: '#c58b5a',
    hasRating: true,
    hasSolved: true,
    placeholder: 'CodeChef username',
    profileUrl: (u) => `https://www.codechef.com/users/${encodeURIComponent(u)}`,
    validate: check(/^[A-Za-z0-9_]{3,20}$/, 'Use 3–20 letters, numbers or "_".'),
  },
  hackerrank: {
    id: 'hackerrank',
    name: 'HackerRank',
    color: '#2ec866',
    hasRating: false,
    hasSolved: true,
    placeholder: 'HackerRank username',
    profileUrl: (u) => `https://www.hackerrank.com/profile/${encodeURIComponent(u)}`,
    validate: check(/^[A-Za-z0-9_.-]{1,40}$/, 'Use 1–40 letters, numbers, ".", "_" or "-".'),
  },
  github: {
    id: 'github',
    name: 'GitHub',
    color: '#b4a0ff',
    hasRating: false,
    hasSolved: false,
    placeholder: 'GitHub username',
    profileUrl: (u) => `https://github.com/${encodeURIComponent(u)}`,
    validate: check(
      /^(?!-)(?!.*--)[A-Za-z0-9-]{1,39}(?<!-)$/,
      'Use 1–39 letters, numbers or single hyphens (no leading/trailing hyphen).',
    ),
  },
};

export const PLATFORM_IDS = Object.keys(PLATFORMS) as PlatformId[];
