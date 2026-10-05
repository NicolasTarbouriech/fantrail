import { ZodError } from 'zod';

import {
  TrailEventAggregate,
  TrailEventLogoInvalidError,
  TrailEventRepository,
} from '@trail/modules/race/domain';
import {
  TRAIL_EVENT_ID,
  buildTrailEventAggregate,
  buildTrailEventData,
  buildTrailEventLogo,
} from '@trail/modules/race/domain-testing';

import { CreateTrailEventCommand } from './CreateTrailEventCommand';
import { CreateTrailEventCommandHandler } from './CreateTrailEventCommandHandler';
import { DeleteTrailEventCommand } from './DeleteTrailEventCommand';
import { DeleteTrailEventCommandHandler } from './DeleteTrailEventCommandHandler';
import { UpdateTrailEventCommand } from './UpdateTrailEventCommand';
import { UpdateTrailEventCommandHandler } from './UpdateTrailEventCommandHandler';

describe('trail event command handlers', () => {
  let trailEvent: TrailEventAggregate;
  let trailEventRepository: TrailEventRepository;

  beforeEach(() => {
    trailEvent = buildTrailEventAggregate();
    trailEventRepository = {
      getById: jest.fn().mockResolvedValue(trailEvent),
      create: jest.fn().mockResolvedValue(trailEvent),
      save: jest.fn((aggregate) => Promise.resolve(aggregate)),
      delete: jest.fn(),
    } as unknown as TrailEventRepository;
  });

  it('CreateTrailEventCommandHandler creates the event', async () => {
    const data = buildTrailEventData({ name: 'Festival des Templiers' });
    await expect(
      new CreateTrailEventCommandHandler(trailEventRepository).execute(
        new CreateTrailEventCommand({ data }),
      ),
    ).resolves.toBe(trailEvent);
    expect(trailEventRepository.create).toHaveBeenCalledWith(data);
  });

  it('CreateTrailEventCommand rejects a name too short', () => {
    expect(
      () =>
        new CreateTrailEventCommand({
          data: buildTrailEventData({ name: 'G' }),
        }),
    ).toThrow(ZodError);
  });

  it('UpdateTrailEventCommandHandler renames the event and drops its logo', async () => {
    const saved = await new UpdateTrailEventCommandHandler(
      trailEventRepository,
    ).execute(
      new UpdateTrailEventCommand({
        trailEventId: TRAIL_EVENT_ID,
        data: buildTrailEventData({ name: 'Grand Raid 974', logo: null }),
      }),
    );
    expect(saved.name).toBe('Grand Raid 974');
    expect(saved.logo).toBeNull();
    expect(trailEventRepository.save).toHaveBeenCalledWith(trailEvent);
  });

  it('UpdateTrailEventCommandHandler refuses a GIF logo', async () => {
    await expect(
      new UpdateTrailEventCommandHandler(trailEventRepository).execute(
        new UpdateTrailEventCommand({
          trailEventId: TRAIL_EVENT_ID,
          data: buildTrailEventData({
            logo: buildTrailEventLogo({ contentType: 'image/gif' }),
          }),
        }),
      ),
    ).rejects.toThrow(TrailEventLogoInvalidError);
    expect(trailEventRepository.save).not.toHaveBeenCalled();
  });

  it('DeleteTrailEventCommandHandler deletes the event', async () => {
    await new DeleteTrailEventCommandHandler(trailEventRepository).execute(
      new DeleteTrailEventCommand({ trailEventId: TRAIL_EVENT_ID }),
    );
    expect(trailEventRepository.delete).toHaveBeenCalledWith(trailEvent);
  });
});
