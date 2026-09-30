import { of, toArray } from 'rxjs';

import {
  FieldResultPublishedNestEvent,
  ResultEventName,
} from '@trail/modules/result/domain';

import { ComputeFieldScoresCommand } from '../commands/ComputeFieldScoresCommand';
import { ScoringSagas } from './ScoringSagas';

describe('ScoringSagas', () => {
  it('scores the field again each time its result is published', (done) => {
    const fieldId = '22222222-2222-4222-8222-222222222222';
    const event = new FieldResultPublishedNestEvent({
      eventId: '99999999-9999-4999-8999-999999999999',
      timestamp: 0,
      name: ResultEventName.FieldResultPublished,
      payload: { fieldId, version: 2 },
    });
    new ScoringSagas()
      .fieldResultPublished(of(event, { unrelated: true }))
      .pipe(toArray())
      .subscribe((commandList) => {
        expect(commandList).toEqual([
          new ComputeFieldScoresCommand({ fieldId }),
        ]);
        done();
      });
  });
});
