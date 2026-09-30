import { AggregateRoot } from '@nestjs/cqrs';

import { toNameKey } from '@trail/shared/tooling/util-text';

import { UserRole } from '../enums';
import { UserDisabledError } from '../errors';
import { Email, Pseudo, UserId } from '../types';

export class UserAggregate extends AggregateRoot {
  constructor(
    public readonly id: UserId,
    private readonly _email: Email,
    private readonly _pseudo: Pseudo,
    private readonly _role: UserRole,
    private readonly _passwordHash: string,
    private _disabledAt: Date | null,
    public readonly createdAt: Date,
  ) {
    super();
  }

  static pseudoKey(pseudo: Pseudo): string {
    return toNameKey(pseudo);
  }

  get email(): Email {
    return this._email;
  }

  get pseudo(): Pseudo {
    return this._pseudo;
  }

  get role(): UserRole {
    return this._role;
  }

  get isAdmin(): boolean {
    return this._role === UserRole.Admin;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get disabledAt(): Date | null {
    return this._disabledAt;
  }

  get isDisabled(): boolean {
    return this._disabledAt !== null;
  }

  assertActive(): void {
    if (this.isDisabled) {
      throw new UserDisabledError();
    }
  }

  disable(now: Date): void {
    this._disabledAt = this._disabledAt ?? now;
  }

  enable(): void {
    this._disabledAt = null;
  }
}
