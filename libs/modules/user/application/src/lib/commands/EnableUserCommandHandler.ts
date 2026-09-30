import { CommandHandler } from '@nestjs/cqrs';

import { UserAggregate, UserRepository } from '@trail/modules/user/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { EnableUserCommand } from './EnableUserCommand';

@CommandHandler(EnableUserCommand)
export class EnableUserCommandHandler implements IEnhancedCommandHandler<EnableUserCommand> {
  private readonly _logger = new MonitoringLogger(
    EnableUserCommandHandler.name,
  );

  constructor(private readonly _userRepository: UserRepository) {}

  async execute({ input }: EnableUserCommand): Promise<UserAggregate> {
    const user = await this._userRepository.getById(input.userId);
    user.enable();
    const saved = await this._userRepository.save(user);
    this._logger.info('User enabled', { userId: user.id });
    return saved;
  }
}
