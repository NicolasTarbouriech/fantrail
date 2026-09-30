import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import {
  FieldId,
  FieldScoreRepository,
  PlayerFieldScore,
  UserId,
} from '@trail/modules/scoring/domain';
import { FieldScoreEntity } from '@trail/shared/database/data-access-main';

import {
  mapFieldScoreEntity,
  mapPlayerFieldScore,
} from '../mappers/mapPlayerFieldScore';

@Injectable()
export class TypeormFieldScoreRepository extends FieldScoreRepository {
  constructor(
    @InjectRepository(FieldScoreEntity)
    private readonly _fieldScoreRepository: Repository<FieldScoreEntity>,
  ) {
    super();
  }

  // A new result version replaces every score of the field at once.
  async replaceForField(
    fieldId: FieldId,
    scoreList: PlayerFieldScore[],
  ): Promise<void> {
    await this._fieldScoreRepository.manager.transaction(async (manager) => {
      await manager.delete(FieldScoreEntity, { field_id: fieldId });
      if (scoreList.length > 0) {
        await manager.insert(
          FieldScoreEntity,
          scoreList.map(mapFieldScoreEntity),
        );
      }
    });
  }

  async listByFieldIdList(
    fieldIdList: FieldId[],
    userIdList?: UserId[],
  ): Promise<PlayerFieldScore[]> {
    if (fieldIdList.length === 0) {
      return [];
    }
    const entityList = await this._fieldScoreRepository.find({
      where: {
        field_id: In(fieldIdList),
        ...(userIdList ? { user_id: In(userIdList) } : {}),
      },
    });
    return entityList.map(mapPlayerFieldScore);
  }

  async findByUserAndField(
    userId: UserId,
    fieldId: FieldId,
  ): Promise<PlayerFieldScore | null> {
    const entity = await this._fieldScoreRepository.findOne({
      where: { user_id: userId, field_id: fieldId },
    });
    return entity ? mapPlayerFieldScore(entity) : null;
  }
}
