import { ChangeLeagueVisibilityCommandHandler } from './ChangeLeagueVisibilityCommandHandler';
import { CreateLeagueCommandHandler } from './CreateLeagueCommandHandler';
import { DeleteLeagueCommandHandler } from './DeleteLeagueCommandHandler';
import { JoinLeagueByInviteCodeCommandHandler } from './JoinLeagueByInviteCodeCommandHandler';
import { JoinLeagueCommandHandler } from './JoinLeagueCommandHandler';
import { LeaveLeagueCommandHandler } from './LeaveLeagueCommandHandler';
import { RegenerateLeagueInviteCodeCommandHandler } from './RegenerateLeagueInviteCodeCommandHandler';
import { RemoveLeagueMemberCommandHandler } from './RemoveLeagueMemberCommandHandler';
import { RenameLeagueCommandHandler } from './RenameLeagueCommandHandler';

export const commandHandlerList = [
  ChangeLeagueVisibilityCommandHandler,
  CreateLeagueCommandHandler,
  DeleteLeagueCommandHandler,
  JoinLeagueByInviteCodeCommandHandler,
  JoinLeagueCommandHandler,
  LeaveLeagueCommandHandler,
  RegenerateLeagueInviteCodeCommandHandler,
  RemoveLeagueMemberCommandHandler,
  RenameLeagueCommandHandler,
];
