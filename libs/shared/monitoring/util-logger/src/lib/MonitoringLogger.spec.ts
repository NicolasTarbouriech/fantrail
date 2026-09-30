import { Logger } from '@nestjs/common';

import { MonitoringLogger } from './MonitoringLogger';

describe('MonitoringLogger', () => {
  const logger = new MonitoringLogger('Spec');

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('prints business ids and data as key=value metadata', () => {
    const log = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    logger.info('Race created', { raceId: 'race-1', data: { pickCount: 5 } });
    expect(log).toHaveBeenCalledWith(
      'Race created raceId="race-1" pickCount=5',
    );
  });

  it('prints the message alone without context', () => {
    const debug = jest.spyOn(Logger.prototype, 'debug').mockImplementation();
    const warn = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    logger.debug('Debug');
    logger.warn('Warn', {});
    expect(debug).toHaveBeenCalledWith('Debug');
    expect(warn).toHaveBeenCalledWith('Warn');
  });

  it('prints the error message and passes the stack', () => {
    const error = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const failure = new Error('boom');
    logger.error('Scoring failed', { fieldId: 'field-1', error: failure });
    expect(error).toHaveBeenCalledWith(
      'Scoring failed fieldId="field-1" error="boom"',
      failure.stack,
    );
    logger.error('Unknown failure', { error: 'raw' });
    expect(error).toHaveBeenLastCalledWith('Unknown failure', undefined);
  });
});
