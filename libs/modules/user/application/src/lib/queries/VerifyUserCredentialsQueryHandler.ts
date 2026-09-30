import { QueryHandler } from '@nestjs/cqrs';

import {
  InvalidCredentialsError,
  PasswordHasher,
  UserAggregate,
  UserRepository,
} from '@trail/modules/user/domain';
import { IEnhancedQueryHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { VerifyUserCredentialsQuery } from './VerifyUserCredentialsQuery';

// Compared when the email is unknown, so that both failures take the same time.
const UNKNOWN_USER_HASH =
  '$2a$10$zjyXiqOJb94Co6pEi5.hvORoGWwxuwjSQXrC679y/NPwwPQXPdTTK';

@QueryHandler(VerifyUserCredentialsQuery)
export class VerifyUserCredentialsQueryHandler implements IEnhancedQueryHandler<VerifyUserCredentialsQuery> {
  private readonly _logger = new MonitoringLogger(
    VerifyUserCredentialsQueryHandler.name,
  );

  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _passwordHasher: PasswordHasher,
  ) {}

  async execute({ input }: VerifyUserCredentialsQuery): Promise<UserAggregate> {
    const user = await this._userRepository.findByEmail(input.email);
    const isValid = await this._passwordHasher.verify(
      input.password,
      user?.passwordHash ?? UNKNOWN_USER_HASH,
    );
    if (!user || !isValid) {
      this._logger.info('Invalid credentials', { userId: user?.id });
      throw new InvalidCredentialsError();
    }
    user.assertActive();
    return user;
  }
}
