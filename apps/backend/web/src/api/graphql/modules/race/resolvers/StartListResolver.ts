import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';

import {
  AddRunnerListCommand,
  ReinstateRunnerCommand,
  UpdateRunnerCommand,
  WithdrawRunnerCommand,
} from '@trail/modules/race/application';
import { EnhancedCommandBus } from '@trail/shared/cqrs/util-nestjs';

import { AdminGuard } from '../../../../../services/auth/guards/AdminGuard';
import { AuthGuard } from '../../../../../services/auth/guards/AuthGuard';
import { RunnerInput } from '../inputs/RunnerInput';
import { mapRunnerData } from '../inputs/mapInputs';
import { StartListType } from '../types/StartListType';

@Resolver(() => StartListType)
export class StartListResolver {
  constructor(private readonly _commandBus: EnhancedCommandBus) {}

  @Mutation(() => StartListType)
  @UseGuards(AuthGuard, AdminGuard)
  async addRunners(
    @Args('fieldId', { type: () => ID }) fieldId: string,
    @Args('dataList', { type: () => [RunnerInput] }) dataList: RunnerInput[],
  ): Promise<StartListType> {
    return new StartListType(
      await this._commandBus.execute(
        new AddRunnerListCommand({
          fieldId,
          dataList: dataList.map(mapRunnerData),
        }),
      ),
    );
  }

  @Mutation(() => StartListType)
  @UseGuards(AuthGuard, AdminGuard)
  async updateRunner(
    @Args('fieldId', { type: () => ID }) fieldId: string,
    @Args('runnerId', { type: () => ID }) runnerId: string,
    @Args('data', { type: () => RunnerInput }) data: RunnerInput,
  ): Promise<StartListType> {
    return new StartListType(
      await this._commandBus.execute(
        new UpdateRunnerCommand({
          fieldId,
          runnerId,
          data: mapRunnerData(data),
        }),
      ),
    );
  }

  @Mutation(() => StartListType)
  @UseGuards(AuthGuard, AdminGuard)
  async withdrawRunner(
    @Args('fieldId', { type: () => ID }) fieldId: string,
    @Args('runnerId', { type: () => ID }) runnerId: string,
  ): Promise<StartListType> {
    return new StartListType(
      await this._commandBus.execute(
        new WithdrawRunnerCommand({ fieldId, runnerId }),
      ),
    );
  }

  @Mutation(() => StartListType)
  @UseGuards(AuthGuard, AdminGuard)
  async reinstateRunner(
    @Args('fieldId', { type: () => ID }) fieldId: string,
    @Args('runnerId', { type: () => ID }) runnerId: string,
  ): Promise<StartListType> {
    return new StartListType(
      await this._commandBus.execute(
        new ReinstateRunnerCommand({ fieldId, runnerId }),
      ),
    );
  }
}
