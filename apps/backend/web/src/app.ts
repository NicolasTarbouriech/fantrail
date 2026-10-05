import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';

export function configure(app: NestExpressApplication): void {
  app.use(cookieParser());
  // A 100 KB event logo weighs about 140 KB once base64-encoded, above the 100 KB default.
  app.useBodyParser('json', { limit: '512kb' });
  app.enableShutdownHooks();
}
