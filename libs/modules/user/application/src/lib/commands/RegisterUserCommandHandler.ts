import { CommandHandler } from '@nestjs/cqrs';

import {
  PasswordHasher,
  UserAggregate,
  UserRepository,
} from '@trail/modules/user/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { RegisterUserCommand } from './RegisterUserCommand';

@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler implements IEnhancedCommandHandler<RegisterUserCommand> {
  private readonly _logger = new MonitoringLogger(
    RegisterUserCommandHandler.name,
  );

  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _passwordHasher: PasswordHasher,
  ) {}

  async execute({ input }: RegisterUserCommand): Promise<UserAggregate> {
    const passwordHash = await this._passwordHasher.hash(input.password);
    const user = await this._userRepository.create({
      email: input.email,
      pseudo: input.pseudo,
      passwordHash,
    });
    this._logger.info('User registered', { userId: user.id });
    return user;
  }
}
