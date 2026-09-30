import { ArgumentsHost, Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { ThrottlerException } from '@nestjs/throttler';
import { GraphQLError } from 'graphql';

// Expected refusals (authentication, authorization, rate limit) go back to the client without an error log.
@Catch(GraphQLError, ThrottlerException)
export class GraphQLErrorFilter implements GqlExceptionFilter {
  catch(
    exception: GraphQLError | ThrottlerException,
    host: ArgumentsHost,
  ): GraphQLError {
    if (host.getType<string>() !== 'graphql') {
      throw exception;
    }
    if (exception instanceof ThrottlerException) {
      return new GraphQLError('Too many requests, retry in a minute', {
        extensions: { code: 'TOO_MANY_REQUESTS' },
      });
    }
    return exception;
  }
}
