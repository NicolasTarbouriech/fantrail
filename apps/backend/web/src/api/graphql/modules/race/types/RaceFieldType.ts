import { Field, ID, ObjectType } from '@nestjs/graphql';

import { RaceField } from '@trail/modules/race/domain';

import { GenderEnumType } from './enums';

@ObjectType('RaceField')
export class RaceFieldType {
  constructor(public readonly field: RaceField) {}

  @Field(() => ID)
  get id(): string {
    return this.field.id;
  }

  @Field(() => GenderEnumType)
  get gender(): GenderEnumType {
    return this.field.gender;
  }

  @Field(() => Date)
  get startAt(): Date {
    return this.field.startAt;
  }

  @Field(() => Date)
  get lockAt(): Date {
    return this.field.lockAt;
  }

  @Field(() => Date, { nullable: true })
  get lockedAt(): Date | null {
    return this.field.lockedAt;
  }

  @Field(() => Boolean)
  get isLocked(): boolean {
    return this.field.isLockedAt(new Date());
  }
}
