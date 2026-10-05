import {
  LeagueRaceRepository,
  LeagueRepository,
} from '@trail/modules/league/domain';

import { LeagueInfrastructureModule } from './LeagueInfrastructureModule';
import { QueryBusLeagueRaceRepository } from './repositories/QueryBusLeagueRaceRepository';
import { TypeormLeagueRepository } from './repositories/TypeormLeagueRepository';

describe('LeagueInfrastructureModule', () => {
  it('binds the league repositories to their implementations', () => {
    const { providers, exports } = LeagueInfrastructureModule.register();
    const expected = [
      { provide: LeagueRepository, useClass: TypeormLeagueRepository },
      { provide: LeagueRaceRepository, useClass: QueryBusLeagueRaceRepository },
    ];
    expect(providers).toEqual(expected);
    expect(exports).toEqual(expected);
  });
});
