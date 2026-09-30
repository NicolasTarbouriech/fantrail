import { Injectable } from '@nestjs/common';
import { ICommand, IEvent, Saga, ofType } from '@nestjs/cqrs';
import { Observable, map } from 'rxjs';

import { FieldResultPublishedNestEvent } from '@trail/modules/result/domain';

import { ComputeFieldScoresCommand } from '../commands/ComputeFieldScoresCommand';

@Injectable()
export class ScoringSagas {
  @Saga()
  fieldResultPublished = (events$: Observable<IEvent>): Observable<ICommand> =>
    events$.pipe(
      ofType(FieldResultPublishedNestEvent),
      map(
        ({ event }) =>
          new ComputeFieldScoresCommand({ fieldId: event.payload.fieldId }),
      ),
    );
}
