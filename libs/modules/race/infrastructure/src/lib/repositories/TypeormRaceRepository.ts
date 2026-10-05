import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';

import {
  FieldId,
  RaceAggregate,
  RaceData,
  RaceId,
  RaceListFilters,
  RaceNotFoundError,
  RaceRepository,
  RaceStatus,
} from '@trail/modules/race/domain';
import { RaceEntity } from '@trail/shared/database/data-access-main';

import { mapRaceAggregate } from '../mappers/mapRaceAggregate';
import { mapRaceEntity } from '../mappers/mapRaceEntity';

const RELATIONS = ['field_list'];

@Injectable()
export class TypeormRaceRepository extends RaceRepository {
  constructor(
    private readonly _publisher: EventPublisher,
    @InjectRepository(RaceEntity)
    private readonly _raceRepository: Repository<RaceEntity>,
  ) {
    super();
  }

  async list({ statusList }: RaceListFilters = {}): Promise<RaceAggregate[]> {
    const entityList = await this._raceRepository.find({
      where: statusList ? { status: In(statusList) } : {},
      relations: RELATIONS,
      order: { created_at: 'ASC' },
    });
    return entityList
      .map((entity) => this._mapEntity(entity))
      .sort(RaceAggregate.compareByStart);
  }

  getById(id: RaceId): Promise<RaceAggregate> {
    return this._getOne({ id });
  }

  // Filtering on the relation would load the matching field only, so find the race id first.
  async getByFieldId(fieldId: FieldId): Promise<RaceAggregate> {
    const entity = await this._raceRepository.findOne({
      where: { field_list: { id: fieldId } },
      select: { id: true },
    });
    if (!entity) {
      throw new RaceNotFoundError();
    }
    return this.getById(entity.id);
  }

  async create(data: RaceData): Promise<RaceAggregate> {
    const parsed = RaceAggregate.assertData(data);
    const entity = await this._raceRepository.save(
      this._raceRepository.create({
        name: parsed.name,
        location: parsed.location,
        distance_in_km: parsed.distanceInKm,
        elevation_gain_in_meters: parsed.elevationGainInMeters,
        timezone: parsed.timezone,
        website_url: parsed.websiteUrl,
        live_trail_url: parsed.liveTrailUrl,
        pick_count: parsed.pickCount,
        time_tolerance_percent: parsed.timeTolerancePercent,
        status: RaceStatus.Draft,
        field_list: [],
      }),
    );
    return this.getById(entity.id);
  }

  async save(race: RaceAggregate): Promise<RaceAggregate> {
    await this._raceRepository.save(
      this._raceRepository.create(mapRaceEntity(race)),
    );
    return this.getById(race.id);
  }

  // Fields, start lists, predictions, results and scores go with it (ON DELETE CASCADE).
  async delete(race: RaceAggregate): Promise<void> {
    await this._raceRepository.delete({ id: race.id });
  }

  private async _getOne(
    where: FindOptionsWhere<RaceEntity>,
  ): Promise<RaceAggregate> {
    const entity = await this._raceRepository.findOne({
      where,
      relations: RELATIONS,
    });
    if (!entity) {
      throw new RaceNotFoundError();
    }
    return this._mapEntity(entity);
  }

  private _mapEntity(entity: RaceEntity): RaceAggregate {
    const aggregate = mapRaceAggregate(entity);
    this._publisher.mergeObjectContext(aggregate);
    return aggregate;
  }
}
