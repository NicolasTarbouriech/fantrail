import { AggregateRoot } from '@nestjs/cqrs';

import { toNameKey } from '@trail/shared/tooling/util-text';

import { LeagueRaceAssertion } from '../assertions';
import { LeagueVisibility } from '../enums';
import {
  InvalidInviteCodeError,
  LeagueAlreadyJoinedError,
  LeagueForbiddenError,
  LeagueMemberNotFoundError,
  LeagueNotVisibleError,
  LeagueOwnerCannotLeaveError,
} from '../errors';
import { InviteCodeGenerator } from '../services';
import {
  InviteCode,
  LeagueActor,
  LeagueId,
  LeagueName,
  RaceId,
  UserId,
} from '../types';
import { LeagueMember } from '../valueObjects';

export class LeagueAggregate extends AggregateRoot {
  constructor(
    public readonly id: LeagueId,
    private _name: LeagueName,
    private _visibility: LeagueVisibility,
    public readonly ownerId: UserId,
    private _inviteCode: InviteCode,
    private _memberList: LeagueMember[],
    public readonly createdAt: Date,
    private _raceIdList: RaceId[],
  ) {
    super();
  }

  static nameKey(name: LeagueName): string {
    return toNameKey(name);
  }

  get name(): LeagueName {
    return this._name;
  }

  get visibility(): LeagueVisibility {
    return this._visibility;
  }

  get isPublic(): boolean {
    return this._visibility === LeagueVisibility.Public;
  }

  get inviteCode(): InviteCode {
    return this._inviteCode;
  }

  get memberList(): LeagueMember[] {
    return this._memberList;
  }

  get raceIdList(): RaceId[] {
    return this._raceIdList;
  }

  includesRace(raceId: RaceId): boolean {
    return this._raceIdList.includes(raceId);
  }

  get memberIdList(): UserId[] {
    return this._memberList.map(({ userId }) => userId);
  }

  hasMember(userId: UserId): boolean {
    return this._memberList.some((member) => member.userId === userId);
  }

  isOwner(userId: UserId): boolean {
    return this.ownerId === userId;
  }

  // Only members see the code to share it; anyone holding it can join.
  inviteCodeFor(actor: LeagueActor): InviteCode | null {
    return actor.isAdmin || this.hasMember(actor.userId)
      ? this._inviteCode
      : null;
  }

  // Public leagues show to every player, private ones to their members only. Admins moderate both.
  assertViewableBy(actor: LeagueActor): void {
    if (!this.isPublic && !actor.isAdmin && !this.hasMember(actor.userId)) {
      throw new LeagueNotVisibleError();
    }
  }

  join(
    userId: UserId,
    now: Date,
    inviteCode: InviteCode | null = null,
  ): LeagueMember {
    if (this.hasMember(userId)) {
      throw new LeagueAlreadyJoinedError();
    }
    if (!this.isPublic && inviteCode !== this._inviteCode) {
      throw new InvalidInviteCodeError();
    }
    const member = new LeagueMember(userId, now);
    this._memberList = [...this._memberList, member];
    return member;
  }

  leave(userId: UserId): void {
    if (this.isOwner(userId)) {
      throw new LeagueOwnerCannotLeaveError();
    }
    this._removeMember(userId);
  }

  removeMember(actor: LeagueActor, userId: UserId): void {
    this._assertModerator(actor);
    if (this.isOwner(userId)) {
      throw new LeagueOwnerCannotLeaveError();
    }
    this._removeMember(userId);
  }

  rename(actor: LeagueActor, name: LeagueName): void {
    this._assertModerator(actor);
    this._name = LeagueName.parse(name);
  }

  changeVisibility(actor: LeagueActor, visibility: LeagueVisibility): void {
    this._assertOwner(actor);
    this._visibility = visibility;
  }

  changeRaces(
    actor: LeagueActor,
    raceIdList: RaceId[],
    availableRaceIdList: RaceId[],
  ): void {
    this._assertModerator(actor);
    this._raceIdList = LeagueRaceAssertion.assertSelection(
      raceIdList,
      availableRaceIdList,
    );
  }

  regenerateInviteCode(actor: LeagueActor): InviteCode {
    this._assertOwner(actor);
    this._inviteCode = InviteCodeGenerator.generate();
    return this._inviteCode;
  }

  assertDeletableBy(actor: LeagueActor): void {
    this._assertModerator(actor);
  }

  private _assertOwner(actor: LeagueActor): void {
    if (!this.isOwner(actor.userId)) {
      throw new LeagueForbiddenError();
    }
  }

  private _assertModerator(actor: LeagueActor): void {
    if (!actor.isAdmin && !this.isOwner(actor.userId)) {
      throw new LeagueForbiddenError();
    }
  }

  private _removeMember(userId: UserId): void {
    if (!this.hasMember(userId)) {
      throw new LeagueMemberNotFoundError();
    }
    this._memberList = this._memberList.filter(
      (member) => member.userId !== userId,
    );
  }
}
