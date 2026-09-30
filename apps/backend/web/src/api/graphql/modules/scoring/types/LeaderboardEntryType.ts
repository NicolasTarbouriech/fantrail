import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

import { LeaderboardEntry } from '@trail/modules/scoring/domain';

@ObjectType('LeaderboardEntry')
export class LeaderboardEntryType {
  constructor(public readonly entry: LeaderboardEntry) {}

  @Field(() => Int)
  get rank(): number {
    return this.entry.rank;
  }

  @Field(() => ID)
  get userId(): string {
    return this.entry.userId;
  }

  @Field(() => Int)
  get total(): number {
    return this.entry.total;
  }

  @Field(() => Int, { description: 'Fields where the player scored' })
  get scoredFieldCount(): number {
    return this.entry.scoredFieldCount;
  }

  @Field(() => Int, {
    nullable: true,
    description: 'Cumulated gap on the winner time, first tie-break',
  })
  get timeGapInSeconds(): number | null {
    return this.entry.timeGapInSeconds;
  }
}
