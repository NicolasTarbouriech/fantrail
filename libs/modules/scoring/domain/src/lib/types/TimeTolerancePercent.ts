import { z } from 'zod';

export const TimeTolerancePercent = z.number().positive().max(100);
export type TimeTolerancePercent = z.infer<typeof TimeTolerancePercent>;
