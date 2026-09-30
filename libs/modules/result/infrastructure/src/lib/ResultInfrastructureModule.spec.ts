import {
  FieldResultRepository,
  ResultFieldRepository,
} from '@trail/modules/result/domain';

import { ResultInfrastructureModule } from './ResultInfrastructureModule';
import { QueryBusResultFieldRepository } from './repositories/QueryBusResultFieldRepository';
import { TypeormFieldResultRepository } from './repositories/TypeormFieldResultRepository';

describe('ResultInfrastructureModule', () => {
  it('binds every domain port to its implementation', () => {
    const { providers, exports } = ResultInfrastructureModule.register();
    const expected = [
      {
        provide: FieldResultRepository,
        useClass: TypeormFieldResultRepository,
      },
      {
        provide: ResultFieldRepository,
        useClass: QueryBusResultFieldRepository,
      },
    ];
    expect(providers).toEqual(expected);
    expect(exports).toEqual(expected);
  });
});
