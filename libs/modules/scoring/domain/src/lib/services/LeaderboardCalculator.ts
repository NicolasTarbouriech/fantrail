import { UserId } from '../types';
import { LeaderboardEntry, PlayerFieldScore } from '../valueObjects';

interface Row {
  userId: UserId;
  total: number;
  scoredFieldCount: number;
  timeGapInSeconds: number | null;
  lastFinalizedAt: Date | null;
}

// Ties: lowest cumulated time gap, then earliest finalization. A player without score is ranked with 0.
export class LeaderboardCalculator {
  static rank(
    userIdList: UserId[],
    scoreList: PlayerFieldScore[],
  ): LeaderboardEntry[] {
    const rowList = [...new Set(userIdList)]
      .map((userId) => LeaderboardCalculator._row(userId, scoreList))
      .sort(
        (a, b) =>
          LeaderboardCalculator._compare(a, b) ||
          a.userId.localeCompare(b.userId),
      );
    let rank = 0;
    return rowList.map((row, index) => {
      if (
        index === 0 ||
        LeaderboardCalculator._compare(rowList[index - 1], row) !== 0
      ) {
        rank = index + 1;
      }
      return new LeaderboardEntry(
        rank,
        row.userId,
        row.total,
        row.scoredFieldCount,
        row.timeGapInSeconds,
        row.lastFinalizedAt,
      );
    });
  }

  private static _compare(a: Row, b: Row): number {
    return (
      b.total - a.total ||
      LeaderboardCalculator._compareNullLast(
        a.timeGapInSeconds,
        b.timeGapInSeconds,
      ) ||
      LeaderboardCalculator._compareNullLast(
        a.lastFinalizedAt?.getTime() ?? null,
        b.lastFinalizedAt?.getTime() ?? null,
      )
    );
  }

  private static _compareNullLast(a: number | null, b: number | null): number {
    if (a === null || b === null) {
      return Number(a === null) - Number(b === null);
    }
    return a - b;
  }

  private static _row(userId: UserId, scoreList: PlayerFieldScore[]): Row {
    const playerScoreList = scoreList.filter(
      (score) => score.userId === userId,
    );
    if (playerScoreList.length === 0) {
      return {
        userId,
        total: 0,
        scoredFieldCount: 0,
        timeGapInSeconds: null,
        lastFinalizedAt: null,
      };
    }
    return {
      userId,
      total: playerScoreList.reduce((sum, score) => sum + score.total, 0),
      scoredFieldCount: playerScoreList.length,
      timeGapInSeconds: playerScoreList.reduce(
        (sum, score) => sum + score.timeGapInSeconds,
        0,
      ),
      lastFinalizedAt: new Date(
        Math.max(
          ...playerScoreList.map((score) => score.finalizedAt.getTime()),
        ),
      ),
    };
  }
}
