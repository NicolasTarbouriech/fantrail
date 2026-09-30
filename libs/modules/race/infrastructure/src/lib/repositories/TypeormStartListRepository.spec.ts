import { EventPublisher } from '@nestjs/cqrs';
import { Repository } from 'typeorm';

import {
  MEN_FIELD_ID,
  WOMEN_FIELD_ID,
  buildStartList,
} from '@trail/modules/race/domain-testing';
import { RunnerEntity } from '@trail/shared/database/data-access-main';

import { mapRunnerEntityList } from '../mappers/mapRunnerEntityList';
import { TypeormStartListRepository } from './TypeormStartListRepository';

describe('TypeormStartListRepository', () => {
  const entityList = mapRunnerEntityList(
    buildStartList({ runnerCount: 2 }),
  ) as RunnerEntity[];
  let runnerRepository: Repository<RunnerEntity>;
  let publisher: EventPublisher;
  let repository: TypeormStartListRepository;

  beforeEach(() => {
    runnerRepository = {
      find: jest.fn().mockResolvedValue(entityList),
      create: jest.fn((value) => value),
      save: jest.fn((value) => Promise.resolve(value)),
    } as unknown as Repository<RunnerEntity>;
    publisher = {
      mergeObjectContext: jest.fn((aggregate) => aggregate),
    } as unknown as EventPublisher;
    repository = new TypeormStartListRepository(publisher, runnerRepository);
  });

  it('reads the start list of a field, empty when no runner is entered', async () => {
    expect(
      (await repository.getByFieldId(MEN_FIELD_ID)).runnerList,
    ).toHaveLength(2);
    jest.mocked(runnerRepository.find).mockResolvedValueOnce([]);
    expect((await repository.getByFieldId(WOMEN_FIELD_ID)).runnerList).toEqual(
      [],
    );
  });

  it('groups the runners of several fields', async () => {
    const [men, women] = await repository.listByFieldIdList([
      MEN_FIELD_ID,
      WOMEN_FIELD_ID,
    ]);
    expect(men.runnerList).toHaveLength(2);
    expect(women.runnerList).toEqual([]);
  });

  it('saves every runner with its position', async () => {
    await repository.save(buildStartList({ runnerCount: 2 }));
    expect(runnerRepository.save).toHaveBeenCalledWith([
      expect.objectContaining({ field_id: MEN_FIELD_ID, position: 0 }),
      expect.objectContaining({ field_id: MEN_FIELD_ID, position: 1 }),
    ]);
  });
});
