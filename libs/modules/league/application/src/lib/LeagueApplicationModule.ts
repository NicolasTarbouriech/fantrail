import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { LeagueInfrastructureModule } from '@trail/modules/league/infrastructure';

import { commandHandlerList } from './commands/commandHandlerList';
import { queryHandlerList } from './queries/queryHandlerList';
import { LeagueSagas } from './sagas';

@Module({
  imports: [CqrsModule, LeagueInfrastructureModule.register()],
  providers: [...commandHandlerList, ...queryHandlerList, LeagueSagas],
})
export class LeagueApplicationModule {}
