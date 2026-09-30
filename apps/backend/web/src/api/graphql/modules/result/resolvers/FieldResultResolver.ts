import { UseGuards } from '@nestjs/common';
import { Args, ID, Int, Mutation, Resolver } from '@nestjs/graphql';

import { PublishFieldResultCommand } from '@trail/modules/result/application';
import { EnhancedCommandBus } from '@trail/shared/cqrs/util-nestjs';

import { AdminGuard } from '../../../../../services/auth/guards/AdminGuard';
import { AuthGuard } from '../../../../../services/auth/guards/AuthGuard';
import { FieldResultType } from '../types/FieldResultType';

@Resolver(() => FieldResultType)
export class FieldResultResolver {
  constructor(private readonly _commandBus: EnhancedCommandBus) {}

  @Mutation(() => FieldResultType, {
    description: 'Publishes or corrects the result, then rescores the field',
  })
  @UseGuards(AuthGuard, AdminGuard)
  async publishFieldResult(
    @Args('fieldId', { type: () => ID }) fieldId: string,
    @Args('rankingList', { type: () => [ID] }) rankingList: string[],
    @Args('winnerTimeInSeconds', { type: () => Int })
    winnerTimeInSeconds: number,
    @Args('dnfRunnerIdList', { type: () => [ID], defaultValue: [] })
    dnfRunnerIdList: string[],
  ): Promise<FieldResultType> {
    return new FieldResultType(
      await this._commandBus.execute(
        new PublishFieldResultCommand({
          fieldId,
          data: { rankingList, winnerTimeInSeconds, dnfRunnerIdList },
        }),
      ),
    );
  }
}
