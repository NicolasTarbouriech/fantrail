import { createContext, useContext } from 'react';

import type { RequireAdminQuery } from '../services/graphql';

export type CurrentAdmin = NonNullable<RequireAdminQuery['me']>;

export const CurrentAdminContext = createContext<CurrentAdmin | null>(null);

export function useCurrentAdmin(): CurrentAdmin {
  const admin = useContext(CurrentAdminContext);
  if (!admin) {
    throw new Error('useCurrentAdmin must be used under RequireAdmin');
  }
  return admin;
}
