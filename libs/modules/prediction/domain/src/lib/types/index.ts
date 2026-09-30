import { z } from 'zod';

export const PredictionId = z.string().uuid();
export type PredictionId = z.infer<typeof PredictionId>;

export const UserId = z.string().uuid();
export type UserId = z.infer<typeof UserId>;

export const FieldId = z.string().uuid();
export type FieldId = z.infer<typeof FieldId>;

export const RunnerId = z.string().uuid();
export type RunnerId = z.infer<typeof RunnerId>;

// Up to 100 hours, the longest ultras stay well below.
export const WinnerTimeInSeconds = z
  .number()
  .int()
  .positive()
  .max(100 * 3600);
export type WinnerTimeInSeconds = z.infer<typeof WinnerTimeInSeconds>;

// One slot per pick position, null while the position is not chosen yet.
export const PickSlotList = z.array(RunnerId.nullable()).min(1).max(10);
export type PickSlotList = z.infer<typeof PickSlotList>;

export const PredictionData = z.object({
  pickList: PickSlotList,
  winnerTimeEstimateInSeconds: WinnerTimeInSeconds.nullable(),
});
export type PredictionData = z.infer<typeof PredictionData>;
