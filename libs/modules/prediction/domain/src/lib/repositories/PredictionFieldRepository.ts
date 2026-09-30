import { FieldId } from '../types';
import { PredictionField } from '../valueObjects';

export abstract class PredictionFieldRepository {
  abstract getByFieldId(fieldId: FieldId): Promise<PredictionField>;
}
