import { createContext, useContext } from 'react';

import type { RequireAuthQuery } from '../services/graphql';

export type CurrentPlayer = NonNullable<RequireAuthQuery['me']>;

export const CurrentPlayerContext = createContext<CurrentPlayer | null>(null);

export function useCurrentPlayer(): CurrentPlayer {
  const player = useContext(CurrentPlayerContext);
  if (!player) {
    throw new Error('useCurrentPlayer must be used under RequireAuth');
  }
  return player;
}
