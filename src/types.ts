export type PlatformId = 'leetcode' | 'codeforces' | 'codechef' | 'hackerrank' | 'github';

/** 'demo' = bundled sample data. 'live' = fetched from the platform (Phase 2+). */
export type DataSource = 'demo' | 'live';

export interface RatingPoint {
  /** epoch ms */
  t: number;
  rating: number;
}

export interface Metric {
  label: string;
  value: string;
}

export interface ProfileData {
  platform: PlatformId;
  username: string;
  source: DataSource;
  fetchedAt: number;
  rating?: number;
  maxRating?: number;
  rank?: string;
  solved?: number;
  ratingHistory?: RatingPoint[];
  metrics: Metric[];
}

export type ConnectionStatus = 'idle' | 'loading' | 'connected' | 'error';

export interface ConnectionState {
  username: string;
  status: ConnectionStatus;
  error?: string;
  data?: ProfileData;
}

export type View = 'overview' | 'profiles';
