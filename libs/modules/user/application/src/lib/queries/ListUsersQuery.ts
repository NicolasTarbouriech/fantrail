import { UserAggregate } from '@trail/modules/user/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export class ListUsersQuery extends Query<UserAggregate[]> {}
