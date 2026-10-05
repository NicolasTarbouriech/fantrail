export type LeaderboardSource = {
  rank: number;
  userId: string;
  total: number;
  scoredFieldCount: number;
};

export type MyStanding = {
  rank: number;
  playerCount: number;
};

export function findMyStanding(
  entries: LeaderboardSource[],
  userId: string,
): MyStanding | null {
  const mine = entries.find((entry) => entry.userId === userId);
  return mine ? { rank: mine.rank, playerCount: entries.length } : null;
}
