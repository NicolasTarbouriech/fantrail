export interface LoggerContext {
  userId?: string;
  raceId?: string;
  fieldId?: string;
  leagueId?: string;
  data?: Record<string, unknown>;
  error?: unknown;
}

export interface ErrorLoggerContext extends LoggerContext {
  error: unknown;
}
