import { DomainError } from '@trail/shared/tooling/util-error';

export class TrailEventLogoInvalidError extends DomainError {
  constructor(reason: string) {
    super(`Invalid trail event logo: ${reason}`);
  }
}
