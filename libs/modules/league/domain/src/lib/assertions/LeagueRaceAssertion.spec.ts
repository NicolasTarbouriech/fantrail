import { LeagueRaceNotAvailableError, LeagueWithoutRaceError } from '../errors';
import { LEAGUE_RACE_ID, OTHER_LEAGUE_RACE_ID } from '../testing';
import { LeagueRaceAssertion } from './LeagueRaceAssertion';

describe('LeagueRaceAssertion', () => {
  it('keeps each available race once', () => {
    expect(
      LeagueRaceAssertion.assertSelection(
        [LEAGUE_RACE_ID, LEAGUE_RACE_ID],
        [LEAGUE_RACE_ID, OTHER_LEAGUE_RACE_ID],
      ),
    ).toEqual([LEAGUE_RACE_ID]);
  });

  it('rejects an empty or unavailable selection', () => {
    expect(() =>
      LeagueRaceAssertion.assertSelection([], [LEAGUE_RACE_ID]),
    ).toThrow(LeagueWithoutRaceError);
    expect(() =>
      LeagueRaceAssertion.assertSelection(
        [OTHER_LEAGUE_RACE_ID],
        [LEAGUE_RACE_ID],
      ),
    ).toThrow(LeagueRaceNotAvailableError);
  });
});
