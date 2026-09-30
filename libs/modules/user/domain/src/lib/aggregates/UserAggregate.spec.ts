import { UserRole } from '../enums';
import { UserDisabledError } from '../errors';
import { buildUserAggregate } from '../testing';
import { UserAggregate } from './UserAggregate';

describe('UserAggregate', () => {
  const now = new Date('2026-10-10T10:00:00Z');

  it('exposes its account data', () => {
    const user = buildUserAggregate({ role: UserRole.Admin });
    expect(user).toMatchObject({
      email: 'kilian@example.com',
      pseudo: 'Kilian',
      role: UserRole.Admin,
      isAdmin: true,
      passwordHash: 'hashed:password',
      disabledAt: null,
    });
  });

  it('keeps the first disable date and enables again', () => {
    const user = buildUserAggregate();
    user.disable(now);
    user.disable(new Date('2026-10-11T10:00:00Z'));
    expect(user.disabledAt).toEqual(now);
    expect(() => user.assertActive()).toThrow(UserDisabledError);
    user.enable();
    expect(user.isDisabled).toBe(false);
    expect(() => user.assertActive()).not.toThrow();
  });

  it('derives the same pseudo key regardless of case and accents', () => {
    expect(UserAggregate.pseudoKey('Élodie')).toBe(
      UserAggregate.pseudoKey('elodie'),
    );
  });
});
