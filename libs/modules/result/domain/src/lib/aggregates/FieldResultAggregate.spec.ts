import { ZodError } from 'zod';

import {
  DuplicateRankedRunnerError,
  FieldResultNotPublishedError,
  RankedRunnerMarkedDnfError,
  ResultFieldNotLockedError,
  ResultRunnerNotInFieldError,
} from '../errors';
import { FieldResultPublishedNestEvent, ResultEventName } from '../events';
import {
  RESULT_FIELD_ID,
  buildFieldResultAggregate,
  buildFieldResultData,
  buildResultField,
  buildResultRunnerId,
} from '../testing';

const r = buildResultRunnerId;
const NOW = new Date('2026-10-17T08:00:00Z');

describe('FieldResultAggregate', () => {
  it('publishes a first version and emits an event', () => {
    const result = buildFieldResultAggregate();
    expect(result.isPublished).toBe(false);
    expect(() => result.data).toThrow(FieldResultNotPublishedError);
    result.publishResult(buildFieldResultData(), buildResultField(), NOW);
    expect(result).toMatchObject({
      version: 1,
      isPublished: true,
      publishedAt: NOW,
    });
    expect(result.data.rankingList).toHaveLength(10);
    const [event] = result.getUncommittedEvents();
    expect(event).toBeInstanceOf(FieldResultPublishedNestEvent);
    expect(event).toMatchObject({
      event: {
        name: ResultEventName.FieldResultPublished,
        timestamp: NOW.getTime(),
        payload: { fieldId: RESULT_FIELD_ID, version: 1 },
      },
    });
  });

  it('adds a version on correction', () => {
    const result = buildFieldResultAggregate({
      version: 1,
      data: buildFieldResultData(),
      publishedAt: NOW,
    });
    result.publishResult(
      buildFieldResultData({ rankingList: [r(2), r(1)] }),
      buildResultField(),
      NOW,
    );
    expect(result.version).toBe(2);
    expect(result.data.rankingList).toEqual([r(2), r(1)]);
  });

  it('waits for the field to lock', () => {
    expect(() =>
      buildFieldResultAggregate().publishResult(
        buildFieldResultData(),
        buildResultField({ isLocked: false }),
        NOW,
      ),
    ).toThrow(ResultFieldNotLockedError);
  });

  it.each([
    [
      buildFieldResultData({ rankingList: [r(1), r(1)] }),
      DuplicateRankedRunnerError,
    ],
    [
      buildFieldResultData({ rankingList: [r(99)] }),
      ResultRunnerNotInFieldError,
    ],
    [
      buildFieldResultData({ dnfRunnerIdList: [r(99)] }),
      ResultRunnerNotInFieldError,
    ],
    [
      buildFieldResultData({ dnfRunnerIdList: [r(1)] }),
      RankedRunnerMarkedDnfError,
    ],
    [
      buildFieldResultData({
        rankingList: Array.from({ length: 11 }, (_, index) => r(index + 1)),
      }),
      ZodError,
    ],
  ])('rejects an inconsistent result %#', (data, errorClass) => {
    expect(() =>
      buildFieldResultAggregate().publishResult(data, buildResultField(), NOW),
    ).toThrow(errorClass);
  });

  it('exposes the field context', () => {
    expect(buildResultField().fieldId).toBe(RESULT_FIELD_ID);
  });
});
