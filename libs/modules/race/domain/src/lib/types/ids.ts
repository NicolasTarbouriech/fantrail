import { z } from 'zod';

export const RaceId = z.string().uuid();
export type RaceId = z.infer<typeof RaceId>;

export const FieldId = z.string().uuid();
export type FieldId = z.infer<typeof FieldId>;

export const RunnerId = z.string().uuid();
export type RunnerId = z.infer<typeof RunnerId>;
