import {
  PredictionFieldRepository,
  PredictionRepository,
} from '@trail/modules/prediction/domain';
import {
  PREDICTION_FIELD_ID,
  PREDICTION_USER_ID,
  buildPredictionAggregate,
  buildPredictionField,
} from '@trail/modules/prediction/domain-testing';

import { GetPredictionFieldQuery } from './GetPredictionFieldQuery';
import { GetPredictionFieldQueryHandler } from './GetPredictionFieldQueryHandler';
import { GetPredictionQuery } from './GetPredictionQuery';
import { GetPredictionQueryHandler } from './GetPredictionQueryHandler';
import { ListPredictionsByFieldQuery } from './ListPredictionsByFieldQuery';
import { ListPredictionsByFieldQueryHandler } from './ListPredictionsByFieldQueryHandler';
import { ListPredictionsByUserQuery } from './ListPredictionsByUserQuery';
import { ListPredictionsByUserQueryHandler } from './ListPredictionsByUserQueryHandler';

describe('prediction query handlers', () => {
  const prediction = buildPredictionAggregate();
  const field = buildPredictionField();
  const predictionRepository = {
    findByUserAndField: jest.fn().mockResolvedValue(prediction),
    listByUser: jest.fn().mockResolvedValue([prediction]),
    listByField: jest.fn().mockResolvedValue([prediction]),
  } as unknown as PredictionRepository;
  const predictionFieldRepository = {
    getByFieldId: jest.fn().mockResolvedValue(field),
  } as unknown as PredictionFieldRepository;

  it('GetPredictionQueryHandler reads the prediction of a user on a field', async () => {
    await expect(
      new GetPredictionQueryHandler(predictionRepository).execute(
        new GetPredictionQuery({
          userId: PREDICTION_USER_ID,
          fieldId: PREDICTION_FIELD_ID,
        }),
      ),
    ).resolves.toBe(prediction);
  });

  it('ListPredictionsByUserQueryHandler lists the predictions of a user', async () => {
    await expect(
      new ListPredictionsByUserQueryHandler(predictionRepository).execute(
        new ListPredictionsByUserQuery({ userId: PREDICTION_USER_ID }),
      ),
    ).resolves.toEqual([prediction]);
  });

  it('ListPredictionsByFieldQueryHandler lists the predictions of some users on a field', async () => {
    await new ListPredictionsByFieldQueryHandler(predictionRepository).execute(
      new ListPredictionsByFieldQuery({
        fieldId: PREDICTION_FIELD_ID,
        userIdList: [PREDICTION_USER_ID],
      }),
    );
    expect(predictionRepository.listByField).toHaveBeenCalledWith(
      PREDICTION_FIELD_ID,
      [PREDICTION_USER_ID],
    );
  });

  it('GetPredictionFieldQueryHandler reads the field context', async () => {
    await expect(
      new GetPredictionFieldQueryHandler(predictionFieldRepository).execute(
        new GetPredictionFieldQuery({ fieldId: PREDICTION_FIELD_ID }),
      ),
    ).resolves.toBe(field);
  });
});
