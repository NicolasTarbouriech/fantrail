import { Field, ObjectType } from '@nestjs/graphql';

import { MeType } from './MeType';

@ObjectType('AdminUser')
export class AdminUserType extends MeType {
  @Field(() => Date, { nullable: true })
  get disabledAt(): Date | null {
    return this.aggregate.disabledAt;
  }

  @Field(() => Date)
  get createdAt(): Date {
    return this.aggregate.createdAt;
  }
}
