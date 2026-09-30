import {
  FieldResultPublishedNestEvent,
  FieldResultRepository,
  ResultFieldNotLockedError,
  ResultFieldRepository,
} from '@trail/modules/result/domain';
import {
  RESULT_FIELD_ID,
  buildFieldResultAggregate,
  buildFieldResultData,
  buildResultField,
} from '@trail/modules/result/domain-testing';

import { PublishFieldResultCommand } from './PublishFieldResultCommand';
import { PublishFieldResultCommandHandler } from './PublishFieldResultCommandHandler';

describe('PublishFieldResultCommandHandler', () => {
  function given(isLocked: boolean) {
    const result = buildFieldResultAggregate();
    const commit = jest.spyOn(result, 'commit').mockImplementation();
    const fieldResultRepository = {
      getByFieldId: jest.fn().mockResolvedValue(result),
      save: jest.fn((aggregate) => Promise.resolve(aggregate)),
    } as unknown as FieldResultRepository;
    const resultFieldRepository = {
      getByFieldId: jest.fn().mockResolvedValue(buildResultField({ isLocked })),
    } as unknown as ResultFieldRepository;
    return {
      result,
      commit,
      fieldResultRepository,
      handler: new PublishFieldResultCommandHandler(
        fieldResultRepository,
        resultFieldRepository,
      ),
    };
  }
  const command = new PublishFieldResultCommand({
    fieldId: RESULT_FIELD_ID,
    data: buildFieldResultData(),
  });

  it('saves the new version, then publishes the event', async () => {
    const { handler, result, commit, fieldResultRepository } = given(true);
    const saved = await handler.execute(command);
    expect(saved.version).toBe(1);
    expect(fieldResultRepository.save).toHaveBeenCalledWith(result);
    expect(result.getUncommittedEvents()).toEqual([
      expect.any(FieldResultPublishedNestEvent),
    ]);
    expect(commit).toHaveBeenCalled();
  });

  it('publishes nothing before the field locks', async () => {
    const { handler, commit, fieldResultRepository } = given(false);
    await expect(handler.execute(command)).rejects.toThrow(
      ResultFieldNotLockedError,
    );
    expect(fieldResultRepository.save).not.toHaveBeenCalled();
    expect(commit).not.toHaveBeenCalled();
  });
});
