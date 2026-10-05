import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  RaceRepository,
  StartListRepository,
  TrailEventRepository,
} from '@trail/modules/race/domain';
import {
  RaceEntity,
  RaceFieldEntity,
  RunnerEntity,
  TrailEventEntity,
} from '@trail/shared/database/data-access-main';

import { TypeormRaceRepository } from './repositories/TypeormRaceRepository';
import { TypeormStartListRepository } from './repositories/TypeormStartListRepository';
import { TypeormTrailEventRepository } from './repositories/TypeormTrailEventRepository';

const repositoryList = [
  { provide: RaceRepository, useClass: TypeormRaceRepository },
  { provide: StartListRepository, useClass: TypeormStartListRepository },
  { provide: TrailEventRepository, useClass: TypeormTrailEventRepository },
];

@Module({})
export class RaceInfrastructureModule {
  static register(): DynamicModule {
    return {
      module: RaceInfrastructureModule,
      imports: [
        CqrsModule,
        TypeOrmModule.forFeature([
          RaceEntity,
          RaceFieldEntity,
          RunnerEntity,
          TrailEventEntity,
        ]),
      ],
      providers: repositoryList,
      exports: repositoryList,
    };
  }
}
