import { FieldScoreRepository } from '@trail/modules/scoring/domain';
import {
  SCORING_FIELD_ID,
  buildPlayerFieldScore,
  buildScoringUserId,
} from '@trail/modules/scoring/domain-testing';

import { GetLeaderboardQuery } from './GetLeaderboardQuery';
import { GetLeaderboardQueryHandler } from './GetLeaderboardQueryHandler';
import { GetPlayerFieldScoreQuery } from './GetPlayerFieldScoreQuery';
import { GetPlayerFieldScoreQueryHandler } from './GetPlayerFieldScoreQueryHandler';
import { ListFieldScoresQuery } from './ListFieldScoresQuery';
import { ListFieldScoresQueryHandler } from './ListFieldScoresQueryHandler';

describe('scoring query handlers', () => {
  const score = buildPlayerFieldScore({ userId: buildScoringUserId(1) });
  const fieldScoreRepository = {
    listByFieldIdList: jest.fn().mockResolvedValue([score]),
    findByUserAndField: jest.fn().mockResolvedValue(score),
  } as unknown as FieldScoreRepository;

  it('GetLeaderboardQueryHandler ranks the given players on the given fields', async () => {
    const leaderboard = await new GetLeaderboardQueryHandler(
      fieldScoreRepository,
    ).execute(
      new GetLeaderboardQuery({
        fieldIdList: [SCORING_FIELD_ID],
        userIdList: [buildScoringUserId(1), buildScoringUserId(2)],
      }),
    );
    expect(leaderboard.map(({ rank, userId }) => [rank, userId])).toEqual([
      [1, buildScoringUserId(1)],
      [2, buildScoringUserId(2)],
    ]);
  });

  it('GetPlayerFieldScoreQueryHandler reads the scorecard of a player', async () => {
    await expect(
      new GetPlayerFieldScoreQueryHandler(fieldScoreRepository).execute(
        new GetPlayerFieldScoreQuery({
          userId: buildScoringUserId(1),
          fieldId: SCORING_FIELD_ID,
        }),
      ),
    ).resolves.toBe(score);
  });

  it('ListFieldScoresQueryHandler lists the scores of some fields', async () => {
    await expect(
      new ListFieldScoresQueryHandler(fieldScoreRepository).execute(
        new ListFieldScoresQuery({ fieldIdList: [SCORING_FIELD_ID] }),
      ),
    ).resolves.toEqual([score]);
  });
});
