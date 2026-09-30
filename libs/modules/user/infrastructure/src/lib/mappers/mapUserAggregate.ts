import { z } from 'zod';

import { UserAggregate, UserRole } from '@trail/modules/user/domain';
import { UserEntity } from '@trail/shared/database/data-access-main';

export function mapUserAggregate(entity: UserEntity): UserAggregate {
  return new UserAggregate(
    entity.id,
    entity.email,
    entity.pseudo,
    z.nativeEnum(UserRole).parse(entity.role),
    entity.password_hash,
    entity.disabled_at,
    entity.created_at,
  );
}
