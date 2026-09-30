import { FieldId } from '../types';
import { FieldScoringSource } from '../valueObjects';

export abstract class FieldScoringSourceRepository {
  // Null while no result is published for the field.
  abstract findByFieldId(fieldId: FieldId): Promise<FieldScoringSource | null>;
}
