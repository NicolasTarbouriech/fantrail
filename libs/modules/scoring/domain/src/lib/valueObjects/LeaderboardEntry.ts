import { UserId } from '../types';

export class LeaderboardEntry {
  constructor(
    public readonly rank: number,
    public readonly userId: UserId,
    public readonly total: number,
    public readonly scoredFieldCount: number,
    public readonly timeGapInSeconds: number | null,
    public readonly lastFinalizedAt: Date | null,
  ) {}
}
