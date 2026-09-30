import { EventPublisher } from '@nestjs/cqrs';
import { Repository } from 'typeorm';

import { RaceNotFoundError, RaceStatus } from '@trail/modules/race/domain';
import {
  MEN_FIELD_ID,
  RACE_ID,
  buildRaceAggregate,
  buildRaceData,
} from '@trail/modules/race/domain-testing';
import { RaceEntity } from '@trail/shared/database/data-access-main';

import { mapRaceEntity } from '../mappers/mapRaceEntity';
import { TypeormRaceRepository } from './TypeormRaceRepository';

describe('TypeormRaceRepository', () => {
  const entity = mapRaceEntity(buildRaceAggregate()) as RaceEntity;
  let raceRepository: Repository<RaceEntity>;
  let publisher: EventPublisher;
  let repository: TypeormRaceRepository;

  beforeEach(() => {
    raceRepository = {
      find: jest.fn().mockResolvedValue([entity]),
      findOne: jest.fn().mockResolvedValue(entity),
      create: jest.fn((value) => value),
      save: jest.fn((value) => Promise.resolve({ ...value, id: RACE_ID })),
    } as unknown as Repository<RaceEntity>;
    publisher = {
      mergeObjectContext: jest.fn((aggregate) => aggregate),
    } as unknown as EventPublisher;
    repository = new TypeormRaceRepository(publisher, raceRepository);
  });

  it('lists races filtered by status with their fields only', async () => {
    const raceList = await repository.list({ statusList: [RaceStatus.Open] });
    expect(raceList).toHaveLength(1);
    expect(raceRepository.find).toHaveBeenCalledWith(
      expect.objectContaining({ relations: ['field_list'] }),
    );
    await repository.list();
    expect(raceRepository.find).toHaveBeenLastCalledWith(
      expect.objectContaining({ where: {} }),
    );
  });

  it('gets a race by one of its fields, then loads all its fields', async () => {
    const race = await repository.getByFieldId(MEN_FIELD_ID);
    expect(race.id).toBe(RACE_ID);
    expect(race.fieldList).toHaveLength(2);
    expect(raceRepository.findOne).toHaveBeenNthCalledWith(1, {
      where: { field_list: { id: MEN_FIELD_ID } },
      select: { id: true },
    });
    expect(raceRepository.findOne).toHaveBeenNthCalledWith(2, {
      where: { id: RACE_ID },
      relations: ['field_list'],
    });
    expect(publisher.mergeObjectContext).toHaveBeenCalledWith(race);
  });

  it('throws when the race does not exist', async () => {
    jest.mocked(raceRepository.findOne).mockResolvedValueOnce(null);
    await expect(repository.getById(RACE_ID)).rejects.toThrow(
      RaceNotFoundError,
    );
    jest.mocked(raceRepository.findOne).mockResolvedValueOnce(null);
    await expect(repository.getByFieldId(MEN_FIELD_ID)).rejects.toThrow(
      RaceNotFoundError,
    );
  });

  it('creates a draft race', async () => {
    await repository.create(buildRaceData());
    expect(raceRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        status: RaceStatus.Draft,
        name: 'Diagonale des Fous 2026',
        field_list: [],
      }),
    );
  });

  it('saves the race and its fields and reads it back', async () => {
    const race = await repository.save(buildRaceAggregate());
    expect(raceRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: RACE_ID }),
    );
    expect(race.id).toBe(RACE_ID);
  });
});
