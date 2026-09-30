import { PredictionAggregate } from '../aggregates';
import { PickSlotList } from '../types';
import { PredictionField, PredictionFieldData } from '../valueObjects';

export const PREDICTION_ID = '77777777-7777-4777-8777-777777777777';
export const PREDICTION_USER_ID = '66666666-6666-4666-8666-666666666666';
export const PREDICTION_FIELD_ID = '22222222-2222-4222-8222-222222222222';

export const buildPredictionRunnerId = (n: number): string =>
  `44444444-4444-4444-8444-${String(n).padStart(12, '0')}`;

export function buildPredictionField(
  overrides: Partial<PredictionFieldData> = {},
): PredictionField {
  return PredictionField.create({
    fieldId: PREDICTION_FIELD_ID,
    pickCount: 5,
    isOpen: true,
    runnerIdList: Array.from({ length: 10 }, (_, index) =>
      buildPredictionRunnerId(index + 1),
    ),
    withdrawnRunnerIdList: [],
    ...overrides,
  });
}

export function buildPredictionAggregate({
  pickList = [null, null, null, null, null],
  winnerTimeEstimateInSeconds = null,
  finalizedAt = null,
}: {
  pickList?: PickSlotList;
  winnerTimeEstimateInSeconds?: number | null;
  finalizedAt?: Date | null;
} = {}): PredictionAggregate {
  return new PredictionAggregate(
    PREDICTION_ID,
    PREDICTION_USER_ID,
    PREDICTION_FIELD_ID,
    pickList,
    winnerTimeEstimateInSeconds,
    finalizedAt,
    new Date('2026-10-01T10:00:00Z'),
  );
}
