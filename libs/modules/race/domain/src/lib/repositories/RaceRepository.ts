import { RaceAggregate } from '../aggregates';
import { RaceStatus } from '../enums';
import { FieldId, RaceData, RaceId } from '../types';

export interface RaceListFilters {
  statusList?: RaceStatus[];
}

export abstract class RaceRepository {
  /** Races by first start, see `RaceAggregate.compareByStart`. */
  abstract list(filters?: RaceListFilters): Promise<RaceAggregate[]>;
  abstract getById(id: RaceId): Promise<RaceAggregate>;
  abstract getByFieldId(fieldId: FieldId): Promise<RaceAggregate>;
  abstract create(data: RaceData): Promise<RaceAggregate>;
  abstract save(race: RaceAggregate): Promise<RaceAggregate>;
  abstract delete(race: RaceAggregate): Promise<void>;
}
