import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';

export function configure(app: INestApplication): void {
  app.use(cookieParser());
  app.enableShutdownHooks();
}
