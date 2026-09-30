import {
  DuplicateRankedRunnerError,
  RankedRunnerMarkedDnfError,
  ResultRunnerNotInFieldError,
} from '../errors';
import { FieldResultData } from '../types';
import { ResultField } from '../valueObjects';

export class FieldResultAssertion {
  static assert(data: FieldResultData, field: ResultField): void {
    const rankedIdSet = new Set<string>();
    for (const runnerId of data.rankingList) {
      if (rankedIdSet.has(runnerId)) {
        throw new DuplicateRankedRunnerError(runnerId);
      }
      rankedIdSet.add(runnerId);
    }
    for (const runnerId of [...data.rankingList, ...data.dnfRunnerIdList]) {
      if (!field.hasRunner(runnerId)) {
        throw new ResultRunnerNotInFieldError(runnerId);
      }
    }
    const rankedDnf = data.dnfRunnerIdList.find((runnerId) =>
      rankedIdSet.has(runnerId),
    );
    if (rankedDnf) {
      throw new RankedRunnerMarkedDnfError(rankedDnf);
    }
  }
}
