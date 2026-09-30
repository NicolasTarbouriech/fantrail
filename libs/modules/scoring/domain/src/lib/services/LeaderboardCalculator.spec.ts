import {
  buildPlayerFieldScore,
  buildRunnerId,
  buildScoringUserId,
} from '../testing';
import { LeaderboardCalculator } from './LeaderboardCalculator';

const u = buildScoringUserId;
const OTHER_FIELD_ID = '33333333-3333-4333-8333-333333333333';

describe('LeaderboardCalculator', () => {
  it('ranks by total and gives 0 to players without score', () => {
    const leaderboard = LeaderboardCalculator.rank(
      [u(1), u(2), u(3)],
      [
        buildPlayerFieldScore({ userId: u(2) }),
        buildPlayerFieldScore({ userId: u(2), fieldId: OTHER_FIELD_ID }),
        buildPlayerFieldScore({ userId: u(1) }),
      ],
    );
    expect(
      leaderboard.map(({ rank, userId, scoredFieldCount }) => [
        rank,
        userId,
        scoredFieldCount,
      ]),
    ).toEqual([
      [1, u(2), 2],
      [2, u(1), 1],
      [3, u(3), 0],
    ]);
    expect(leaderboard[2]).toMatchObject({
      total: 0,
      timeGapInSeconds: null,
      lastFinalizedAt: null,
    });
  });

  it('breaks a tie with the lowest time gap', () => {
    const pickList = [
      buildRunnerId(6),
      buildRunnerId(7),
      buildRunnerId(8),
      buildRunnerId(9),
      buildRunnerId(10),
    ];
    const leaderboard = LeaderboardCalculator.rank(
      [u(1), u(2)],
      [
        buildPlayerFieldScore({
          userId: u(1),
          pickList,
          winnerTimeEstimateInSeconds: 30 * 3600,
        }),
        buildPlayerFieldScore({
          userId: u(2),
          pickList,
          winnerTimeEstimateInSeconds: 28 * 3600,
        }),
      ],
    );
    expect(leaderboard[0].total).toBe(leaderboard[1].total);
    expect(leaderboard.map(({ rank, userId }) => [rank, userId])).toEqual([
      [1, u(2)],
      [2, u(1)],
    ]);
  });

  it('then with the earliest finalization, and shares the rank when everything is equal', () => {
    const leaderboard = LeaderboardCalculator.rank(
      [u(3), u(2), u(1)],
      [
        buildPlayerFieldScore({
          userId: u(1),
          finalizedAt: new Date('2026-10-12T10:00:00Z'),
        }),
        buildPlayerFieldScore({
          userId: u(2),
          finalizedAt: new Date('2026-10-11T10:00:00Z'),
        }),
        buildPlayerFieldScore({
          userId: u(3),
          finalizedAt: new Date('2026-10-11T10:00:00Z'),
        }),
      ],
    );
    expect(leaderboard.map(({ rank, userId }) => [rank, userId])).toEqual([
      [1, u(2)],
      [1, u(3)],
      [3, u(1)],
    ]);
  });

  it('ranks a player who scored 0 ahead of a player without prediction', () => {
    const pickList = [
      buildRunnerId(11),
      buildRunnerId(12),
      buildRunnerId(13),
      buildRunnerId(14),
      buildRunnerId(15),
    ];
    const leaderboard = LeaderboardCalculator.rank(
      [u(1), u(2)],
      [
        buildPlayerFieldScore({
          userId: u(2),
          pickList,
          winnerTimeEstimateInSeconds: 40 * 3600,
        }),
      ],
    );
    expect(
      leaderboard.map(({ rank, userId, total }) => [rank, userId, total]),
    ).toEqual([
      [1, u(2), 0],
      [2, u(1), 0],
    ]);
  });

  it('gives the same rank to every player without prediction', () => {
    const leaderboard = LeaderboardCalculator.rank([u(2), u(1)], []);
    expect(leaderboard.map(({ rank, userId }) => [rank, userId])).toEqual([
      [1, u(1)],
      [1, u(2)],
    ]);
  });

  it('ignores scores of players outside the list and duplicates in the list', () => {
    const leaderboard = LeaderboardCalculator.rank(
      [u(1), u(1)],
      [buildPlayerFieldScore({ userId: u(2) })],
    );
    expect(leaderboard).toHaveLength(1);
    expect(leaderboard[0]).toMatchObject({ rank: 1, userId: u(1), total: 0 });
  });
});
