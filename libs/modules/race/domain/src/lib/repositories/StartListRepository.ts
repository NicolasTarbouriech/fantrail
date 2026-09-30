import { StartListAggregate } from '../aggregates';
import { FieldId } from '../types';

export abstract class StartListRepository {
  abstract getByFieldId(fieldId: FieldId): Promise<StartListAggregate>;
  abstract listByFieldIdList(
    fieldIdList: FieldId[],
  ): Promise<StartListAggregate[]>;
  abstract save(startList: StartListAggregate): Promise<StartListAggregate>;
}
