import { DynamicModule, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HEALTH_CONFIG, HealthConfig } from './HealthConfig';
import { HealthController } from './HealthController';

@Module({})
export class HealthModule {
  static register(config: HealthConfig): DynamicModule {
    return {
      module: HealthModule,
      imports: [TerminusModule],
      controllers: [HealthController],
      providers: [{ provide: HEALTH_CONFIG, useValue: config }],
    };
  }
}
