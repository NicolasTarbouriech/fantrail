import { ZodError } from 'zod';

import { RaceRepository } from '@trail/modules/race/domain';
import {
  buildRaceAggregate,
  buildRaceData,
} from '@trail/modules/race/domain-testing';

import { CreateRaceCommand } from './CreateRaceCommand';
import { CreateRaceCommandHandler } from './CreateRaceCommandHandler';

describe('CreateRaceCommandHandler', () => {
  it('creates the race through the repository', async () => {
    const race = buildRaceAggregate();
    const raceRepository = {
      create: jest.fn().mockResolvedValue(race),
    } as unknown as RaceRepository;
    const handler = new CreateRaceCommandHandler(raceRepository);
    await expect(
      handler.execute(new CreateRaceCommand({ data: buildRaceData() })),
    ).resolves.toBe(race);
    expect(raceRepository.create).toHaveBeenCalledWith(buildRaceData());
  });

  it('rejects an invalid pick count', () => {
    expect(
      () =>
        new CreateRaceCommand({
          data: { ...buildRaceData(), pickCount: 4 as 5 },
        }),
    ).toThrow(ZodError);
  });
});
