import { IQueryHandler } from '@nestjs/cqrs';

import { Query } from './Query';

export type IEnhancedQueryHandler<QueryType extends Query<unknown>> =
  QueryType extends Query<infer ResultType>
    ? IQueryHandler<QueryType, ResultType>
    : never;
