import { CommandHandler } from '@nestjs/cqrs';

import {
  InvalidInviteCodeError,
  LeagueAggregate,
  LeagueRepository,
} from '@trail/modules/league/domain';
import { IEnhancedCommandHandler } from '@trail/shared/cqrs/util-nestjs';
import { MonitoringLogger } from '@trail/shared/monitoring/util-logger';

import { JoinLeagueByInviteCodeCommand } from './JoinLeagueByInviteCodeCommand';

@CommandHandler(JoinLeagueByInviteCodeCommand)
export class JoinLeagueByInviteCodeCommandHandler implements IEnhancedCommandHandler<JoinLeagueByInviteCodeCommand> {
  private readonly _logger = new MonitoringLogger(
    JoinLeagueByInviteCodeCommandHandler.name,
  );

  constructor(private readonly _leagueRepository: LeagueRepository) {}

  async execute({
    input,
  }: JoinLeagueByInviteCodeCommand): Promise<LeagueAggregate> {
    const league = await this._leagueRepository.findByInviteCode(
      input.inviteCode,
    );
    if (!league) {
      throw new InvalidInviteCodeError();
    }
    league.join(input.userId, new Date(), input.inviteCode);
    const saved = await this._leagueRepository.save(league);
    this._logger.info('League joined with invite code', {
      leagueId: league.id,
      userId: input.userId,
    });
    return saved;
  }
}
