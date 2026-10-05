import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';

import { ListTrailEventsByIdListQuery } from '@trail/modules/race/application';
import {
  TrailEventAggregate,
  TrailEventNotFoundError,
} from '@trail/modules/race/domain';
import { EnhancedQueryBus } from '@trail/shared/cqrs/util-nestjs';

@Injectable({ scope: Scope.REQUEST })
export class TrailEventDataLoader {
  constructor(private readonly _queryBus: EnhancedQueryBus) {}

  public readonly loader = new DataLoader<string, TrailEventAggregate>(
    async (idList: readonly string[]) => {
      const trailEventList = await this._queryBus.execute(
        new ListTrailEventsByIdListQuery({ trailEventIdList: [...idList] }),
      );
      const trailEventById = new Map(
        trailEventList.map((trailEvent) => [trailEvent.id, trailEvent]),
      );
      return idList.map(
        (id) => trailEventById.get(id) ?? new TrailEventNotFoundError(),
      );
    },
  );
}
