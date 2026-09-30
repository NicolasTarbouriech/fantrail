import { GetPredictionFieldQueryHandler } from './GetPredictionFieldQueryHandler';
import { GetPredictionQueryHandler } from './GetPredictionQueryHandler';
import { ListPredictionsByFieldQueryHandler } from './ListPredictionsByFieldQueryHandler';
import { ListPredictionsByUserQueryHandler } from './ListPredictionsByUserQueryHandler';
import { ListRevealedPredictionsByFieldQueryHandler } from './ListRevealedPredictionsByFieldQueryHandler';

export const queryHandlerList = [
  GetPredictionFieldQueryHandler,
  GetPredictionQueryHandler,
  ListPredictionsByFieldQueryHandler,
  ListPredictionsByUserQueryHandler,
  ListRevealedPredictionsByFieldQueryHandler,
];
