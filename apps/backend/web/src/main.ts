import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { AppModule } from './AppModule';
import { configure } from './app';
import { CORS_ORIGIN_LIST, PORT } from './config/app';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: { origin: CORS_ORIGIN_LIST, credentials: true },
  });
  configure(app);
  await app.listen(PORT);
  new MonitoringLogger('bootstrap').info('API listening', {
    data: { port: PORT },
  });
}

bootstrap();
