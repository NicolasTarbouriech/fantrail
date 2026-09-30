import { FieldScoreCalculator } from '../services';
import {
  FieldScoringSource,
  FieldScoringSourceData,
  PlayerFieldScore,
} from '../valueObjects';
import { buildRunnerId } from './buildRunnerId';
import { buildScoringInput } from './buildScoringInput';

export const SCORING_FIELD_ID = '22222222-2222-4222-8222-222222222222';
export const buildScoringUserId = (n: number): string =>
  `66666666-6666-4666-8666-${String(n).padStart(12, '0')}`;

export function buildFieldScoringSource(
  overrides: Partial<FieldScoringSourceData> = {},
): FieldScoringSource {
  const input = buildScoringInput();
  return FieldScoringSource.create({
    fieldId: SCORING_FIELD_ID,
    resultVersion: 1,
    result: input.result,
    timeTolerancePercent: 3,
    favoriteRankByRunnerId: input.favoriteRankByRunnerId,
    predictionList: [
      {
        userId: buildScoringUserId(1),
        ...input.prediction,
        finalizedAt: new Date('2026-10-10T10:00:00Z'),
      },
      {
        userId: buildScoringUserId(2),
        pickList: [
          buildRunnerId(5),
          buildRunnerId(4),
          buildRunnerId(3),
          buildRunnerId(2),
          buildRunnerId(1),
        ],
        winnerTimeEstimateInSeconds: 25 * 3600,
        finalizedAt: new Date('2026-10-11T10:00:00Z'),
      },
    ],
    ...overrides,
  });
}

export function buildPlayerFieldScore({
  userId = buildScoringUserId(1),
  fieldId = SCORING_FIELD_ID,
  winnerTimeEstimateInSeconds = 24 * 3600,
  finalizedAt = new Date('2026-10-10T10:00:00Z'),
  pickList,
}: {
  userId?: string;
  fieldId?: string;
  winnerTimeEstimateInSeconds?: number;
  finalizedAt?: Date;
  pickList?: string[];
} = {}): PlayerFieldScore {
  const input = buildScoringInput();
  return new PlayerFieldScore(
    userId,
    fieldId,
    1,
    FieldScoreCalculator.calculate({
      ...input,
      prediction: {
        pickList: pickList ?? input.prediction.pickList,
        winnerTimeEstimateInSeconds,
      },
    }),
    finalizedAt,
  );
}
