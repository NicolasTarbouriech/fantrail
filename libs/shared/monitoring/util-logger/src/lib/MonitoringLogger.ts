import { Logger } from '@nestjs/common';

import { ErrorLoggerContext, LoggerContext } from './LoggerContext';

export class MonitoringLogger {
  private readonly _logger: Logger;

  constructor(public readonly context: string) {
    this._logger = new Logger(context);
  }

  debug(message: string, context?: LoggerContext): void {
    this._logger.debug(this._format(message, context));
  }

  info(message: string, context?: LoggerContext): void {
    this._logger.log(this._format(message, context));
  }

  warn(message: string, context?: LoggerContext): void {
    this._logger.warn(this._format(message, context));
  }

  error(message: string, context: ErrorLoggerContext): void {
    const stack =
      context.error instanceof Error ? context.error.stack : undefined;
    this._logger.error(this._format(message, context), stack);
  }

  private _format(message: string, context?: LoggerContext): string {
    if (!context) {
      return message;
    }
    const { error, data, ...ids } = context;
    const metadata = Object.entries({ ...ids, ...data })
      .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
      .join(' ');
    const errorMessage =
      error instanceof Error ? ` error=${JSON.stringify(error.message)}` : '';
    return `${message}${metadata ? ` ${metadata}` : ''}${errorMessage}`;
  }
}
