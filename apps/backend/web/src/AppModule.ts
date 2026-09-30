import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerModule } from '@nestjs/throttler';

import { LeaderboardModule } from '@trail/apps/backend/web/leaderboard/feature-leaderboard';
import { LeagueApplicationModule } from '@trail/modules/league/application';
import { PredictionApplicationModule } from '@trail/modules/prediction/application';
import { RaceApplicationModule } from '@trail/modules/race/application';
import { ResultApplicationModule } from '@trail/modules/result/application';
import { ScoringApplicationModule } from '@trail/modules/scoring/application';
import { UserApplicationModule } from '@trail/modules/user/application';
import { AuthModule } from '@trail/shared/auth/feature-nestjs';
import { EnhancedCqrsModule } from '@trail/shared/cqrs/util-nestjs';
import { HealthModule } from '@trail/shared/monitoring/feature-health-nestjs';

import { GraphQLModule } from './api/graphql';
import { COMMIT } from './config/app';
import { readAuthConfig } from './config/auth';
import { DatabaseModule } from './database/DatabaseModule';

@Module({
  imports: [
    CqrsModule.forRoot(),
    EnhancedCqrsModule,
    DatabaseModule,
    AuthModule.register(readAuthConfig()),
    HealthModule.register({ name: 'api', commit: COMMIT, database: true }),
    ThrottlerModule.forRoot({
      throttlers: [{ name: 'default', ttl: 60000, limit: 300 }],
    }),
    GraphQLModule,
    RaceApplicationModule,
    UserApplicationModule,
    PredictionApplicationModule,
    ResultApplicationModule,
    ScoringApplicationModule,
    LeagueApplicationModule,
    LeaderboardModule,
  ],
})
export class AppModule {}
