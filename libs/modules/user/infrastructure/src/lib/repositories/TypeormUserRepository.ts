import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import {
  CreateUserData,
  Email,
  EmailAlreadyUsedError,
  PseudoAlreadyUsedError,
  UserAggregate,
  UserId,
  UserNotFoundError,
  UserRepository,
  UserRole,
} from '@trail/modules/user/domain';
import {
  USER_EMAIL_UNIQUE_INDEX,
  USER_PSEUDO_KEY_UNIQUE_INDEX,
  UserEntity,
  isUniqueViolation,
} from '@trail/shared/database/data-access-main';

import { mapUserAggregate } from '../mappers/mapUserAggregate';

@Injectable()
export class TypeormUserRepository extends UserRepository {
  constructor(
    private readonly _publisher: EventPublisher,
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {
    super();
  }

  async getById(id: UserId): Promise<UserAggregate> {
    const entity = await this._userRepository.findOne({ where: { id } });
    if (!entity) {
      throw new UserNotFoundError();
    }
    return this._mapEntity(entity);
  }

  async findByEmail(email: Email): Promise<UserAggregate | null> {
    const entity = await this._userRepository.findOne({
      where: { email: Email.parse(email) },
    });
    return entity ? this._mapEntity(entity) : null;
  }

  async list(): Promise<UserAggregate[]> {
    const entityList = await this._userRepository.find({
      order: { created_at: 'ASC' },
    });
    return entityList.map((entity) => this._mapEntity(entity));
  }

  async listByIdList(idList: UserId[]): Promise<UserAggregate[]> {
    if (idList.length === 0) {
      return [];
    }
    const entityList = await this._userRepository.find({
      where: { id: In(idList) },
    });
    return entityList.map((entity) => this._mapEntity(entity));
  }

  async create(data: CreateUserData): Promise<UserAggregate> {
    const parsed = CreateUserData.parse(data);
    try {
      const entity = await this._userRepository.save(
        this._userRepository.create({
          email: parsed.email,
          pseudo: parsed.pseudo,
          pseudo_key: UserAggregate.pseudoKey(parsed.pseudo),
          password_hash: parsed.passwordHash,
          role: UserRole.Player,
          disabled_at: null,
        }),
      );
      return this.getById(entity.id);
    } catch (error) {
      if (isUniqueViolation(error, USER_EMAIL_UNIQUE_INDEX)) {
        throw new EmailAlreadyUsedError();
      }
      if (isUniqueViolation(error, USER_PSEUDO_KEY_UNIQUE_INDEX)) {
        throw new PseudoAlreadyUsedError();
      }
      throw error;
    }
  }

  async save(user: UserAggregate): Promise<UserAggregate> {
    await this._userRepository.update(
      { id: user.id },
      { disabled_at: user.disabledAt },
    );
    return this.getById(user.id);
  }

  private _mapEntity(entity: UserEntity): UserAggregate {
    const aggregate = mapUserAggregate(entity);
    this._publisher.mergeObjectContext(aggregate);
    return aggregate;
  }
}
