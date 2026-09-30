import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  protected override getRequestResponse(context: ExecutionContext): {
    req: Request;
    res: Response;
  } {
    const { req, res } = GqlExecutionContext.create(context).getContext<{
      req: Request;
      res: Response;
    }>();
    return { req, res };
  }
}
