import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { UserRole } from '@trail/shared/apps/backend/web/data-access-graphql-types';
import { Spinner } from '@trail/shared/design/ui-react';

import { paths } from '../app/paths';
import { useRequireAdminQuery } from '../services/graphql';
import { CurrentAdminContext } from './CurrentAdmin';

export function RequireAdmin() {
  const location = useLocation();
  const { data, loading } = useRequireAdminQuery({
    fetchPolicy: 'cache-first',
  });

  if (loading && !data) {
    return <Spinner />;
  }
  if (!data?.me || data.me.role !== UserRole.Admin) {
    const next = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={`${paths.login}?suite=${encodeURIComponent(next)}`}
        replace
      />
    );
  }
  return (
    <CurrentAdminContext.Provider value={data.me}>
      <Outlet />
    </CurrentAdminContext.Provider>
  );
}
