import { UserAggregate } from '../aggregates';
import { UserRole } from '../enums';

export const USER_ID = '66666666-6666-4666-8666-666666666666';

export function buildUserAggregate({
  id = USER_ID,
  email = 'kilian@example.com',
  pseudo = 'Kilian',
  role = UserRole.Player,
  passwordHash = 'hashed:password',
  disabledAt = null,
}: {
  id?: string;
  email?: string;
  pseudo?: string;
  role?: UserRole;
  passwordHash?: string;
  disabledAt?: Date | null;
} = {}): UserAggregate {
  return new UserAggregate(
    id,
    email,
    pseudo,
    role,
    passwordHash,
    disabledAt,
    new Date('2026-10-01T10:00:00Z'),
  );
}
