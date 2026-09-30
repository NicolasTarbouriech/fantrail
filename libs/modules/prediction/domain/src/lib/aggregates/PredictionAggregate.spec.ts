import { ZodError } from 'zod';

import {
  DuplicatePickError,
  PickCountMismatchError,
  PredictionLockedError,
  RunnerNotInFieldError,
  WithdrawnRunnerPickError,
} from '../errors';
import {
  buildPredictionAggregate,
  buildPredictionField,
  buildPredictionRunnerId,
} from '../testing';

const r = buildPredictionRunnerId;
const NOW = new Date('2026-10-14T10:00:00Z');
const TOP_5 = [r(1), r(2), r(3), r(4), r(5)];

describe('PredictionAggregate', () => {
  it('finalizes a complete prediction', () => {
    const prediction = buildPredictionAggregate();
    prediction.update(
      { pickList: TOP_5, winnerTimeEstimateInSeconds: 86400 },
      buildPredictionField(),
      NOW,
    );
    expect(prediction.isComplete).toBe(true);
    expect(prediction.finalizedAt).toEqual(NOW);
    expect(prediction.updatedAt).toEqual(NOW);
    expect(prediction.pickList).toEqual(TOP_5);
    expect(prediction.winnerTimeEstimateInSeconds).toBe(86400);
  });

  it('saves an incomplete prediction without finalizing it', () => {
    const prediction = buildPredictionAggregate({
      finalizedAt: new Date('2026-10-01T10:00:00Z'),
    });
    prediction.update(
      {
        pickList: [r(1), null, r(3), null, null],
        winnerTimeEstimateInSeconds: 86400,
      },
      buildPredictionField(),
      NOW,
    );
    expect(prediction.isComplete).toBe(false);
    expect(prediction.finalizedAt).toBeNull();
    prediction.update(
      { pickList: TOP_5, winnerTimeEstimateInSeconds: null },
      buildPredictionField(),
      NOW,
    );
    expect(prediction.isComplete).toBe(false);
  });

  it('refuses any change once the field is locked', () => {
    expect(() =>
      buildPredictionAggregate().update(
        { pickList: TOP_5, winnerTimeEstimateInSeconds: 86400 },
        buildPredictionField({ isOpen: false }),
        NOW,
      ),
    ).toThrow(PredictionLockedError);
  });

  it('needs one slot per pick position', () => {
    expect(() =>
      buildPredictionAggregate().update(
        { pickList: [r(1)], winnerTimeEstimateInSeconds: null },
        buildPredictionField(),
        NOW,
      ),
    ).toThrow(PickCountMismatchError);
  });

  it('refuses the same runner twice and runners from another field', () => {
    const prediction = buildPredictionAggregate();
    expect(() =>
      prediction.update(
        {
          pickList: [r(1), r(1), null, null, null],
          winnerTimeEstimateInSeconds: null,
        },
        buildPredictionField(),
        NOW,
      ),
    ).toThrow(DuplicatePickError);
    expect(() =>
      prediction.update(
        {
          pickList: [r(42), null, null, null, null],
          winnerTimeEstimateInSeconds: null,
        },
        buildPredictionField(),
        NOW,
      ),
    ).toThrow(RunnerNotInFieldError);
  });

  it('keeps a withdrawn runner already picked but refuses a new one', () => {
    const field = buildPredictionField({ withdrawnRunnerIdList: [r(2), r(9)] });
    const prediction = buildPredictionAggregate({ pickList: TOP_5 });
    expect(prediction.withdrawnRunnerIdList(field)).toEqual([r(2)]);
    prediction.update(
      {
        pickList: [r(2), r(1), r(3), r(4), r(5)],
        winnerTimeEstimateInSeconds: 86400,
      },
      field,
      NOW,
    );
    expect(prediction.isComplete).toBe(true);
    expect(() =>
      prediction.update(
        {
          pickList: [r(2), r(9), r(3), r(4), r(5)],
          winnerTimeEstimateInSeconds: 86400,
        },
        field,
        NOW,
      ),
    ).toThrow(WithdrawnRunnerPickError);
  });

  it('rejects an invalid winner time', () => {
    expect(() =>
      buildPredictionAggregate().update(
        { pickList: TOP_5, winnerTimeEstimateInSeconds: -1 },
        buildPredictionField(),
        NOW,
      ),
    ).toThrow(ZodError);
  });
});
