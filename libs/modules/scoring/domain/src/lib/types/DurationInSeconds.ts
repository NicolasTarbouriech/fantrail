import { z } from 'zod';

export const DurationInSeconds = z.number().int().positive();
export type DurationInSeconds = z.infer<typeof DurationInSeconds>;
