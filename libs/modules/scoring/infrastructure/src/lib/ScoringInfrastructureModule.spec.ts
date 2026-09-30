import {
  FieldScoreRepository,
  FieldScoringSourceRepository,
} from '@trail/modules/scoring/domain';

import { ScoringInfrastructureModule } from './ScoringInfrastructureModule';
import { QueryBusFieldScoringSourceRepository } from './repositories/QueryBusFieldScoringSourceRepository';
import { TypeormFieldScoreRepository } from './repositories/TypeormFieldScoreRepository';

describe('ScoringInfrastructureModule', () => {
  it('binds every domain port to its implementation', () => {
    const { providers, exports } = ScoringInfrastructureModule.register();
    const expected = [
      { provide: FieldScoreRepository, useClass: TypeormFieldScoreRepository },
      {
        provide: FieldScoringSourceRepository,
        useClass: QueryBusFieldScoringSourceRepository,
      },
    ];
    expect(providers).toEqual(expected);
    expect(exports).toEqual(expected);
  });
});
