import { CommandHandler } from '@nestjs/cqrs';

import {
  FieldScoreRepository,
  FieldScoringCalculator,
  FieldScoringSourceRepository,
  PlayerFieldScore,
} from '@trail/modules/scoring/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { ComputeFieldScoresCommand } from './ComputeFieldScoresCommand';

@CommandHandler(ComputeFieldScoresCommand)
export class ComputeFieldScoresCommandHandler implements IEnhancedCommandHandler<ComputeFieldScoresCommand> {
  private readonly _logger = new MonitoringLogger(
    ComputeFieldScoresCommandHandler.name,
  );

  constructor(
    private readonly _fieldScoreRepository: FieldScoreRepository,
    private readonly _fieldScoringSourceRepository: FieldScoringSourceRepository,
  ) {}

  async execute({
    input,
  }: ComputeFieldScoresCommand): Promise<PlayerFieldScore[]> {
    const source = await this._fieldScoringSourceRepository.findByFieldId(
      input.fieldId,
    );
    if (!source) {
      this._logger.warn('No published result to score', {
        fieldId: input.fieldId,
      });
      return [];
    }
    const scoreList = FieldScoringCalculator.calculate(source);
    await this._fieldScoreRepository.replaceForField(input.fieldId, scoreList);
    this._logger.info('Field scored', {
      fieldId: input.fieldId,
      data: {
        resultVersion: source.resultVersion,
        scoredPlayerCount: scoreList.length,
      },
    });
    return scoreList;
  }
}
