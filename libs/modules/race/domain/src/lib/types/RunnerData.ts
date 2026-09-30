import { z } from 'zod';

import { IndexSource } from '../enums';

export const RunnerIndex = z.number().int().positive().max(1000);

export const RunnerData = z.object({
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(60),
  nationality: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}$/, 'ISO 3166-1 alpha-3 code expected')
    .nullable(),
  index: RunnerIndex.nullable(),
  indexSource: z.nativeEnum(IndexSource).nullable(),
  utmbUrl: z.string().url().nullable(),
  itraUrl: z.string().url().nullable(),
});
export type RunnerData = z.infer<typeof RunnerData>;
