import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { Request, Response } from 'express';

import { GRAPHQL_PLAYGROUND } from '../../config/app';
import { TrailEventDataLoader } from '../../services/dataloader/TrailEventDataLoader';
import { UserDataLoader } from '../../services/dataloader/UserDataLoader';
import { DomainErrorFilter } from './errors/DomainErrorFilter';
import { GraphQLErrorFilter } from './errors/GraphQLErrorFilter';
import { resolvers } from './resolvers';

@Module({
  imports: [
    NestGraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      // Field resolvers throw domain errors too: without this, the error filters skip them.
      fieldResolverEnhancers: ['filters'],
      playground: false,
      introspection: GRAPHQL_PLAYGROUND,
      includeStacktraceInErrorResponses: GRAPHQL_PLAYGROUND,
      plugins: GRAPHQL_PLAYGROUND
        ? [ApolloServerPluginLandingPageLocalDefault()]
        : [],
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
    }),
  ],
  providers: [
    ...resolvers,
    UserDataLoader,
    TrailEventDataLoader,
    { provide: APP_FILTER, useClass: DomainErrorFilter },
    { provide: APP_FILTER, useClass: GraphQLErrorFilter },
  ],
})
export class GraphQLModule {}
