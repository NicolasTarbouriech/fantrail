import { z } from 'zod';

export const FavoriteRank = z.number().int().positive();
export type FavoriteRank = z.infer<typeof FavoriteRank>;
