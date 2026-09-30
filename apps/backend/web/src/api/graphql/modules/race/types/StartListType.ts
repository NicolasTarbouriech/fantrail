import { Field, ID, ObjectType } from '@nestjs/graphql';

import { StartListAggregate } from '@trail/modules/race/domain';

import { RunnerType } from './RunnerType';

@ObjectType('StartList')
export class StartListType {
  constructor(public readonly aggregate: StartListAggregate) {}

  @Field(() => ID)
  get fieldId(): string {
    return this.aggregate.fieldId;
  }

  @Field(() => [RunnerType])
  get runners(): RunnerType[] {
    const favoriteRankByRunnerId = this.aggregate.favoriteRankByRunnerId;
    return this.aggregate.runnerList.map(
      (runner) =>
        new RunnerType(runner, favoriteRankByRunnerId[runner.id] ?? null),
    );
  }
}
