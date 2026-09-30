import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

import {
  LeagueActor,
  LeagueAggregate,
  LeagueVisibility,
} from '@trail/modules/league/domain';

registerEnumType(LeagueVisibility, { name: 'LeagueVisibility' });

@ObjectType('League')
export class LeagueType {
  constructor(
    public readonly aggregate: LeagueAggregate,
    public readonly viewer: LeagueActor | null,
  ) {}

  @Field(() => ID)
  get id(): string {
    return this.aggregate.id;
  }

  @Field(() => String)
  get name(): string {
    return this.aggregate.name;
  }

  @Field(() => LeagueVisibility)
  get visibility(): LeagueVisibility {
    return this.aggregate.visibility;
  }

  @Field(() => Int)
  get memberCount(): number {
    return this.aggregate.memberList.length;
  }

  @Field(() => ID)
  get ownerId(): string {
    return this.aggregate.ownerId;
  }

  @Field(() => Boolean)
  get isOwner(): boolean {
    return this.viewer !== null && this.aggregate.isOwner(this.viewer.userId);
  }

  @Field(() => Boolean)
  get isMember(): boolean {
    return this.viewer !== null && this.aggregate.hasMember(this.viewer.userId);
  }

  @Field(() => String, {
    nullable: true,
    description: 'Shown to members only, link /join/<code>',
  })
  get inviteCode(): string | null {
    return this.viewer ? this.aggregate.inviteCodeFor(this.viewer) : null;
  }

  @Field(() => Date)
  get createdAt(): Date {
    return this.aggregate.createdAt;
  }
}
