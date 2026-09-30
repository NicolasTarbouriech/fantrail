import { CommandHandler } from '@nestjs/cqrs';

import {
  PredictionAggregate,
  PredictionFieldRepository,
  PredictionRepository,
} from '@trail/modules/prediction/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { SavePredictionCommand } from './SavePredictionCommand';

@CommandHandler(SavePredictionCommand)
export class SavePredictionCommandHandler implements IEnhancedCommandHandler<SavePredictionCommand> {
  private readonly _logger = new MonitoringLogger(
    SavePredictionCommandHandler.name,
  );

  constructor(
    private readonly _predictionRepository: PredictionRepository,
    private readonly _predictionFieldRepository: PredictionFieldRepository,
  ) {}

  async execute({
    input,
  }: SavePredictionCommand): Promise<PredictionAggregate> {
    const field = await this._predictionFieldRepository.getByFieldId(
      input.fieldId,
    );
    field.assertOpen();
    const prediction =
      (await this._predictionRepository.findByUserAndField(
        input.userId,
        input.fieldId,
      )) ??
      (await this._predictionRepository.create({
        userId: input.userId,
        fieldId: input.fieldId,
        pickCount: field.pickCount,
      }));
    prediction.update(
      {
        pickList: input.pickList,
        winnerTimeEstimateInSeconds: input.winnerTimeEstimateInSeconds,
      },
      field,
      new Date(),
    );
    const saved = await this._predictionRepository.save(prediction);
    this._logger.info('Prediction saved', {
      userId: input.userId,
      fieldId: input.fieldId,
      data: { isComplete: saved.isComplete },
    });
    return saved;
  }
}
