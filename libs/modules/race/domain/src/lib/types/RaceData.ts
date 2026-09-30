import { z } from 'zod';

import { PICK_COUNT_LIST } from '../constants';

const isTimezone = (timezone: string): boolean => {
  try {
    new Intl.DateTimeFormat('en', { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
};

export const RaceName = z.string().trim().min(3).max(100);
export const RaceTimezone = z
  .string()
  .refine(isTimezone, 'Unknown IANA timezone');
export const PickCount = z.union([
  z.literal(PICK_COUNT_LIST[0]),
  z.literal(PICK_COUNT_LIST[1]),
]);
export type PickCount = z.infer<typeof PickCount>;
export const TimeTolerancePercent = z.number().positive().max(100);

export const RaceData = z.object({
  name: RaceName,
  location: z.string().trim().min(1).max(100),
  distanceInKm: z.number().positive().max(1000),
  elevationGainInMeters: z.number().int().nonnegative().max(50000),
  timezone: RaceTimezone,
  websiteUrl: z.string().url().nullable(),
  liveTrailUrl: z.string().url().nullable(),
  pickCount: PickCount,
  timeTolerancePercent: TimeTolerancePercent,
});
export type RaceData = z.infer<typeof RaceData>;
