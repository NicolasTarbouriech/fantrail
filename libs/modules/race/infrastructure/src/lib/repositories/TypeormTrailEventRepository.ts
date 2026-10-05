import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';

import {
  TrailEventAggregate,
  TrailEventData,
  TrailEventId,
  TrailEventListFilters,
  TrailEventNameAlreadyUsedError,
  TrailEventNotFoundError,
  TrailEventRepository,
} from '@trail/modules/race/domain';
import {
  TRAIL_EVENT_NAME_KEY_UNIQUE_INDEX,
  TrailEventEntity,
  isUniqueViolation,
} from '@trail/shared/database/data-access-main';

import { mapTrailEventAggregate } from '../mappers/mapTrailEventAggregate';

function toEntity(data: TrailEventData): DeepPartial<TrailEventEntity> {
  return {
    name: data.name,
    name_key: TrailEventAggregate.nameKey(data.name),
    logo: data.logo ? Buffer.from(data.logo.bytes) : null,
    logo_content_type: data.logo?.contentType ?? null,
  };
}

@Injectable()
export class TypeormTrailEventRepository extends TrailEventRepository {
  constructor(
    private readonly _publisher: EventPublisher,
    @InjectRepository(TrailEventEntity)
    private readonly _trailEventRepository: Repository<TrailEventEntity>,
  ) {
    super();
  }

  async list({ idList }: TrailEventListFilters = {}): Promise<
    TrailEventAggregate[]
  > {
    const entityList = await this._trailEventRepository.find({
      where: idList ? { id: In(idList) } : {},
      order: { name: 'ASC' },
    });
    return entityList.map((entity) => this._mapEntity(entity));
  }

  async getById(id: TrailEventId): Promise<TrailEventAggregate> {
    const entity = await this._trailEventRepository.findOne({ where: { id } });
    if (!entity) {
      throw new TrailEventNotFoundError();
    }
    return this._mapEntity(entity);
  }

  async create(data: TrailEventData): Promise<TrailEventAggregate> {
    const parsed = TrailEventAggregate.assertData(data);
    const entity = await this._withUniqueName(() =>
      this._trailEventRepository.save(
        this._trailEventRepository.create(toEntity(parsed)),
      ),
    );
    return this.getById(entity.id);
  }

  async save(trailEvent: TrailEventAggregate): Promise<TrailEventAggregate> {
    await this._withUniqueName(() =>
      this._trailEventRepository.save(
        this._trailEventRepository.create({
          id: trailEvent.id,
          ...toEntity(trailEvent.data),
        }),
      ),
    );
    return this.getById(trailEvent.id);
  }

  // Its races stay, detached from it (ON DELETE SET NULL).
  async delete(trailEvent: TrailEventAggregate): Promise<void> {
    await this._trailEventRepository.delete({ id: trailEvent.id });
  }

  private async _withUniqueName<T>(write: () => Promise<T>): Promise<T> {
    try {
      return await write();
    } catch (error) {
      if (isUniqueViolation(error, TRAIL_EVENT_NAME_KEY_UNIQUE_INDEX)) {
        throw new TrailEventNameAlreadyUsedError();
      }
      throw error;
    }
  }

  private _mapEntity(entity: TrailEventEntity): TrailEventAggregate {
    const aggregate = mapTrailEventAggregate(entity);
    this._publisher.mergeObjectContext(aggregate);
    return aggregate;
  }
}
