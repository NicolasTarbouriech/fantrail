import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  RaceRepository,
  StartListRepository,
} from '@trail/modules/race/domain';
import {
  RaceEntity,
  RaceFieldEntity,
  RunnerEntity,
} from '@trail/shared/database/data-access-main';

import { TypeormRaceRepository } from './repositories/TypeormRaceRepository';
import { TypeormStartListRepository } from './repositories/TypeormStartListRepository';

const repositoryList = [
  { provide: RaceRepository, useClass: TypeormRaceRepository },
  { provide: StartListRepository, useClass: TypeormStartListRepository },
];

@Module({})
export class RaceInfrastructureModule {
  static register(): DynamicModule {
    return {
      module: RaceInfrastructureModule,
      imports: [
        CqrsModule,
        TypeOrmModule.forFeature([RaceEntity, RaceFieldEntity, RunnerEntity]),
      ],
      providers: repositoryList,
      exports: repositoryList,
    };
  }
}
