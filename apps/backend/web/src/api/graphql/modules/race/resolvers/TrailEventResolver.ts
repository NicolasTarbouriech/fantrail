import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import {
  CreateTrailEventCommand,
  DeleteTrailEventCommand,
  ListTrailEventsQuery,
  UpdateTrailEventCommand,
} from '@trail/modules/race/application';
import {
  EnhancedCommandBus,
  EnhancedQueryBus,
} from '@trail/shared/cqrs/util-nestjs';

import { AdminGuard } from '../../../../../services/auth/guards/AdminGuard';
import { AuthGuard } from '../../../../../services/auth/guards/AuthGuard';
import { TrailEventInput } from '../inputs/TrailEventInput';
import { mapTrailEventData } from '../inputs/mapTrailEventData';
import { TrailEventType } from '../types/TrailEventType';

@Resolver(() => TrailEventType)
export class TrailEventResolver {
  constructor(
    private readonly _commandBus: EnhancedCommandBus,
    private readonly _queryBus: EnhancedQueryBus,
  ) {}

  @Query(() => [TrailEventType], { description: 'Every event, by name' })
  async trailEvents(): Promise<TrailEventType[]> {
    const trailEventList = await this._queryBus.execute(
      new ListTrailEventsQuery(),
    );
    return trailEventList.map((trailEvent) => new TrailEventType(trailEvent));
  }

  @Mutation(() => TrailEventType)
  @UseGuards(AuthGuard, AdminGuard)
  async createTrailEvent(
    @Args('data', { type: () => TrailEventInput }) data: TrailEventInput,
  ): Promise<TrailEventType> {
    return new TrailEventType(
      await this._commandBus.execute(
        new CreateTrailEventCommand({ data: mapTrailEventData(data) }),
      ),
    );
  }

  @Mutation(() => TrailEventType, {
    description: 'Renames the event and replaces its logo, null removes it',
  })
  @UseGuards(AuthGuard, AdminGuard)
  async updateTrailEvent(
    @Args('trailEventId', { type: () => ID }) trailEventId: string,
    @Args('data', { type: () => TrailEventInput }) data: TrailEventInput,
  ): Promise<TrailEventType> {
    return new TrailEventType(
      await this._commandBus.execute(
        new UpdateTrailEventCommand({
          trailEventId,
          data: mapTrailEventData(data),
        }),
      ),
    );
  }

  @Mutation(() => Boolean, {
    description: 'Deletes the event, its races stay without event',
  })
  @UseGuards(AuthGuard, AdminGuard)
  async deleteTrailEvent(
    @Args('trailEventId', { type: () => ID }) trailEventId: string,
  ): Promise<boolean> {
    await this._commandBus.execute(
      new DeleteTrailEventCommand({ trailEventId }),
    );
    return true;
  }
}
