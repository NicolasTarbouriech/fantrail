import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import {
  FieldId,
  StartListAggregate,
  StartListRepository,
} from '@trail/modules/race/domain';
import { RunnerEntity } from '@trail/shared/database/data-access-main';

import { mapRunnerEntityList } from '../mappers/mapRunnerEntityList';
import { mapStartListAggregate } from '../mappers/mapStartListAggregate';

@Injectable()
export class TypeormStartListRepository extends StartListRepository {
  constructor(
    private readonly _publisher: EventPublisher,
    @InjectRepository(RunnerEntity)
    private readonly _runnerRepository: Repository<RunnerEntity>,
  ) {
    super();
  }

  async getByFieldId(fieldId: FieldId): Promise<StartListAggregate> {
    const entityList = await this._runnerRepository.find({
      where: { field_id: fieldId },
    });
    return this._mapStartList(fieldId, entityList);
  }

  async listByFieldIdList(
    fieldIdList: FieldId[],
  ): Promise<StartListAggregate[]> {
    const entityList = await this._runnerRepository.find({
      where: { field_id: In(fieldIdList) },
    });
    return fieldIdList.map((fieldId) =>
      this._mapStartList(
        fieldId,
        entityList.filter((entity) => entity.field_id === fieldId),
      ),
    );
  }

  async save(startList: StartListAggregate): Promise<StartListAggregate> {
    await this._runnerRepository.save(
      this._runnerRepository.create(mapRunnerEntityList(startList)),
    );
    return this.getByFieldId(startList.fieldId);
  }

  private _mapStartList(
    fieldId: FieldId,
    entityList: RunnerEntity[],
  ): StartListAggregate {
    const aggregate = mapStartListAggregate(fieldId, entityList);
    this._publisher.mergeObjectContext(aggregate);
    return aggregate;
  }
}
