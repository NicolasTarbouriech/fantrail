import { Field, InputType } from '@nestjs/graphql';

import { GenderEnumType } from '../types/enums';

@InputType()
export class RaceFieldInput {
  @Field(() => GenderEnumType)
  gender: GenderEnumType;

  @Field(() => Date)
  startAt: Date;

  @Field(() => Date)
  lockAt: Date;
}
