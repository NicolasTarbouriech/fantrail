import { FieldId, UserId } from '../types';
import { PlayerFieldScore } from '../valueObjects';

export abstract class FieldScoreRepository {
  abstract replaceForField(
    fieldId: FieldId,
    scoreList: PlayerFieldScore[],
  ): Promise<void>;
  abstract listByFieldIdList(
    fieldIdList: FieldId[],
    userIdList?: UserId[],
  ): Promise<PlayerFieldScore[]>;
  abstract findByUserAndField(
    userId: UserId,
    fieldId: FieldId,
  ): Promise<PlayerFieldScore | null>;
}
