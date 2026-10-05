import { GetRaceByFieldIdQueryHandler } from './GetRaceByFieldIdQueryHandler';
import { GetRaceQueryHandler } from './GetRaceQueryHandler';
import { GetStartListQueryHandler } from './GetStartListQueryHandler';
import { ListRacesQueryHandler } from './ListRacesQueryHandler';
import { ListStartListsQueryHandler } from './ListStartListsQueryHandler';
import { ListTrailEventsByIdListQueryHandler } from './ListTrailEventsByIdListQueryHandler';
import { ListTrailEventsQueryHandler } from './ListTrailEventsQueryHandler';

export const queryHandlerList = [
  GetRaceByFieldIdQueryHandler,
  GetRaceQueryHandler,
  GetStartListQueryHandler,
  ListRacesQueryHandler,
  ListStartListsQueryHandler,
  ListTrailEventsByIdListQueryHandler,
  ListTrailEventsQueryHandler,
];
