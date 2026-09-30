import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

import { PredictionAggregate } from '@trail/modules/prediction/domain';

@ObjectType('Prediction')
export class PredictionType {
  constructor(public readonly aggregate: PredictionAggregate) {}

  @Field(() => ID)
  get id(): string {
    return this.aggregate.id;
  }

  @Field(() => ID)
  get fieldId(): string {
    return this.aggregate.fieldId;
  }

  @Field(() => [ID], {
    nullable: 'items',
    description: 'Runner id per pick position, null while not chosen',
  })
  get pickList(): (string | null)[] {
    return this.aggregate.pickList;
  }

  @Field(() => Int, { nullable: true })
  get winnerTimeEstimateInSeconds(): number | null {
    return this.aggregate.winnerTimeEstimateInSeconds;
  }

  @Field(() => Boolean, {
    description: 'Only complete predictions score points',
  })
  get isComplete(): boolean {
    return this.aggregate.isComplete;
  }

  @Field(() => Date, { nullable: true })
  get finalizedAt(): Date | null {
    return this.aggregate.finalizedAt;
  }

  @Field(() => Date)
  get updatedAt(): Date {
    return this.aggregate.updatedAt;
  }
}
