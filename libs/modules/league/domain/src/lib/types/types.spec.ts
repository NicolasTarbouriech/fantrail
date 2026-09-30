import { InviteCode, LeagueName } from './index';

describe('league types', () => {
  it('normalizes an invite code typed in lower case', () => {
    expect(InviteCode.parse(' chamx742 ')).toBe('CHAMX742');
  });

  it.each(['CHAMX74', 'CHAMX7420', 'CHAMO742', 'CHAM1742'])(
    'rejects invite code %p',
    (code) => {
      expect(InviteCode.safeParse(code).success).toBe(false);
    },
  );

  it('needs 3 to 40 characters for a league name', () => {
    expect(LeagueName.safeParse('ab').success).toBe(false);
    expect(LeagueName.safeParse('a'.repeat(41)).success).toBe(false);
    expect(LeagueName.safeParse('Les Chamois').success).toBe(true);
  });
});
