import {
  RaceAggregate,
  RaceRepository,
  RaceStatus,
  TrailEventNotFoundError,
  TrailEventRepository,
} from '@trail/modules/race/domain';
import {
  RACE_ID,
  TRAIL_EVENT_ID,
  buildRaceAggregate,
  buildTrailEventAggregate,
} from '@trail/modules/race/domain-testing';

import { ChangeRaceTrailEventCommand } from './ChangeRaceTrailEventCommand';
import { ChangeRaceTrailEventCommandHandler } from './ChangeRaceTrailEventCommandHandler';

describe('ChangeRaceTrailEventCommandHandler', () => {
  let race: RaceAggregate;
  let raceRepository: RaceRepository;
  let trailEventRepository: TrailEventRepository;
  let handler: ChangeRaceTrailEventCommandHandler;

  beforeEach(() => {
    race = buildRaceAggregate({ status: RaceStatus.Scored });
    raceRepository = {
      getById: jest.fn().mockResolvedValue(race),
      save: jest.fn((aggregate) => Promise.resolve(aggregate)),
    } as unknown as RaceRepository;
    trailEventRepository = {
      getById: jest.fn().mockResolvedValue(buildTrailEventAggregate()),
    } as unknown as TrailEventRepository;
    handler = new ChangeRaceTrailEventCommandHandler(
      raceRepository,
      trailEventRepository,
    );
  });

  it('puts a race in an event, even once scored', async () => {
    const saved = await handler.execute(
      new ChangeRaceTrailEventCommand({
        raceId: RACE_ID,
        trailEventId: TRAIL_EVENT_ID,
      }),
    );
    expect(trailEventRepository.getById).toHaveBeenCalledWith(TRAIL_EVENT_ID);
    expect(saved.data.trailEventId).toBe(TRAIL_EVENT_ID);
    expect(raceRepository.save).toHaveBeenCalledWith(race);
  });

  it('takes a race out of its event', async () => {
    race.changeTrailEvent(TRAIL_EVENT_ID);
    const saved = await handler.execute(
      new ChangeRaceTrailEventCommand({ raceId: RACE_ID, trailEventId: null }),
    );
    expect(trailEventRepository.getById).not.toHaveBeenCalled();
    expect(saved.data.trailEventId).toBeNull();
  });

  it('refuses an unknown event', async () => {
    jest
      .mocked(trailEventRepository.getById)
      .mockRejectedValueOnce(new TrailEventNotFoundError());
    await expect(
      handler.execute(
        new ChangeRaceTrailEventCommand({
          raceId: RACE_ID,
          trailEventId: TRAIL_EVENT_ID,
        }),
      ),
    ).rejects.toThrow(TrailEventNotFoundError);
    expect(raceRepository.save).not.toHaveBeenCalled();
  });
});
