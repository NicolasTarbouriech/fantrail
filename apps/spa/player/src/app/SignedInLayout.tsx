import { Outlet } from 'react-router-dom';

import { getInitial } from '@trail/modules-frontend';
import { PlayerLayout } from '@trail/shell/fantrail';

import { useCurrentPlayer } from '../auth/CurrentPlayer';
import { tabPaths } from './paths';

export function SignedInLayout() {
  const player = useCurrentPlayer();
  return (
    <PlayerLayout initial={getInitial(player.pseudo)} paths={tabPaths}>
      <Outlet />
    </PlayerLayout>
  );
}
