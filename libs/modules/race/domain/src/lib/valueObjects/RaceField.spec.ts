import { Gender } from '../enums';
import { FieldLockBeforeStartError, FieldLockedError } from '../errors';
import { MEN_FIELD_ID, buildField, buildFieldData } from '../testing';
import { RaceField } from './RaceField';

describe('RaceField', () => {
  const beforeLock = new Date('2026-10-14T10:00:00Z');
  const afterLock = new Date('2026-10-15T18:00:00Z');

  it('rejects a lock after the start', () => {
    expect(() =>
      RaceField.create(
        MEN_FIELD_ID,
        buildFieldData({ lockAt: new Date('2026-10-15T19:00:00Z') }),
      ),
    ).toThrow(FieldLockBeforeStartError);
  });

  it('is locked from the lock time or once locked by hand', () => {
    const field = buildField();
    expect(field.isLockedAt(beforeLock)).toBe(false);
    expect(field.isLockedAt(afterLock)).toBe(true);
    expect(field.lock(beforeLock).isLockedAt(beforeLock)).toBe(true);
    expect(() => field.assertNotLockedAt(afterLock)).toThrow(FieldLockedError);
  });

  it('keeps the first manual lock date', () => {
    const locked = buildField().lock(beforeLock);
    expect(locked.lock(afterLock)).toBe(locked);
  });

  it('exposes its schedule and gender', () => {
    const field = buildField({ data: { gender: Gender.Women } });
    expect(field.gender).toBe(Gender.Women);
    expect(field.startAt).toEqual(new Date('2026-10-15T18:00:00Z'));
    expect(field.lockAt).toEqual(new Date('2026-10-15T18:00:00Z'));
  });

  it('updates its schedule before the lock only', () => {
    const lockAt = new Date('2026-10-15T17:00:00Z');
    expect(
      buildField().update(buildFieldData({ lockAt }), beforeLock).lockAt,
    ).toEqual(lockAt);
    expect(() => buildField().update(buildFieldData(), afterLock)).toThrow(
      FieldLockedError,
    );
  });
});
