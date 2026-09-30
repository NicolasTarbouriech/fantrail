import { UseGuards } from '@nestjs/common';
import {
  Args,
  ID,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import {
  GetPredictionFieldQuery,
  GetPredictionQuery,
  ListPredictionsByUserQuery,
  SavePredictionCommand,
} from '@trail/modules/prediction/application';
import { UserAggregate } from '@trail/modules/user/domain';
import {
  EnhancedCommandBus,
  EnhancedQueryBus,
} from '@trail/shared/cqrs/util-nestjs';

import { User } from '../../../../../services/auth/decorators/User';
import { AuthGuard } from '../../../../../services/auth/guards/AuthGuard';
import { UserDataLoader } from '../../../../../services/dataloader/UserDataLoader';
import { PlayerType } from '../../scoring/types/PlayerType';
import { PredictionType } from '../types/PredictionType';

@Resolver(() => PredictionType)
export class PredictionResolver {
  constructor(
    private readonly _commandBus: EnhancedCommandBus,
    private readonly _queryBus: EnhancedQueryBus,
    private readonly _userDataLoader: UserDataLoader,
  ) {}

  @ResolveField(() => PlayerType)
  async player(@Parent() prediction: PredictionType): Promise<PlayerType> {
    return new PlayerType(
      await this._userDataLoader.loader.load(prediction.aggregate.userId),
    );
  }

  @Query(() => PredictionType, { nullable: true })
  @UseGuards(AuthGuard)
  async myPrediction(
    @User() user: UserAggregate,
    @Args('fieldId', { type: () => ID }) fieldId: string,
  ): Promise<PredictionType | null> {
    const prediction = await this._queryBus.execute(
      new GetPredictionQuery({ userId: user.id, fieldId }),
    );
    return prediction ? new PredictionType(prediction) : null;
  }

  @Query(() => [PredictionType])
  @UseGuards(AuthGuard)
  async myPredictions(@User() user: UserAggregate): Promise<PredictionType[]> {
    const predictionList = await this._queryBus.execute(
      new ListPredictionsByUserQuery({ userId: user.id }),
    );
    return predictionList.map((prediction) => new PredictionType(prediction));
  }

  @Mutation(() => PredictionType, {
    description: 'Saves the prediction, complete or not, until the field locks',
  })
  @UseGuards(AuthGuard)
  async savePrediction(
    @User() user: UserAggregate,
    @Args('fieldId', { type: () => ID }) fieldId: string,
    @Args('pickList', { type: () => [ID], nullable: 'items' })
    pickList: (string | null)[],
    @Args('winnerTimeEstimateInSeconds', { type: () => Int, nullable: true })
    winnerTimeEstimateInSeconds?: number | null,
  ): Promise<PredictionType> {
    return new PredictionType(
      await this._commandBus.execute(
        new SavePredictionCommand({
          userId: user.id,
          fieldId,
          pickList,
          winnerTimeEstimateInSeconds: winnerTimeEstimateInSeconds ?? null,
        }),
      ),
    );
  }

  @ResolveField(() => [ID], {
    description: 'Picked runners who withdrew: they will score 0',
  })
  async withdrawnRunnerIds(
    @Parent() prediction: PredictionType,
  ): Promise<string[]> {
    const field = await this._queryBus.execute(
      new GetPredictionFieldQuery({ fieldId: prediction.fieldId }),
    );
    return prediction.aggregate.withdrawnRunnerIdList(field);
  }
}
