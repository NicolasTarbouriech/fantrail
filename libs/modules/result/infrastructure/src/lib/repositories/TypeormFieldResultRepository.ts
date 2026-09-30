import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import {
  FieldId,
  FieldResultAggregate,
  FieldResultRepository,
} from '@trail/modules/result/domain';
import { FieldResultEntity } from '@trail/shared/database/data-access-main';

import { mapFieldResultAggregate } from '../mappers/mapFieldResultAggregate';

@Injectable()
export class TypeormFieldResultRepository extends FieldResultRepository {
  constructor(
    private readonly _publisher: EventPublisher,
    @InjectRepository(FieldResultEntity)
    private readonly _fieldResultRepository: Repository<FieldResultEntity>,
  ) {
    super();
  }

  async getByFieldId(fieldId: FieldId): Promise<FieldResultAggregate> {
    const entity = await this._fieldResultRepository.findOne({
      where: { field_id: fieldId },
      order: { version: 'DESC' },
    });
    return this._mapEntity(fieldId, entity);
  }

  async listByFieldIdList(
    fieldIdList: FieldId[],
  ): Promise<FieldResultAggregate[]> {
    const entityList = await this._fieldResultRepository.find({
      where: { field_id: In(fieldIdList) },
      order: { version: 'DESC' },
    });
    return fieldIdList.map((fieldId) =>
      this._mapEntity(
        fieldId,
        entityList.find((entity) => entity.field_id === fieldId) ?? null,
      ),
    );
  }

  async save(result: FieldResultAggregate): Promise<FieldResultAggregate> {
    if (result.isPublished && result.publishedAt) {
      await this._fieldResultRepository.insert({
        field_id: result.fieldId,
        version: result.version,
        ranking_list: result.data.rankingList,
        winner_time_in_seconds: result.data.winnerTimeInSeconds,
        dnf_runner_id_list: result.data.dnfRunnerIdList,
        published_at: result.publishedAt,
      });
    }
    return this.getByFieldId(result.fieldId);
  }

  private _mapEntity(
    fieldId: FieldId,
    entity: FieldResultEntity | null,
  ): FieldResultAggregate {
    const aggregate = mapFieldResultAggregate(fieldId, entity);
    this._publisher.mergeObjectContext(aggregate);
    return aggregate;
  }
}
