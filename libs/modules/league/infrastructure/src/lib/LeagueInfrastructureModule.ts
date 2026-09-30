import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LeagueRepository } from '@trail/modules/league/domain';
import {
  LeagueEntity,
  LeagueMemberEntity,
} from '@trail/shared/database/data-access-main';

import { TypeormLeagueRepository } from './repositories/TypeormLeagueRepository';

const repositoryList = [
  { provide: LeagueRepository, useClass: TypeormLeagueRepository },
];

@Module({})
export class LeagueInfrastructureModule {
  static register(): DynamicModule {
    return {
      module: LeagueInfrastructureModule,
      imports: [
        CqrsModule,
        TypeOrmModule.forFeature([LeagueEntity, LeagueMemberEntity]),
      ],
      providers: repositoryList,
      exports: repositoryList,
    };
  }
}
