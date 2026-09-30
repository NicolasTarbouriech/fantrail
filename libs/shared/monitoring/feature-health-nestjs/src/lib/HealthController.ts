import { Controller, Get, Inject } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

import { HEALTH_CONFIG, HealthConfig } from './HealthConfig';

@Controller()
export class HealthController {
  constructor(
    @Inject(HEALTH_CONFIG) private readonly _config: HealthConfig,
    private readonly _healthCheckService: HealthCheckService,
    private readonly _database: TypeOrmHealthIndicator,
  ) {}

  @Get(['/health', '/health/liveness'])
  root(): { name: string; commit: string } {
    return { name: this._config.name, commit: this._config.commit };
  }

  @Get('/health/readiness')
  @HealthCheck()
  readiness(): Promise<HealthCheckResult> {
    return this._healthCheckService.check(
      this._config.database
        ? [() => this._database.pingCheck('database', { timeout: 2000 })]
        : [],
    );
  }
}
