export const HEALTH_CONFIG = Symbol('HEALTH_CONFIG');

export interface HealthConfig {
  name: string;
  commit: string;
  database: boolean;
}
