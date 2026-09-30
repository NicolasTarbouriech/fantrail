import {
  SCORING_FIELD_ID,
  buildFieldScoringSource,
  buildScoringUserId,
} from '../testing';
import { FieldScoringCalculator } from './FieldScoringCalculator';

describe('FieldScoringCalculator', () => {
  it('scores every prediction of the field against the result', () => {
    const [perfect, reversed] = FieldScoringCalculator.calculate(
      buildFieldScoringSource(),
    );
    expect(perfect).toMatchObject({
      userId: buildScoringUserId(1),
      fieldId: SCORING_FIELD_ID,
      resultVersion: 1,
    });
    expect(perfect.total).toBe(2740 + 200 + 1900);
    expect(perfect.timeGapInSeconds).toBe(0);
    expect(reversed.userId).toBe(buildScoringUserId(2));
    expect(reversed.timeGapInSeconds).toBe(3600);
    expect(reversed.total).toBeLessThan(perfect.total);
  });

  it('scores nobody without prediction', () => {
    expect(
      FieldScoringCalculator.calculate(
        buildFieldScoringSource({ predictionList: [] }),
      ),
    ).toEqual([]);
  });
});
