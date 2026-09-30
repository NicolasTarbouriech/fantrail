import { LeagueRepository } from '@trail/modules/league/domain';

import { LeagueInfrastructureModule } from './LeagueInfrastructureModule';
import { TypeormLeagueRepository } from './repositories/TypeormLeagueRepository';

describe('LeagueInfrastructureModule', () => {
  it('binds the league repository to its TypeORM implementation', () => {
    const { providers, exports } = LeagueInfrastructureModule.register();
    const expected = [
      { provide: LeagueRepository, useClass: TypeormLeagueRepository },
    ];
    expect(providers).toEqual(expected);
    expect(exports).toEqual(expected);
  });
});
