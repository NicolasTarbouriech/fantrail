import { registerEnumType } from '@nestjs/graphql';

import { UserRole } from '@trail/modules/user/domain';

registerEnumType(UserRole, { name: 'UserRole' });

export { UserRole as UserRoleEnumType };
