import { CommandHandler } from '@nestjs/cqrs';

import { UserAggregate, UserRepository } from '@trail/modules/user/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { DisableUserCommand } from './DisableUserCommand';

@CommandHandler(DisableUserCommand)
export class DisableUserCommandHandler implements IEnhancedCommandHandler<DisableUserCommand> {
  private readonly _logger = new MonitoringLogger(
    DisableUserCommandHandler.name,
  );

  constructor(private readonly _userRepository: UserRepository) {}

  async execute({ input }: DisableUserCommand): Promise<UserAggregate> {
    const user = await this._userRepository.getById(input.userId);
    user.disable(new Date());
    const saved = await this._userRepository.save(user);
    this._logger.info('User disabled', { userId: user.id });
    return saved;
  }
}
