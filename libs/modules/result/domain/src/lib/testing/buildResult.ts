import { FieldResultAggregate } from '../aggregates';
import { FieldResultData } from '../types';
import { ResultField, ResultFieldData } from '../valueObjects';

export const RESULT_FIELD_ID = '22222222-2222-4222-8222-222222222222';

export const buildResultRunnerId = (n: number): string =>
  `44444444-4444-4444-8444-${String(n).padStart(12, '0')}`;

export function buildResultField(
  overrides: Partial<ResultFieldData> = {},
): ResultField {
  return ResultField.create({
    fieldId: RESULT_FIELD_ID,
    isLocked: true,
    runnerIdList: Array.from({ length: 30 }, (_, index) =>
      buildResultRunnerId(index + 1),
    ),
    ...overrides,
  });
}

export function buildFieldResultData(
  overrides: Partial<FieldResultData> = {},
): FieldResultData {
  return {
    rankingList: Array.from({ length: 10 }, (_, index) =>
      buildResultRunnerId(index + 1),
    ),
    winnerTimeInSeconds: 23 * 3600 + 45 * 60,
    dnfRunnerIdList: [buildResultRunnerId(20)],
    ...overrides,
  };
}

export function buildFieldResultAggregate({
  version = 0,
  data = null,
  publishedAt = null,
}: {
  version?: number;
  data?: FieldResultData | null;
  publishedAt?: Date | null;
} = {}): FieldResultAggregate {
  return new FieldResultAggregate(RESULT_FIELD_ID, version, data, publishedAt);
}
