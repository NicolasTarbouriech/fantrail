import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import {
  AddFieldCommand,
  CancelRaceCommand,
  CreateRaceCommand,
  DeleteRaceCommand,
  GetRaceQuery,
  ListRacesQuery,
  LockFieldCommand,
  LockRaceCommand,
  MarkRaceScoredCommand,
  OpenRaceCommand,
  UpdateFieldCommand,
  UpdateRaceCommand,
} from '@trail/modules/race/application';
import {
  PLAYER_RACE_STATUS_LIST,
  RaceStatus,
} from '@trail/modules/race/domain';
import {
  EnhancedCommandBus,
  EnhancedQueryBus,
} from '@trail/shared/cqrs/util-nestjs';

import { AdminGuard } from '../../../../../services/auth/guards/AdminGuard';
import { AuthGuard } from '../../../../../services/auth/guards/AuthGuard';
import { RaceFieldInput } from '../inputs/RaceFieldInput';
import { RaceInput } from '../inputs/RaceInput';
import { mapRaceData } from '../inputs/mapInputs';
import { RaceType } from '../types/RaceType';
import { RaceStatusEnumType } from '../types/enums';

@Resolver(() => RaceType)
export class RaceResolver {
  constructor(
    private readonly _commandBus: EnhancedCommandBus,
    private readonly _queryBus: EnhancedQueryBus,
  ) {}

  @Query(() => [RaceType], {
    description: 'Races open to predictions, locked, scored or cancelled',
  })
  async races(): Promise<RaceType[]> {
    const raceList = await this._queryBus.execute(
      new ListRacesQuery({ statusList: PLAYER_RACE_STATUS_LIST }),
    );
    return raceList.map((race) => new RaceType(race));
  }

  @Query(() => RaceType)
  async race(
    @Args('raceId', { type: () => ID }) raceId: string,
  ): Promise<RaceType> {
    return new RaceType(
      await this._queryBus.execute(new GetRaceQuery({ raceId })),
    );
  }

  @Query(() => [RaceType])
  @UseGuards(AuthGuard, AdminGuard)
  async adminRaces(
    @Args('statusList', { type: () => [RaceStatusEnumType], nullable: true })
    statusList?: RaceStatus[] | null,
  ): Promise<RaceType[]> {
    const raceList = await this._queryBus.execute(
      new ListRacesQuery({ statusList: statusList ?? undefined }),
    );
    return raceList.map((race) => new RaceType(race));
  }

  @Mutation(() => RaceType)
  @UseGuards(AuthGuard, AdminGuard)
  async createRace(
    @Args('data', { type: () => RaceInput }) data: RaceInput,
  ): Promise<RaceType> {
    return new RaceType(
      await this._commandBus.execute(
        new CreateRaceCommand({ data: mapRaceData(data) }),
      ),
    );
  }

  @Mutation(() => RaceType)
  @UseGuards(AuthGuard, AdminGuard)
  async updateRace(
    @Args('raceId', { type: () => ID }) raceId: string,
    @Args('data', { type: () => RaceInput }) data: RaceInput,
  ): Promise<RaceType> {
    return new RaceType(
      await this._commandBus.execute(
        new UpdateRaceCommand({ raceId, data: mapRaceData(data) }),
      ),
    );
  }

  @Mutation(() => RaceType)
  @UseGuards(AuthGuard, AdminGuard)
  async openRace(
    @Args('raceId', { type: () => ID }) raceId: string,
  ): Promise<RaceType> {
    return new RaceType(
      await this._commandBus.execute(new OpenRaceCommand({ raceId })),
    );
  }

  @Mutation(() => RaceType)
  @UseGuards(AuthGuard, AdminGuard)
  async lockRace(
    @Args('raceId', { type: () => ID }) raceId: string,
  ): Promise<RaceType> {
    return new RaceType(
      await this._commandBus.execute(new LockRaceCommand({ raceId })),
    );
  }

  @Mutation(() => RaceType, {
    description: 'Closes a locked race once its fields have their result',
  })
  @UseGuards(AuthGuard, AdminGuard)
  async markRaceScored(
    @Args('raceId', { type: () => ID }) raceId: string,
  ): Promise<RaceType> {
    return new RaceType(
      await this._commandBus.execute(new MarkRaceScoredCommand({ raceId })),
    );
  }

  @Mutation(() => Boolean, {
    description:
      'Deletes the race with its fields, start lists, predictions, results and scores',
  })
  @UseGuards(AuthGuard, AdminGuard)
  async deleteRace(
    @Args('raceId', { type: () => ID }) raceId: string,
  ): Promise<boolean> {
    await this._commandBus.execute(new DeleteRaceCommand({ raceId }));
    return true;
  }

  @Mutation(() => RaceType)
  @UseGuards(AuthGuard, AdminGuard)
  async cancelRace(
    @Args('raceId', { type: () => ID }) raceId: string,
  ): Promise<RaceType> {
    return new RaceType(
      await this._commandBus.execute(new CancelRaceCommand({ raceId })),
    );
  }

  @Mutation(() => RaceType)
  @UseGuards(AuthGuard, AdminGuard)
  async addRaceField(
    @Args('raceId', { type: () => ID }) raceId: string,
    @Args('data', { type: () => RaceFieldInput }) data: RaceFieldInput,
  ): Promise<RaceType> {
    return new RaceType(
      await this._commandBus.execute(new AddFieldCommand({ raceId, data })),
    );
  }

  @Mutation(() => RaceType)
  @UseGuards(AuthGuard, AdminGuard)
  async updateRaceField(
    @Args('fieldId', { type: () => ID }) fieldId: string,
    @Args('data', { type: () => RaceFieldInput }) data: RaceFieldInput,
  ): Promise<RaceType> {
    return new RaceType(
      await this._commandBus.execute(new UpdateFieldCommand({ fieldId, data })),
    );
  }

  @Mutation(() => RaceType, {
    description: 'Locks a field now, for an early or delayed start',
  })
  @UseGuards(AuthGuard, AdminGuard)
  async lockRaceField(
    @Args('fieldId', { type: () => ID }) fieldId: string,
  ): Promise<RaceType> {
    return new RaceType(
      await this._commandBus.execute(new LockFieldCommand({ fieldId })),
    );
  }
}
