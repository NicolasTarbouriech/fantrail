import { FieldResultAggregate } from '../aggregates';
import { FieldId } from '../types';

export abstract class FieldResultRepository {
  // A field without result yet comes back unpublished, at version 0.
  abstract getByFieldId(fieldId: FieldId): Promise<FieldResultAggregate>;
  abstract listByFieldIdList(
    fieldIdList: FieldId[],
  ): Promise<FieldResultAggregate[]>;
  abstract save(result: FieldResultAggregate): Promise<FieldResultAggregate>;
}
