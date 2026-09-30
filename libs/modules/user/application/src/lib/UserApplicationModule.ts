import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { UserInfrastructureModule } from '@trail/modules/user/infrastructure';

import { commandHandlerList } from './commands/commandHandlerList';
import { queryHandlerList } from './queries/queryHandlerList';

@Module({
  imports: [CqrsModule, UserInfrastructureModule.register()],
  providers: [...commandHandlerList, ...queryHandlerList],
})
export class UserApplicationModule {}
