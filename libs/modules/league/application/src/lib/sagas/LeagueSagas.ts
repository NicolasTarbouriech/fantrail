import { Injectable } from '@nestjs/common';
import { ICommand, IEvent, Saga, ofType } from '@nestjs/cqrs';
import { Observable, map } from 'rxjs';

import { RaceDeletedNestEvent } from '@trail/modules/race/domain';

import { RemoveRaceFromLeaguesCommand } from '../commands/RemoveRaceFromLeaguesCommand';

@Injectable()
export class LeagueSagas {
  @Saga()
  raceDeleted = (events$: Observable<IEvent>): Observable<ICommand> =>
    events$.pipe(
      ofType(RaceDeletedNestEvent),
      map(
        ({ event }) =>
          new RemoveRaceFromLeaguesCommand({ raceId: event.payload.raceId }),
      ),
    );
}
