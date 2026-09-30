import { CommandHandler } from '@nestjs/cqrs';

import {
  FieldResultAggregate,
  FieldResultRepository,
  ResultFieldRepository,
} from '@trail/modules/result/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { PublishFieldResultCommand } from './PublishFieldResultCommand';

@CommandHandler(PublishFieldResultCommand)
export class PublishFieldResultCommandHandler implements IEnhancedCommandHandler<PublishFieldResultCommand> {
  private readonly _logger = new MonitoringLogger(
    PublishFieldResultCommandHandler.name,
  );

  constructor(
    private readonly _fieldResultRepository: FieldResultRepository,
    private readonly _resultFieldRepository: ResultFieldRepository,
  ) {}

  async execute({
    input,
  }: PublishFieldResultCommand): Promise<FieldResultAggregate> {
    const field = await this._resultFieldRepository.getByFieldId(input.fieldId);
    const result = await this._fieldResultRepository.getByFieldId(
      input.fieldId,
    );
    result.publishResult(input.data, field, new Date());
    const saved = await this._fieldResultRepository.save(result);
    result.commit();
    this._logger.info('Field result published', {
      fieldId: input.fieldId,
      data: { version: saved.version },
    });
    return saved;
  }
}
