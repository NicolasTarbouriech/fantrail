import { ICommandHandler } from '@nestjs/cqrs';

import { Command } from './Command';

export type IEnhancedCommandHandler<CommandType extends Command<unknown>> =
  CommandType extends Command<infer ResultType>
    ? ICommandHandler<CommandType, ResultType>
    : never;
