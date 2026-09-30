import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { Command } from './Command';

@Injectable()
export class EnhancedCommandBus {
  constructor(private readonly _commandBus: CommandBus) {}

  async execute<X>(command: Command<X>): Promise<X> {
    return this._commandBus.execute(command);
  }
}
