import { FieldId } from '../types';
import { ResultField } from '../valueObjects';

export abstract class ResultFieldRepository {
  abstract getByFieldId(fieldId: FieldId): Promise<ResultField>;
}
