import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  FieldResultRepository,
  ResultFieldRepository,
} from '@trail/modules/result/domain';
import { FieldResultEntity } from '@trail/shared/database/data-access-main';

import { QueryBusResultFieldRepository } from './repositories/QueryBusResultFieldRepository';
import { TypeormFieldResultRepository } from './repositories/TypeormFieldResultRepository';

const repositoryList = [
  { provide: FieldResultRepository, useClass: TypeormFieldResultRepository },
  { provide: ResultFieldRepository, useClass: QueryBusResultFieldRepository },
];

@Module({})
export class ResultInfrastructureModule {
  static register(): DynamicModule {
    return {
      module: ResultInfrastructureModule,
      imports: [CqrsModule, TypeOrmModule.forFeature([FieldResultEntity])],
      providers: repositoryList,
      exports: repositoryList,
    };
  }
}
