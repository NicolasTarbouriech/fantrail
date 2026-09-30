import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { PredictionInfrastructureModule } from '@trail/modules/prediction/infrastructure';

import { SavePredictionCommandHandler } from './commands/SavePredictionCommandHandler';
import { queryHandlerList } from './queries/queryHandlerList';

@Module({
  imports: [CqrsModule, PredictionInfrastructureModule.register()],
  providers: [SavePredictionCommandHandler, ...queryHandlerList],
})
export class PredictionApplicationModule {}
