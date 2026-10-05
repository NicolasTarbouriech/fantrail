import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { Spinner } from '@trail/shared/design/ui-react';

import { paths } from '../app/paths';
import { useRequireAuthQuery } from '../services/graphql';
import { CurrentPlayerContext } from './CurrentPlayer';

export function RequireAuth() {
  const location = useLocation();
  const { data, loading } = useRequireAuthQuery({ fetchPolicy: 'cache-first' });

  if (loading && !data) {
    return <Spinner />;
  }
  if (!data?.me) {
    const next = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={`${paths.login}?suite=${encodeURIComponent(next)}`}
        replace
      />
    );
  }
  return (
    <CurrentPlayerContext.Provider value={data.me}>
      <Outlet />
    </CurrentPlayerContext.Provider>
  );
}
