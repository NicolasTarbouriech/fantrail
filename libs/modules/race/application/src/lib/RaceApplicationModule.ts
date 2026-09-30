import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { RaceInfrastructureModule } from '@trail/modules/race/infrastructure';

import { commandHandlerList } from './commands/commandHandlerList';
import { queryHandlerList } from './queries/queryHandlerList';

@Module({
  imports: [CqrsModule, RaceInfrastructureModule.register()],
  providers: [...commandHandlerList, ...queryHandlerList],
})
export class RaceApplicationModule {}
