import { Field, ID, ObjectType } from '@nestjs/graphql';

import { UserAggregate } from '@trail/modules/user/domain';

@ObjectType('Player')
export class PlayerType {
  constructor(private readonly _user: UserAggregate) {}

  @Field(() => ID)
  get id(): string {
    return this._user.id;
  }

  @Field(() => String)
  get pseudo(): string {
    return this._user.pseudo;
  }
}
