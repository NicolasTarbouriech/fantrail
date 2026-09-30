import { EventPublisher } from '@nestjs/cqrs';
import { QueryFailedError, Repository } from 'typeorm';

import {
  EmailAlreadyUsedError,
  PseudoAlreadyUsedError,
  UserNotFoundError,
} from '@trail/modules/user/domain';
import { USER_ID } from '@trail/modules/user/domain-testing';
import { UserEntity } from '@trail/shared/database/data-access-main';

import { TypeormUserRepository } from './TypeormUserRepository';

const ENTITY: UserEntity = {
  id: USER_ID,
  email: 'kilian@example.com',
  pseudo: 'Kilian',
  pseudo_key: 'kilian',
  password_hash: 'hash',
  role: 'player',
  disabled_at: null,
  created_at: new Date('2026-10-01T10:00:00Z'),
  updated_at: new Date('2026-10-01T10:00:00Z'),
};

const uniqueViolation = (constraint: string): QueryFailedError =>
  new QueryFailedError(
    'INSERT',
    [],
    Object.assign(new Error('duplicate'), { code: '23505', constraint }),
  );

describe('TypeormUserRepository', () => {
  let userRepository: Repository<UserEntity>;
  let repository: TypeormUserRepository;

  beforeEach(() => {
    userRepository = {
      findOne: jest.fn().mockResolvedValue(ENTITY),
      find: jest.fn().mockResolvedValue([ENTITY]),
      create: jest.fn((value) => value),
      save: jest.fn((value) => Promise.resolve({ ...value, id: USER_ID })),
      update: jest.fn().mockResolvedValue(undefined),
    } as unknown as Repository<UserEntity>;
    const publisher = {
      mergeObjectContext: jest.fn((aggregate) => aggregate),
    } as unknown as EventPublisher;
    repository = new TypeormUserRepository(publisher, userRepository);
  });

  it('gets a user by id or throws', async () => {
    expect((await repository.getById(USER_ID)).pseudo).toBe('Kilian');
    jest.mocked(userRepository.findOne).mockResolvedValueOnce(null);
    await expect(repository.getById(USER_ID)).rejects.toThrow(
      UserNotFoundError,
    );
  });

  it('finds a user by normalized email, or null', async () => {
    await repository.findByEmail('  Kilian@Example.com');
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'kilian@example.com' },
    });
    jest.mocked(userRepository.findOne).mockResolvedValueOnce(null);
    await expect(
      repository.findByEmail('nobody@example.com'),
    ).resolves.toBeNull();
  });

  it('lists users, and none for an empty id list', async () => {
    expect(await repository.list()).toHaveLength(1);
    expect(await repository.listByIdList([USER_ID])).toHaveLength(1);
    expect(await repository.listByIdList([])).toEqual([]);
  });

  it('creates a player with a pseudo key', async () => {
    await repository.create({
      email: 'kilian@example.com',
      pseudo: 'Kïlian',
      passwordHash: 'hash',
    });
    expect(userRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        pseudo: 'Kïlian',
        pseudo_key: 'kilian',
        role: 'player',
      }),
    );
  });

  it.each([
    ['UQ_users_email', EmailAlreadyUsedError],
    ['UQ_users_pseudo_key', PseudoAlreadyUsedError],
  ])(
    'maps a violation of %s to a domain error',
    async (constraint, errorClass) => {
      jest
        .mocked(userRepository.save)
        .mockRejectedValueOnce(uniqueViolation(constraint));
      await expect(
        repository.create({
          email: 'kilian@example.com',
          pseudo: 'Kilian',
          passwordHash: 'hash',
        }),
      ).rejects.toThrow(errorClass);
    },
  );

  it('rethrows other errors', async () => {
    jest
      .mocked(userRepository.save)
      .mockRejectedValueOnce(new Error('connection lost'));
    await expect(
      repository.create({
        email: 'kilian@example.com',
        pseudo: 'Kilian',
        passwordHash: 'hash',
      }),
    ).rejects.toThrow('connection lost');
  });

  it('saves the disabled state', async () => {
    const user = await repository.getById(USER_ID);
    user.disable(new Date('2026-10-10T10:00:00Z'));
    await repository.save(user);
    expect(userRepository.update).toHaveBeenCalledWith(
      { id: USER_ID },
      { disabled_at: new Date('2026-10-10T10:00:00Z') },
    );
  });
});
