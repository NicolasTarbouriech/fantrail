import { ZodError } from 'zod';

import { LeagueVisibility } from '../enums';
import {
  InvalidInviteCodeError,
  LeagueAlreadyJoinedError,
  LeagueForbiddenError,
  LeagueMemberNotFoundError,
  LeagueNotVisibleError,
  LeagueOwnerCannotLeaveError,
  LeagueRaceNotAvailableError,
  LeagueWithoutRaceError,
} from '../errors';
import {
  INVITE_CODE,
  LEAGUE_RACE_ID,
  OTHER_LEAGUE_RACE_ID,
  OWNER_ID,
  buildLeagueAggregate,
  buildLeagueUserId,
} from '../testing';
import { LeagueAggregate } from './LeagueAggregate';

const u = buildLeagueUserId;
const NOW = new Date('2026-10-05T10:00:00Z');
const owner = { userId: OWNER_ID, isAdmin: false };
const member = { userId: u(2), isAdmin: false };
const admin = { userId: u(9), isAdmin: true };

describe('LeagueAggregate', () => {
  it('exposes its data', () => {
    const league = buildLeagueAggregate({ memberIdList: [OWNER_ID, u(2)] });
    expect(league).toMatchObject({
      name: 'Les Chamois',
      visibility: LeagueVisibility.Private,
      isPublic: false,
      inviteCode: INVITE_CODE,
    });
    expect(league.memberIdList).toEqual([OWNER_ID, u(2)]);
    expect(league.memberList[1].joinedAt).toEqual(
      new Date('2026-10-01T10:00:00Z'),
    );
    expect(league.isOwner(OWNER_ID)).toBe(true);
  });

  it('derives the same name key regardless of case and accents', () => {
    expect(LeagueAggregate.nameKey('Les Chamois de l’Écrin')).toBe(
      LeagueAggregate.nameKey('les chamois de l’ecrin'),
    );
  });

  describe('join', () => {
    it('joins a public league in one click', () => {
      const league = buildLeagueAggregate({
        visibility: LeagueVisibility.Public,
      });
      expect(league.join(u(2), NOW)).toMatchObject({
        userId: u(2),
        joinedAt: NOW,
      });
      expect(() => league.join(u(2), NOW)).toThrow(LeagueAlreadyJoinedError);
    });

    it('needs the invite code of a private league', () => {
      const league = buildLeagueAggregate();
      expect(() => league.join(u(2), NOW)).toThrow(InvalidInviteCodeError);
      expect(() => league.join(u(2), NOW, 'WRONGCD2')).toThrow(
        InvalidInviteCodeError,
      );
      league.join(u(2), NOW, INVITE_CODE);
      expect(league.hasMember(u(2))).toBe(true);
    });
  });

  describe('leave and removeMember', () => {
    it('lets a member leave but not the owner', () => {
      const league = buildLeagueAggregate({ memberIdList: [OWNER_ID, u(2)] });
      expect(() => league.leave(OWNER_ID)).toThrow(LeagueOwnerCannotLeaveError);
      league.leave(u(2));
      expect(league.hasMember(u(2))).toBe(false);
      expect(() => league.leave(u(2))).toThrow(LeagueMemberNotFoundError);
    });

    it('lets the owner or an admin remove a member, never the owner', () => {
      const league = buildLeagueAggregate({
        memberIdList: [OWNER_ID, u(2), u(3)],
      });
      expect(() => league.removeMember(member, u(3))).toThrow(
        LeagueForbiddenError,
      );
      league.removeMember(owner, u(3));
      league.removeMember(admin, u(2));
      expect(league.memberIdList).toEqual([OWNER_ID]);
      expect(() => league.removeMember(admin, OWNER_ID)).toThrow(
        LeagueOwnerCannotLeaveError,
      );
    });
  });

  describe('management', () => {
    it('lets the owner or an admin rename and delete', () => {
      const league = buildLeagueAggregate({ memberIdList: [OWNER_ID, u(2)] });
      league.rename(owner, 'Les Bouquetins');
      league.rename(admin, 'Ligue renommée');
      expect(league.name).toBe('Ligue renommée');
      expect(() => league.rename(member, 'Pirates')).toThrow(
        LeagueForbiddenError,
      );
      expect(() => league.rename(owner, 'ab')).toThrow(ZodError);
      expect(() => league.assertDeletableBy(admin)).not.toThrow();
      expect(() => league.assertDeletableBy(member)).toThrow(
        LeagueForbiddenError,
      );
    });

    it('lets only the owner change the visibility and the invite code', () => {
      const league = buildLeagueAggregate();
      league.changeVisibility(owner, LeagueVisibility.Public);
      expect(league.isPublic).toBe(true);
      expect(() =>
        league.changeVisibility(admin, LeagueVisibility.Private),
      ).toThrow(LeagueForbiddenError);
      const inviteCode = league.regenerateInviteCode(owner);
      expect(inviteCode).toMatch(/^[A-HJ-NP-Z2-9]{8}$/);
      expect(league.inviteCode).toBe(inviteCode);
      expect(() => league.regenerateInviteCode(member)).toThrow(
        LeagueForbiddenError,
      );
    });
  });

  it('shows the invite code to members and admins only', () => {
    const league = buildLeagueAggregate({ memberIdList: [OWNER_ID, u(2)] });
    expect(league.inviteCodeFor(member)).toBe(INVITE_CODE);
    expect(league.inviteCodeFor(admin)).toBe(INVITE_CODE);
    expect(league.inviteCodeFor({ userId: u(5), isAdmin: false })).toBeNull();
  });

  describe('races', () => {
    const available = [LEAGUE_RACE_ID, OTHER_LEAGUE_RACE_ID];

    it('lists the races it covers', () => {
      const league = buildLeagueAggregate();
      expect(league.raceIdList).toEqual([LEAGUE_RACE_ID]);
      expect(league.includesRace(LEAGUE_RACE_ID)).toBe(true);
      expect(league.includesRace(OTHER_LEAGUE_RACE_ID)).toBe(false);
    });

    it('lets the owner or an admin change them', () => {
      const league = buildLeagueAggregate();
      league.changeRaces(
        owner,
        [OTHER_LEAGUE_RACE_ID, LEAGUE_RACE_ID, OTHER_LEAGUE_RACE_ID],
        available,
      );
      expect(league.raceIdList).toEqual([OTHER_LEAGUE_RACE_ID, LEAGUE_RACE_ID]);
      league.changeRaces(admin, [LEAGUE_RACE_ID], available);
      expect(league.raceIdList).toEqual([LEAGUE_RACE_ID]);
      expect(() => league.changeRaces(member, available, available)).toThrow(
        LeagueForbiddenError,
      );
    });

    it('drops a deleted race', () => {
      const league = buildLeagueAggregate();
      league.removeRace(LEAGUE_RACE_ID);
      expect(league.raceIdList).toEqual([]);
    });

    it('needs at least one available race', () => {
      const league = buildLeagueAggregate();
      expect(() => league.changeRaces(owner, [], available)).toThrow(
        LeagueWithoutRaceError,
      );
      expect(() =>
        league.changeRaces(owner, [OTHER_LEAGUE_RACE_ID], [LEAGUE_RACE_ID]),
      ).toThrow(LeagueRaceNotAvailableError);
    });
  });

  describe('assertViewableBy', () => {
    it('shows a private league to its members and admins only', () => {
      const league = buildLeagueAggregate({ memberIdList: [OWNER_ID, u(2)] });
      expect(() => league.assertViewableBy(member)).not.toThrow();
      expect(() => league.assertViewableBy(admin)).not.toThrow();
      expect(() =>
        league.assertViewableBy({ userId: u(5), isAdmin: false }),
      ).toThrow(LeagueNotVisibleError);
    });

    it('shows a public league to every player', () => {
      const league = buildLeagueAggregate({
        visibility: LeagueVisibility.Public,
      });
      expect(() =>
        league.assertViewableBy({ userId: u(5), isAdmin: false }),
      ).not.toThrow();
    });
  });
});
