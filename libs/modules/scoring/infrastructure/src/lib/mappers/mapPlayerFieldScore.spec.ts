import { buildPlayerFieldScore } from '@trail/modules/scoring/domain-testing';

import {
  mapFieldScoreEntity,
  mapPlayerFieldScore,
} from './mapPlayerFieldScore';

describe('mapPlayerFieldScore', () => {
  it('maps back the breakdown written by mapFieldScoreEntity', () => {
    const score = buildPlayerFieldScore();
    const entity = mapFieldScoreEntity(score);
    expect(entity).toMatchObject({
      total: score.total,
      time_gap_in_seconds: 0,
      result_version: 1,
    });
    expect(mapPlayerFieldScore(entity)).toEqual(score);
  });
});
