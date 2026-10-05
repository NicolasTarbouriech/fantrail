import { ZodError } from 'zod';

import {
  RaceAggregate,
  RaceRepository,
  RaceStatus,
} from '@trail/modules/race/domain';
import {
  RACE_ID,
  buildRaceAggregate,
} from '@trail/modules/race/domain-testing';

import { DeleteRaceCommand } from './DeleteRaceCommand';
import { DeleteRaceCommandHandler } from './DeleteRaceCommandHandler';

describe('DeleteRaceCommandHandler', () => {
  let race: RaceAggregate;
  let raceRepository: RaceRepository;

  beforeEach(() => {
    race = buildRaceAggregate({ status: RaceStatus.Open });
    jest.spyOn(race, 'commit');
    raceRepository = {
      getById: jest.fn(() => Promise.resolve(race)),
      delete: jest.fn(),
    } as unknown as RaceRepository;
  });

  it('deletes the race, then publishes its deletion', async () => {
    await new DeleteRaceCommandHandler(raceRepository).execute(
      new DeleteRaceCommand({ raceId: RACE_ID }),
    );
    expect(raceRepository.delete).toHaveBeenCalledWith(race);
    expect(race.commit).toHaveBeenCalled();
  });

  it('rejects an invalid input', () => {
    expect(() => new DeleteRaceCommand({ raceId: 'not-a-uuid' })).toThrow(
      ZodError,
    );
  });
});
