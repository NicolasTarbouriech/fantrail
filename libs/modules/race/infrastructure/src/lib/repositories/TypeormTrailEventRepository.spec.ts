import { EventPublisher } from '@nestjs/cqrs';
import { QueryFailedError, Repository } from 'typeorm';

import {
  TrailEventNameAlreadyUsedError,
  TrailEventNotFoundError,
} from '@trail/modules/race/domain';
import {
  TRAIL_EVENT_ID,
  buildTrailEventAggregate,
  buildTrailEventData,
} from '@trail/modules/race/domain-testing';
import { TrailEventEntity } from '@trail/shared/database/data-access-main';

import { TypeormTrailEventRepository } from './TypeormTrailEventRepository';

const ENTITY = {
  id: TRAIL_EVENT_ID,
  name: 'Grand Raid',
  name_key: 'grand raid',
  logo: Buffer.from([137, 80, 78, 71]),
  logo_content_type: 'image/png',
  created_at: new Date('2026-10-05T10:00:00Z'),
  updated_at: new Date('2026-10-05T10:00:00Z'),
} as TrailEventEntity;

const nameViolation = (): QueryFailedError =>
  new QueryFailedError(
    'INSERT',
    [],
    Object.assign(new Error('duplicate'), {
      code: '23505',
      constraint: 'UQ_trail_events_name_key',
    }),
  );

describe('TypeormTrailEventRepository', () => {
  let trailEventRepository: Repository<TrailEventEntity>;
  let publisher: EventPublisher;
  let repository: TypeormTrailEventRepository;

  beforeEach(() => {
    trailEventRepository = {
      find: jest.fn().mockResolvedValue([ENTITY]),
      findOne: jest.fn().mockResolvedValue(ENTITY),
      create: jest.fn((value) => value),
      save: jest.fn((value) =>
        Promise.resolve({ ...value, id: TRAIL_EVENT_ID }),
      ),
      delete: jest.fn(),
    } as unknown as Repository<TrailEventEntity>;
    publisher = {
      mergeObjectContext: jest.fn((aggregate) => aggregate),
    } as unknown as EventPublisher;
    repository = new TypeormTrailEventRepository(
      publisher,
      trailEventRepository,
    );
  });

  it('lists events by name, every one or by ids', async () => {
    const [trailEvent] = await repository.list();
    expect(trailEvent?.logo?.contentType).toBe('image/png');
    expect(trailEventRepository.find).toHaveBeenLastCalledWith({
      where: {},
      order: { name: 'ASC' },
    });
    await repository.list({ idList: [TRAIL_EVENT_ID] });
    expect(trailEventRepository.find).toHaveBeenLastCalledWith(
      expect.objectContaining({ where: { id: expect.anything() } }),
    );
  });

  it('gets an event, without logo when none is stored, or throws', async () => {
    jest
      .mocked(trailEventRepository.findOne)
      .mockResolvedValueOnce({ ...ENTITY, logo: null });
    const trailEvent = await repository.getById(TRAIL_EVENT_ID);
    expect(trailEvent.logo).toBeNull();
    expect(publisher.mergeObjectContext).toHaveBeenCalledWith(trailEvent);
    jest.mocked(trailEventRepository.findOne).mockResolvedValueOnce(null);
    await expect(repository.getById(TRAIL_EVENT_ID)).rejects.toThrow(
      TrailEventNotFoundError,
    );
  });

  it('creates an event with its name key and logo bytes', async () => {
    await repository.create(
      buildTrailEventData({ name: 'Festival des Templiers' }),
    );
    expect(trailEventRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Festival des Templiers',
        name_key: 'festival des templiers',
        logo: Buffer.from([137, 80, 78, 71]),
        logo_content_type: 'image/png',
      }),
    );
  });

  it('saves an event without logo', async () => {
    await repository.save(buildTrailEventAggregate({ data: { logo: null } }));
    expect(trailEventRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: TRAIL_EVENT_ID,
        logo: null,
        logo_content_type: null,
      }),
    );
  });

  it('maps a name already taken to a domain error', async () => {
    jest
      .mocked(trailEventRepository.save)
      .mockRejectedValueOnce(nameViolation());
    await expect(
      repository.create(buildTrailEventData({ name: 'GRAND RAID' })),
    ).rejects.toThrow(TrailEventNameAlreadyUsedError);
    jest
      .mocked(trailEventRepository.save)
      .mockRejectedValueOnce(new Error('connection lost'));
    await expect(repository.save(buildTrailEventAggregate())).rejects.toThrow(
      'connection lost',
    );
  });

  it('deletes an event, its races stay', async () => {
    await repository.delete(buildTrailEventAggregate());
    expect(trailEventRepository.delete).toHaveBeenCalledWith({
      id: TRAIL_EVENT_ID,
    });
  });
});
