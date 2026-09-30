import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';

import {
  RegisterUserCommand,
  VerifyUserCredentialsQuery,
} from '@trail/modules/user/application';
import { UserAggregate } from '@trail/modules/user/domain';
import { SessionCookie, SessionToken } from '@trail/shared/auth/feature-nestjs';
import {
  EnhancedCommandBus,
  EnhancedQueryBus,
} from '@trail/shared/cqrs/util-nestjs';

import { User } from '../../../../../services/auth/decorators/User';
import { AuthGuard } from '../../../../../services/auth/guards/AuthGuard';
import { AuthNotMandatory } from '../../../../../services/auth/guards/AuthNotMandatory';
import { GqlThrottlerGuard } from '../../../../../services/auth/guards/GqlThrottlerGuard';
import { RegisterInput } from '../inputs/RegisterInput';
import { MeType } from '../types/MeType';

const AUTH_THROTTLE = { default: { limit: 10, ttl: 60000 } };

@Resolver(() => MeType)
export class AuthResolver {
  constructor(
    private readonly _commandBus: EnhancedCommandBus,
    private readonly _queryBus: EnhancedQueryBus,
    private readonly _sessionToken: SessionToken,
    private readonly _sessionCookie: SessionCookie,
  ) {}

  @Query(() => MeType, { nullable: true })
  @UseGuards(AuthGuard)
  @AuthNotMandatory()
  me(@User() user: UserAggregate | undefined): MeType | null {
    return user ? new MeType(user) : null;
  }

  @Mutation(() => MeType)
  @UseGuards(GqlThrottlerGuard)
  @Throttle(AUTH_THROTTLE)
  async register(
    @Args('data', { type: () => RegisterInput }) data: RegisterInput,
    @Context('res') res: Response,
  ): Promise<MeType> {
    const user = await this._commandBus.execute(new RegisterUserCommand(data));
    this._sessionCookie.set(res, await this._sessionToken.sign(user.id));
    return new MeType(user);
  }

  @Mutation(() => MeType)
  @UseGuards(GqlThrottlerGuard)
  @Throttle(AUTH_THROTTLE)
  async login(
    @Args('email', { type: () => String }) email: string,
    @Args('password', { type: () => String }) password: string,
    @Context('res') res: Response,
  ): Promise<MeType> {
    const user = await this._queryBus.execute(
      new VerifyUserCredentialsQuery({ email, password }),
    );
    this._sessionCookie.set(res, await this._sessionToken.sign(user.id));
    return new MeType(user);
  }

  @Mutation(() => Boolean)
  logout(@Context('res') res: Response): boolean {
    this._sessionCookie.clear(res);
    return true;
  }
}
