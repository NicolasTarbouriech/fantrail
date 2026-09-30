import { Email, PlainPassword, Pseudo } from './index';

describe('user types', () => {
  it('normalizes the email', () => {
    expect(Email.parse('  Kilian@Example.COM ')).toBe('kilian@example.com');
  });

  it.each(['Kilian', 'Élo_73', 'Les Chamois', 'j.doe-2'])(
    'accepts pseudo %p',
    (pseudo) => {
      expect(Pseudo.safeParse(pseudo).success).toBe(true);
    },
  );

  it.each(['ab', 'a'.repeat(21), 'emoji🏃', '<script>'])(
    'rejects pseudo %p',
    (pseudo) => {
      expect(Pseudo.safeParse(pseudo).success).toBe(false);
    },
  );

  it.each(['Trail-2026', 'Diagonale!974', 'élan#42x'])(
    'accepts password %p',
    (password) => {
      expect(PlainPassword.safeParse(password).success).toBe(true);
    },
  );

  it.each([
    ['Tr-26', 'too short'],
    ['Trailrunning2026', 'no special character'],
    ['Trail-running', 'no digit'],
    ['2026-10-15', 'no letter'],
    ['Trail 2026', 'a space is not a special character'],
  ])('rejects password %p (%s)', (password) => {
    expect(PlainPassword.safeParse(password).success).toBe(false);
  });
});
