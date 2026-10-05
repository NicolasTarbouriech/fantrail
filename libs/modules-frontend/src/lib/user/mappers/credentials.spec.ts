import {
  getInitial,
  getPasswordRules,
  getPseudoError,
  isPasswordValid,
} from './index';

describe('credentials', () => {
  it('lists the password rules', () => {
    expect(getPasswordRules('abc').map((rule) => rule.isMet)).toEqual([
      false,
      true,
      false,
      false,
    ]);
    expect(isPasswordValid('Trail2026!')).toBe(true);
    expect(isPasswordValid('Trail2026')).toBe(false);
  });

  it('checks the pseudo and gives its initial', () => {
    expect(getPseudoError('Kilian')).toBeNull();
    expect(getPseudoError('ab')).toBe('Entre 3 et 20 caractères.');
    expect(getPseudoError('Kil@n')).toBe(
      'Lettres, chiffres, espaces, points, tirets et soulignés seulement.',
    );
    expect(getInitial(' kilian')).toBe('K');
    expect(getInitial('')).toBe('?');
  });
});
