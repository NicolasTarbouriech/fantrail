import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ResultInfrastructureModule } from '@trail/modules/result/infrastructure';

import { PublishFieldResultCommandHandler } from './commands/PublishFieldResultCommandHandler';
import { GetFieldResultQueryHandler } from './queries/GetFieldResultQueryHandler';
import { ListFieldResultsQueryHandler } from './queries/ListFieldResultsQueryHandler';

@Module({
  imports: [CqrsModule, ResultInfrastructureModule.register()],
  providers: [
    PublishFieldResultCommandHandler,
    GetFieldResultQueryHandler,
    ListFieldResultsQueryHandler,
  ],
})
export class ResultApplicationModule {}
