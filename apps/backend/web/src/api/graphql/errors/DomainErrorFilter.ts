import { ArgumentsHost, Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { ZodError } from 'zod';

import {
  DomainError,
  NotFoundDomainError,
} from '@trail/shared/tooling/util-error';

@Catch(DomainError, ZodError)
export class DomainErrorFilter implements GqlExceptionFilter {
  catch(exception: DomainError | ZodError, host: ArgumentsHost): GraphQLError {
    if (host.getType<string>() !== 'graphql') {
      throw exception;
    }
    if (exception instanceof ZodError) {
      return new GraphQLError('Invalid input', {
        extensions: { code: 'BAD_USER_INPUT', issues: exception.issues },
      });
    }
    return new GraphQLError(exception.message, {
      extensions: {
        code: exception.code,
        kind:
          exception instanceof NotFoundDomainError
            ? 'NOT_FOUND'
            : 'BUSINESS_RULE',
      },
    });
  }
}
