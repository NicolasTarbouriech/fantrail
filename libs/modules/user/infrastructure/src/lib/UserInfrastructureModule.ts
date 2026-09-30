import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PasswordHasher, UserRepository } from '@trail/modules/user/domain';
import { UserEntity } from '@trail/shared/database/data-access-main';

import { BcryptPasswordHasher } from './repositories/BcryptPasswordHasher';
import { TypeormUserRepository } from './repositories/TypeormUserRepository';

const repositoryList = [
  { provide: UserRepository, useClass: TypeormUserRepository },
  { provide: PasswordHasher, useClass: BcryptPasswordHasher },
];

@Module({})
export class UserInfrastructureModule {
  static register(): DynamicModule {
    return {
      module: UserInfrastructureModule,
      imports: [CqrsModule, TypeOrmModule.forFeature([UserEntity])],
      providers: repositoryList,
      exports: repositoryList,
    };
  }
}
