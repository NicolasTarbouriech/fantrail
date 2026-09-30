import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  FieldScoreRepository,
  FieldScoringSourceRepository,
} from '@trail/modules/scoring/domain';
import { FieldScoreEntity } from '@trail/shared/database/data-access-main';

import { QueryBusFieldScoringSourceRepository } from './repositories/QueryBusFieldScoringSourceRepository';
import { TypeormFieldScoreRepository } from './repositories/TypeormFieldScoreRepository';

const repositoryList = [
  { provide: FieldScoreRepository, useClass: TypeormFieldScoreRepository },
  {
    provide: FieldScoringSourceRepository,
    useClass: QueryBusFieldScoringSourceRepository,
  },
];

@Module({})
export class ScoringInfrastructureModule {
  static register(): DynamicModule {
    return {
      module: ScoringInfrastructureModule,
      imports: [TypeOrmModule.forFeature([FieldScoreEntity])],
      providers: repositoryList,
      exports: repositoryList,
    };
  }
}
