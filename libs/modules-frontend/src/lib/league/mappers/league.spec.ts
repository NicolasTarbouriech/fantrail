import {
  buildInviteLink,
  findMyStanding,
  formatPlayerCount,
  formatPoints,
  formatRank,
  getLeagueNameError,
  isInviteCode,
  normalizeInviteCode,
} from './index';

describe('format', () => {
  it('formats points, ranks and player counts', () => {
    expect(formatPoints(2412)).toBe('2\u00a0412');
    expect(formatPoints(0)).toBe('0');
    expect(formatRank(1)).toBe('1ᵉʳ');
    expect(formatRank(58)).toBe('58ᵉ');
    expect(formatPlayerCount(1)).toBe('1 joueur');
    expect(formatPlayerCount(6)).toBe('6 joueurs');
  });
});

describe('inviteCode', () => {
  it('normalizes and checks a code', () => {
    expect(normalizeInviteCode(' chamx 742 ')).toBe('CHAMX742');
    expect(isInviteCode('chamx742')).toBe(true);
    expect(isInviteCode('CHAMO742')).toBe(false);
    expect(isInviteCode('CHAM')).toBe(false);
    expect(buildInviteLink('https://fantrail.fr', 'CHAMX742')).toBe(
      'https://fantrail.fr/join/CHAMX742',
    );
  });
});

describe('findMyStanding', () => {
  const entries = [
    { rank: 1, userId: 'a', total: 10, scoredFieldCount: 1 },
    { rank: 2, userId: 'b', total: 5, scoredFieldCount: 1 },
  ];

  it('finds the player rank', () => {
    expect(findMyStanding(entries, 'b')).toEqual({ rank: 2, playerCount: 2 });
    expect(findMyStanding(entries, 'c')).toBeNull();
  });
});

describe('getLeagueNameError', () => {
  it('checks the name length', () => {
    expect(getLeagueNameError('Les Chamois')).toBeNull();
    expect(getLeagueNameError(' ab ')).toBe('Entre 3 et 40 caractères.');
    expect(getLeagueNameError('x'.repeat(41))).toBe(
      'Entre 3 et 40 caractères.',
    );
  });
});
