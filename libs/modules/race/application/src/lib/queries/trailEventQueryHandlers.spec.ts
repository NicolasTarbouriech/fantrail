import { TrailEventRepository } from '@trail/modules/race/domain';
import {
  TRAIL_EVENT_ID,
  buildTrailEventAggregate,
} from '@trail/modules/race/domain-testing';

import { ListTrailEventsByIdListQuery } from './ListTrailEventsByIdListQuery';
import { ListTrailEventsByIdListQueryHandler } from './ListTrailEventsByIdListQueryHandler';
import { ListTrailEventsQuery } from './ListTrailEventsQuery';
import { ListTrailEventsQueryHandler } from './ListTrailEventsQueryHandler';

describe('trail event query handlers', () => {
  const trailEvent = buildTrailEventAggregate();
  const trailEventRepository = {
    list: jest.fn().mockResolvedValue([trailEvent]),
  } as unknown as TrailEventRepository;

  it('ListTrailEventsQueryHandler lists every event', async () => {
    await expect(
      new ListTrailEventsQueryHandler(trailEventRepository).execute(),
    ).resolves.toEqual([trailEvent]);
    expect(trailEventRepository.list).toHaveBeenLastCalledWith();
    expect(new ListTrailEventsQuery().input).toEqual({});
  });

  it('ListTrailEventsByIdListQueryHandler reads events by ids', async () => {
    await expect(
      new ListTrailEventsByIdListQueryHandler(trailEventRepository).execute(
        new ListTrailEventsByIdListQuery({
          trailEventIdList: [TRAIL_EVENT_ID],
        }),
      ),
    ).resolves.toEqual([trailEvent]);
    expect(trailEventRepository.list).toHaveBeenLastCalledWith({
      idList: [TRAIL_EVENT_ID],
    });
  });
});
