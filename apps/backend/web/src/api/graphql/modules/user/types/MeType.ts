import { Field, ID, ObjectType } from '@nestjs/graphql';

import { UserAggregate } from '@trail/modules/user/domain';

import { UserRoleEnumType } from './enums';

@ObjectType('Me')
export class MeType {
  constructor(public readonly aggregate: UserAggregate) {}

  @Field(() => ID)
  get id(): string {
    return this.aggregate.id;
  }

  @Field(() => String)
  get email(): string {
    return this.aggregate.email;
  }

  @Field(() => String)
  get pseudo(): string {
    return this.aggregate.pseudo;
  }

  @Field(() => UserRoleEnumType)
  get role(): UserRoleEnumType {
    return this.aggregate.role;
  }
}
