import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { GetStartListQuery } from '@trail/modules/race/application';
import { GetFieldResultQuery } from '@trail/modules/result/application';
import { EnhancedQueryBus } from '@trail/shared/cqrs/util-nestjs';

import { FieldResultType } from '../../result/types/FieldResultType';
import { RaceFieldType } from '../types/RaceFieldType';
import { StartListType } from '../types/StartListType';

@Resolver(() => RaceFieldType)
export class RaceFieldResolver {
  constructor(private readonly _queryBus: EnhancedQueryBus) {}

  @ResolveField(() => StartListType)
  async startList(@Parent() field: RaceFieldType): Promise<StartListType> {
    return new StartListType(
      await this._queryBus.execute(
        new GetStartListQuery({ fieldId: field.id }),
      ),
    );
  }

  @ResolveField(() => FieldResultType, {
    nullable: true,
    description: 'Null until the result is published',
  })
  async result(
    @Parent() field: RaceFieldType,
  ): Promise<FieldResultType | null> {
    const result = await this._queryBus.execute(
      new GetFieldResultQuery({ fieldId: field.id }),
    );
    return result.isPublished ? new FieldResultType(result) : null;
  }
}
