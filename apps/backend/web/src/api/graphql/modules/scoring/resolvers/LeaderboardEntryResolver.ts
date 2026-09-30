import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { UserDataLoader } from '../../../../../services/dataloader/UserDataLoader';
import { LeaderboardEntryType } from '../types/LeaderboardEntryType';
import { PlayerType } from '../types/PlayerType';

@Resolver(() => LeaderboardEntryType)
export class LeaderboardEntryResolver {
  constructor(private readonly _userDataLoader: UserDataLoader) {}

  @ResolveField(() => PlayerType)
  async player(@Parent() entry: LeaderboardEntryType): Promise<PlayerType> {
    return new PlayerType(await this._userDataLoader.loader.load(entry.userId));
  }
}
