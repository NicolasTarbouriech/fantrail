import {
  FieldScoreRepository,
  FieldScoringSourceRepository,
} from '@trail/modules/scoring/domain';
import {
  SCORING_FIELD_ID,
  buildFieldScoringSource,
  buildScoringUserId,
} from '@trail/modules/scoring/domain-testing';

import { ComputeFieldScoresCommand } from './ComputeFieldScoresCommand';
import { ComputeFieldScoresCommandHandler } from './ComputeFieldScoresCommandHandler';

describe('ComputeFieldScoresCommandHandler', () => {
  function given(source: ReturnType<typeof buildFieldScoringSource> | null) {
    const fieldScoreRepository = {
      replaceForField: jest.fn(),
    } as unknown as FieldScoreRepository;
    const fieldScoringSourceRepository = {
      findByFieldId: jest.fn().mockResolvedValue(source),
    } as unknown as FieldScoringSourceRepository;
    return {
      fieldScoreRepository,
      handler: new ComputeFieldScoresCommandHandler(
        fieldScoreRepository,
        fieldScoringSourceRepository,
      ),
    };
  }

  it('replaces the scores of the field with the new ones', async () => {
    const { handler, fieldScoreRepository } = given(buildFieldScoringSource());
    const scoreList = await handler.execute(
      new ComputeFieldScoresCommand({ fieldId: SCORING_FIELD_ID }),
    );
    expect(scoreList.map(({ userId }) => userId)).toEqual([
      buildScoringUserId(1),
      buildScoringUserId(2),
    ]);
    expect(fieldScoreRepository.replaceForField).toHaveBeenCalledWith(
      SCORING_FIELD_ID,
      scoreList,
    );
  });

  it('keeps the scores untouched without published result', async () => {
    const { handler, fieldScoreRepository } = given(null);
    await expect(
      handler.execute(
        new ComputeFieldScoresCommand({ fieldId: SCORING_FIELD_ID }),
      ),
    ).resolves.toEqual([]);
    expect(fieldScoreRepository.replaceForField).not.toHaveBeenCalled();
  });
});
