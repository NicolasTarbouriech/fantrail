import {
  PredictionFieldRepository,
  PredictionRepository,
} from '@trail/modules/prediction/domain';

import { PredictionInfrastructureModule } from './PredictionInfrastructureModule';
import { QueryBusPredictionFieldRepository } from './repositories/QueryBusPredictionFieldRepository';
import { TypeormPredictionRepository } from './repositories/TypeormPredictionRepository';

describe('PredictionInfrastructureModule', () => {
  it('binds every domain port to its implementation', () => {
    const { providers, exports } = PredictionInfrastructureModule.register();
    const expected = [
      { provide: PredictionRepository, useClass: TypeormPredictionRepository },
      {
        provide: PredictionFieldRepository,
        useClass: QueryBusPredictionFieldRepository,
      },
    ];
    expect(providers).toEqual(expected);
    expect(exports).toEqual(expected);
  });
});
