import {
  PredictionFieldRepository,
  PredictionLockedError,
  PredictionRepository,
} from '@trail/modules/prediction/domain';
import {
  PREDICTION_FIELD_ID,
  PREDICTION_USER_ID,
  buildPredictionAggregate,
  buildPredictionField,
  buildPredictionRunnerId,
} from '@trail/modules/prediction/domain-testing';

import { SavePredictionCommand } from './SavePredictionCommand';
import { SavePredictionCommandHandler } from './SavePredictionCommandHandler';

const r = buildPredictionRunnerId;
const NOW = new Date('2026-10-14T10:00:00Z');
const COMMAND = new SavePredictionCommand({
  userId: PREDICTION_USER_ID,
  fieldId: PREDICTION_FIELD_ID,
  pickList: [r(1), r(2), r(3), r(4), r(5)],
  winnerTimeEstimateInSeconds: 86400,
});

describe('SavePredictionCommandHandler', () => {
  function given({ existing = true, isOpen = true } = {}) {
    const predictionRepository = {
      findByUserAndField: jest
        .fn()
        .mockResolvedValue(existing ? buildPredictionAggregate() : null),
      create: jest.fn().mockResolvedValue(buildPredictionAggregate()),
      save: jest.fn((aggregate) => Promise.resolve(aggregate)),
    } as unknown as PredictionRepository;
    const predictionFieldRepository = {
      getByFieldId: jest
        .fn()
        .mockResolvedValue(buildPredictionField({ isOpen })),
    } as unknown as PredictionFieldRepository;
    return {
      predictionRepository,
      handler: new SavePredictionCommandHandler(
        predictionRepository,
        predictionFieldRepository,
      ),
    };
  }

  beforeEach(() => {
    jest.useFakeTimers({ now: NOW });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('updates the existing prediction', async () => {
    const { handler, predictionRepository } = given();
    const saved = await handler.execute(COMMAND);
    expect(saved.isComplete).toBe(true);
    expect(saved.finalizedAt).toEqual(NOW);
    expect(predictionRepository.create).not.toHaveBeenCalled();
  });

  it('creates the prediction on the first save', async () => {
    const { handler, predictionRepository } = given({ existing: false });
    await handler.execute(COMMAND);
    expect(predictionRepository.create).toHaveBeenCalledWith({
      userId: PREDICTION_USER_ID,
      fieldId: PREDICTION_FIELD_ID,
      pickCount: 5,
    });
  });

  it('creates nothing once the field is locked', async () => {
    const { handler, predictionRepository } = given({
      existing: false,
      isOpen: false,
    });
    await expect(handler.execute(COMMAND)).rejects.toThrow(
      PredictionLockedError,
    );
    expect(predictionRepository.create).not.toHaveBeenCalled();
    expect(predictionRepository.save).not.toHaveBeenCalled();
  });
});
