import { UserAggregate } from '../aggregates';
import { CreateUserData, Email, UserId } from '../types';

export abstract class UserRepository {
  abstract getById(id: UserId): Promise<UserAggregate>;
  abstract findByEmail(email: Email): Promise<UserAggregate | null>;
  abstract list(): Promise<UserAggregate[]>;
  abstract listByIdList(idList: UserId[]): Promise<UserAggregate[]>;
  abstract create(data: CreateUserData): Promise<UserAggregate>;
  abstract save(user: UserAggregate): Promise<UserAggregate>;
}
