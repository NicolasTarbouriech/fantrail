import { z } from 'zod';

import { INVITE_CODE_ALPHABET, INVITE_CODE_LENGTH } from '../constants';

export const LeagueId = z.string().uuid();
export type LeagueId = z.infer<typeof LeagueId>;

export const UserId = z.string().uuid();
export type UserId = z.infer<typeof UserId>;

export const RaceId = z.string().uuid();
export type RaceId = z.infer<typeof RaceId>;

export const LeagueName = z.string().trim().min(3).max(40);
export type LeagueName = z.infer<typeof LeagueName>;

export const InviteCode = z
  .string()
  .trim()
  .toUpperCase()
  .length(INVITE_CODE_LENGTH)
  .regex(
    new RegExp(`^[${INVITE_CODE_ALPHABET}]+$`),
    'Unknown character in invite code',
  );
export type InviteCode = z.infer<typeof InviteCode>;

export const LeagueActor = z.object({
  userId: UserId,
  isAdmin: z.boolean(),
});
export type LeagueActor = z.infer<typeof LeagueActor>;
