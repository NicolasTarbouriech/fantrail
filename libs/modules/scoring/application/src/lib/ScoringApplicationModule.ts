import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ScoringInfrastructureModule } from '@trail/modules/scoring/infrastructure';

import { ComputeFieldScoresCommandHandler } from './commands/ComputeFieldScoresCommandHandler';
import { GetLeaderboardQueryHandler } from './queries/GetLeaderboardQueryHandler';
import { GetPlayerFieldScoreQueryHandler } from './queries/GetPlayerFieldScoreQueryHandler';
import { ListFieldScoresQueryHandler } from './queries/ListFieldScoresQueryHandler';
import { ScoringSagas } from './sagas/ScoringSagas';

@Module({
  imports: [CqrsModule, ScoringInfrastructureModule.register()],
  providers: [
    ComputeFieldScoresCommandHandler,
    GetLeaderboardQueryHandler,
    GetPlayerFieldScoreQueryHandler,
    ListFieldScoresQueryHandler,
    ScoringSagas,
  ],
})
export class ScoringApplicationModule {}
