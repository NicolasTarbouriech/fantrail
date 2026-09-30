import { LeagueNameAlreadyUsedError, LeagueNotFoundError } from './index';

describe('league errors', () => {
  it('have stable codes', () => {
    expect(new LeagueNotFoundError().code).toBe('LEAGUE_NOT_FOUND');
    expect(new LeagueNameAlreadyUsedError().code).toBe(
      'LEAGUE_NAME_ALREADY_USED',
    );
  });
});
