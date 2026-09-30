import {
  PredictionFieldRepository,
  PredictionRepository,
  PredictionsHiddenError,
} from '@trail/modules/prediction/domain';
import {
  PREDICTION_FIELD_ID,
  PREDICTION_USER_ID,
  buildPredictionAggregate,
  buildPredictionField,
} from '@trail/modules/prediction/domain-testing';

import { ListRevealedPredictionsByFieldQuery } from './ListRevealedPredictionsByFieldQuery';
import { ListRevealedPredictionsByFieldQueryHandler } from './ListRevealedPredictionsByFieldQueryHandler';

describe('ListRevealedPredictionsByFieldQueryHandler', () => {
  function given(isOpen: boolean) {
    const predictionRepository = {
      listByField: jest.fn().mockResolvedValue([buildPredictionAggregate()]),
    } as unknown as PredictionRepository;
    const predictionFieldRepository = {
      getByFieldId: jest
        .fn()
        .mockResolvedValue(buildPredictionField({ isOpen })),
    } as unknown as PredictionFieldRepository;
    return {
      predictionRepository,
      handler: new ListRevealedPredictionsByFieldQueryHandler(
        predictionRepository,
        predictionFieldRepository,
      ),
    };
  }
  const query = new ListRevealedPredictionsByFieldQuery({
    fieldId: PREDICTION_FIELD_ID,
    userIdList: [PREDICTION_USER_ID],
  });

  it('lists the predictions of the players once the field is locked', async () => {
    const { handler, predictionRepository } = given(false);
    await expect(handler.execute(query)).resolves.toHaveLength(1);
    expect(predictionRepository.listByField).toHaveBeenCalledWith(
      PREDICTION_FIELD_ID,
      [PREDICTION_USER_ID],
    );
  });

  it('keeps them hidden while the field is open', async () => {
    const { handler, predictionRepository } = given(true);
    await expect(handler.execute(query)).rejects.toThrow(
      PredictionsHiddenError,
    );
    expect(predictionRepository.listByField).not.toHaveBeenCalled();
  });
});
