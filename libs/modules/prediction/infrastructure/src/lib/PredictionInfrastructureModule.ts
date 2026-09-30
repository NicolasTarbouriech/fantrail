import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  PredictionFieldRepository,
  PredictionRepository,
} from '@trail/modules/prediction/domain';
import { PredictionEntity } from '@trail/shared/database/data-access-main';

import { QueryBusPredictionFieldRepository } from './repositories/QueryBusPredictionFieldRepository';
import { TypeormPredictionRepository } from './repositories/TypeormPredictionRepository';

const repositoryList = [
  { provide: PredictionRepository, useClass: TypeormPredictionRepository },
  {
    provide: PredictionFieldRepository,
    useClass: QueryBusPredictionFieldRepository,
  },
];

@Module({})
export class PredictionInfrastructureModule {
  static register(): DynamicModule {
    return {
      module: PredictionInfrastructureModule,
      imports: [CqrsModule, TypeOrmModule.forFeature([PredictionEntity])],
      providers: repositoryList,
      exports: repositoryList,
    };
  }
}
