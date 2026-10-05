import { groupRacesByTrailEvent } from './raceGroups';

const grandRaid = { id: 'gr', name: 'Grand Raid', logoUrl: null };
const templiers = {
  id: 'tp',
  name: 'Festival des Templiers',
  logoUrl: 'data:',
};

describe('groupRacesByTrailEvent', () => {
  it('groups by event in the order of their first race, races without event last', () => {
    const groups = groupRacesByTrailEvent([
      { id: 'diag', trailEvent: grandRaid },
      { id: 'other', trailEvent: null },
      { id: 'endurance', trailEvent: templiers },
      { id: 'bourbon', trailEvent: grandRaid },
      { id: 'gtt', trailEvent: templiers },
    ]);
    expect(
      groups.map((group) => [
        group.trailEvent?.name ?? null,
        group.races.map(({ id }) => id),
      ]),
    ).toEqual([
      ['Grand Raid', ['diag', 'bourbon']],
      ['Festival des Templiers', ['endurance', 'gtt']],
      [null, ['other']],
    ]);
  });

  it('returns no group without race', () => {
    expect(groupRacesByTrailEvent([])).toEqual([]);
  });
});
