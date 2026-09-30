import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { Query } from './Query';

@Injectable()
export class EnhancedQueryBus {
  constructor(private readonly _queryBus: QueryBus) {}

  async execute<X>(query: Query<X>): Promise<X> {
    return this._queryBus.execute(query);
  }
}
