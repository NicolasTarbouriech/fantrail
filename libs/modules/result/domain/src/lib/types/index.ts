import { z } from 'zod';

export const FieldId = z.string().uuid();
export type FieldId = z.infer<typeof FieldId>;

export const RunnerId = z.string().uuid();
export type RunnerId = z.infer<typeof RunnerId>;

export const RESULT_RANKING_SIZE = 10;

export const FieldResultData = z.object({
  rankingList: z.array(RunnerId).min(1).max(RESULT_RANKING_SIZE),
  winnerTimeInSeconds: z
    .number()
    .int()
    .positive()
    .max(100 * 3600),
  dnfRunnerIdList: z.array(RunnerId),
});
export type FieldResultData = z.infer<typeof FieldResultData>;
