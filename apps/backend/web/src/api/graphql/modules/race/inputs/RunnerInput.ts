import { Field, InputType, Int } from '@nestjs/graphql';

import { IndexSourceEnumType } from '../types/enums';

@InputType()
export class RunnerInput {
  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String, {
    nullable: true,
    description: 'ISO 3166-1 alpha-3 code',
  })
  nationality?: string | null;

  @Field(() => Int, { nullable: true })
  index?: number | null;

  @Field(() => IndexSourceEnumType, { nullable: true })
  indexSource?: IndexSourceEnumType | null;

  @Field(() => String, { nullable: true })
  utmbUrl?: string | null;

  @Field(() => String, { nullable: true })
  itraUrl?: string | null;
}
