import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

import { FieldResultAggregate } from '@trail/modules/result/domain';

@ObjectType('FieldResult')
export class FieldResultType {
  constructor(public readonly aggregate: FieldResultAggregate) {}

  @Field(() => ID)
  get fieldId(): string {
    return this.aggregate.fieldId;
  }

  @Field(() => Int, { description: 'Increases with each correction' })
  get version(): number {
    return this.aggregate.version;
  }

  @Field(() => [ID], { description: 'Runner ids from the winner to the 10th' })
  get rankingList(): string[] {
    return this.aggregate.data.rankingList;
  }

  @Field(() => Int)
  get winnerTimeInSeconds(): number {
    return this.aggregate.data.winnerTimeInSeconds;
  }

  @Field(() => [ID])
  get dnfRunnerIdList(): string[] {
    return this.aggregate.data.dnfRunnerIdList;
  }

  @Field(() => Date, { nullable: true })
  get publishedAt(): Date | null {
    return this.aggregate.publishedAt;
  }
}
