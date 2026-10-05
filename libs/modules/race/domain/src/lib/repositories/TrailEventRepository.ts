import { TrailEventAggregate } from '../aggregates';
import { TrailEventData, TrailEventId } from '../types';

export interface TrailEventListFilters {
  idList?: TrailEventId[];
}

export abstract class TrailEventRepository {
  abstract list(
    filters?: TrailEventListFilters,
  ): Promise<TrailEventAggregate[]>;
  abstract getById(id: TrailEventId): Promise<TrailEventAggregate>;
  abstract create(data: TrailEventData): Promise<TrailEventAggregate>;
  abstract save(trailEvent: TrailEventAggregate): Promise<TrailEventAggregate>;
  abstract delete(trailEvent: TrailEventAggregate): Promise<void>;
}
