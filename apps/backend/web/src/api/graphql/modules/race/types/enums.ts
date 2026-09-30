import { registerEnumType } from '@nestjs/graphql';

import { Gender, IndexSource, RaceStatus } from '@trail/modules/race/domain';

registerEnumType(RaceStatus, { name: 'RaceStatus' });
registerEnumType(Gender, { name: 'Gender' });
registerEnumType(IndexSource, { name: 'IndexSource' });

export {
  Gender as GenderEnumType,
  IndexSource as IndexSourceEnumType,
  RaceStatus as RaceStatusEnumType,
};
