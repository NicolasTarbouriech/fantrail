import { z } from 'zod';

export const RunnerId = z.string().uuid();
export type RunnerId = z.infer<typeof RunnerId>;
