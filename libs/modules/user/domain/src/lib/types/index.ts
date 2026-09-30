import { z } from 'zod';

export const UserId = z.string().uuid();
export type UserId = z.infer<typeof UserId>;

export const Email = z.string().trim().toLowerCase().email().max(254);
export type Email = z.infer<typeof Email>;

export const Pseudo = z
  .string()
  .trim()
  .min(3)
  .max(20)
  .regex(
    /^[\p{L}\p{N}_.\- ]+$/u,
    'Letters, digits, spaces, dots, dashes and underscores only',
  );
export type Pseudo = z.infer<typeof Pseudo>;

// bcrypt ignores everything past 72 bytes.
export const PlainPassword = z
  .string()
  .min(8)
  .max(72)
  .regex(/\p{L}/u, 'Password needs a letter')
  .regex(/\p{N}/u, 'Password needs a digit')
  .regex(/[^\p{L}\p{N}\s]/u, 'Password needs a special character');
export type PlainPassword = z.infer<typeof PlainPassword>;

export const CreateUserData = z.object({
  email: Email,
  pseudo: Pseudo,
  passwordHash: z.string().min(1),
});
export type CreateUserData = z.infer<typeof CreateUserData>;
