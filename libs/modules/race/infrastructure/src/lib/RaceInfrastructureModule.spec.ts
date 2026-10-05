import {
  RaceRepository,
  StartListRepository,
  TrailEventRepository,
} from '@trail/modules/race/domain';

import { RaceInfrastructureModule } from './RaceInfrastructureModule';
import { TypeormRaceRepository } from './repositories/TypeormRaceRepository';
import { TypeormStartListRepository } from './repositories/TypeormStartListRepository';
import { TypeormTrailEventRepository } from './repositories/TypeormTrailEventRepository';

describe('RaceInfrastructureModule', () => {
  it('binds every domain repository to its TypeORM implementation', () => {
    const { providers, exports } = RaceInfrastructureModule.register();
    const expected = [
      { provide: RaceRepository, useClass: TypeormRaceRepository },
      { provide: StartListRepository, useClass: TypeormStartListRepository },
      { provide: TrailEventRepository, useClass: TypeormTrailEventRepository },
    ];
    expect(providers).toEqual(expected);
    expect(exports).toEqual(expected);
  });
});
