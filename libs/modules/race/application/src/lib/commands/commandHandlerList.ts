import { AddFieldCommandHandler } from './AddFieldCommandHandler';
import { AddRunnerListCommandHandler } from './AddRunnerListCommandHandler';
import { CancelRaceCommandHandler } from './CancelRaceCommandHandler';
import { CreateRaceCommandHandler } from './CreateRaceCommandHandler';
import { DeleteRaceCommandHandler } from './DeleteRaceCommandHandler';
import { LockFieldCommandHandler } from './LockFieldCommandHandler';
import { LockRaceCommandHandler } from './LockRaceCommandHandler';
import { MarkRaceScoredCommandHandler } from './MarkRaceScoredCommandHandler';
import { OpenRaceCommandHandler } from './OpenRaceCommandHandler';
import { ReinstateRunnerCommandHandler } from './ReinstateRunnerCommandHandler';
import { UpdateFieldCommandHandler } from './UpdateFieldCommandHandler';
import { UpdateRaceCommandHandler } from './UpdateRaceCommandHandler';
import { UpdateRunnerCommandHandler } from './UpdateRunnerCommandHandler';
import { WithdrawRunnerCommandHandler } from './WithdrawRunnerCommandHandler';

export const commandHandlerList = [
  AddFieldCommandHandler,
  AddRunnerListCommandHandler,
  CancelRaceCommandHandler,
  CreateRaceCommandHandler,
  DeleteRaceCommandHandler,
  LockFieldCommandHandler,
  LockRaceCommandHandler,
  MarkRaceScoredCommandHandler,
  OpenRaceCommandHandler,
  ReinstateRunnerCommandHandler,
  UpdateFieldCommandHandler,
  UpdateRaceCommandHandler,
  UpdateRunnerCommandHandler,
  WithdrawRunnerCommandHandler,
];
