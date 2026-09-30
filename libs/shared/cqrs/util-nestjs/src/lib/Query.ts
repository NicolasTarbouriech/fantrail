import { IQuery } from '@nestjs/cqrs';

export class Query<T> implements IQuery {
  // Protected, not private: declaration files drop the type of private members, and with it the result type.
  protected readonly _resultType?: T;
}
