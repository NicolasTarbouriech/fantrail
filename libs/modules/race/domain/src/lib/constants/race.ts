import { RaceStatus } from '../enums';

export const PICK_COUNT_LIST = [3, 5] as const;
export const DEFAULT_PICK_COUNT = 5;
export const DEFAULT_TIME_TOLERANCE_PERCENT = 3;

// Races that count in leaderboards: drafts and cancelled races stay out.
export const PUBLIC_RACE_STATUS_LIST = [
  RaceStatus.Open,
  RaceStatus.Locked,
  RaceStatus.Scored,
];

// Players also see cancelled races, greyed out, so their picks do not vanish silently.
export const PLAYER_RACE_STATUS_LIST = [
  ...PUBLIC_RACE_STATUS_LIST,
  RaceStatus.Cancelled,
];
