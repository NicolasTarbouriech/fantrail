import { GetRaceByFieldIdQueryHandler } from './GetRaceByFieldIdQueryHandler';
import { GetRaceQueryHandler } from './GetRaceQueryHandler';
import { GetStartListQueryHandler } from './GetStartListQueryHandler';
import { ListRacesQueryHandler } from './ListRacesQueryHandler';
import { ListStartListsQueryHandler } from './ListStartListsQueryHandler';

export const queryHandlerList = [
  GetRaceByFieldIdQueryHandler,
  GetRaceQueryHandler,
  GetStartListQueryHandler,
  ListRacesQueryHandler,
  ListStartListsQueryHandler,
];
