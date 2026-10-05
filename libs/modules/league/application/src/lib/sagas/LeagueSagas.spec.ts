import { of, toArray } from 'rxjs';

import {
  RaceDeletedNestEvent,
  RaceEventName,
} from '@trail/modules/race/domain';

import { RemoveRaceFromLeaguesCommand } from '../commands/RemoveRaceFromLeaguesCommand';
import { LeagueSagas } from './LeagueSagas';

describe('LeagueSagas', () => {
  it('removes a deleted race from the leagues', (done) => {
    const raceId = '77777777-7777-4777-8777-777777777771';
    const event = new RaceDeletedNestEvent({
      eventId: '99999999-9999-4999-8999-999999999999',
      timestamp: 0,
      name: RaceEventName.RaceDeleted,
      payload: { raceId, fieldIdList: [] },
    });
    new LeagueSagas()
      .raceDeleted(of(event, { unrelated: true }))
      .pipe(toArray())
      .subscribe((commandList) => {
        expect(commandList).toEqual([
          new RemoveRaceFromLeaguesCommand({ raceId }),
        ]);
        done();
      });
  });
});
