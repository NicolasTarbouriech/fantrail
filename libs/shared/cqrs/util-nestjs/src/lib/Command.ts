import { ICommand } from '@nestjs/cqrs';

export class Command<T> implements ICommand {
  // Protected, not private: declaration files drop the type of private members, and with it the result type.
  protected readonly _resultType?: T;
}
