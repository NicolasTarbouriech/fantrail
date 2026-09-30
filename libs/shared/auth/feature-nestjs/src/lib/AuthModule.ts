import { DynamicModule, Module } from '@nestjs/common';

import { SessionCookie } from './SessionCookie';
import { SessionToken } from './SessionToken';
import { AuthConfig, AuthConfigParams } from './config/AuthConfig';

@Module({})
export class AuthModule {
  static register(config: AuthConfigParams): DynamicModule {
    return {
      global: true,
      module: AuthModule,
      providers: [
        { provide: AuthConfig, useValue: new AuthConfig(config) },
        SessionToken,
        SessionCookie,
      ],
      exports: [AuthConfig, SessionToken, SessionCookie],
    };
  }
}
