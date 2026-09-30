import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

import { HealthController } from './HealthController';

describe('HealthController', () => {
  const check = jest.fn().mockResolvedValue({ status: 'ok' });
  const pingCheck = jest.fn().mockResolvedValue({ database: { status: 'up' } });
  const healthCheckService = { check } as unknown as HealthCheckService;
  const database = { pingCheck } as unknown as TypeOrmHealthIndicator;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns the application name and commit', () => {
    const controller = new HealthController(
      { name: 'api', commit: 'abc', database: true },
      healthCheckService,
      database,
    );
    expect(controller.root()).toEqual({ name: 'api', commit: 'abc' });
  });

  it('pings the database on readiness when enabled', async () => {
    const controller = new HealthController(
      { name: 'api', commit: 'abc', database: true },
      healthCheckService,
      database,
    );
    await controller.readiness();
    const [indicatorList] = check.mock.calls[0];
    await indicatorList[0]();
    expect(pingCheck).toHaveBeenCalledWith('database', { timeout: 2000 });
  });

  it('checks nothing on readiness when the database is disabled', async () => {
    const controller = new HealthController(
      { name: 'api', commit: 'abc', database: false },
      healthCheckService,
      database,
    );
    await controller.readiness();
    expect(check).toHaveBeenCalledWith([]);
  });
});
