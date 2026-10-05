import { useApolloClient } from '@apollo/client';
import { type FormEvent, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';

import { UserRole } from '@trail/shared/apps/backend/web/data-access-graphql-types';
import {
  AdminButton,
  AdminField,
  AdminInput,
  AdminNotice,
} from '@trail/shared/design/ui-react-admin';

import { paths } from '../../app/paths';
import { getErrorMessage } from '../../services/errors';
import {
  RequireAdminDocument,
  useLoginPageMutateLoginMutation,
  useRequireAdminQuery,
} from '../../services/graphql';

export function LoginPage() {
  const client = useApolloClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('suite') ?? paths.races;
  const { data } = useRequireAdminQuery({ fetchPolicy: 'cache-first' });
  const [login, loginState] = useLoginPageMutateLoginMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (data?.me?.role === UserRole.Admin) {
    return <Navigate to={next} replace />;
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const result = await login({
        variables: { email: email.trim(), password },
      });
      const me = result.data?.login ?? null;
      client.writeQuery({ query: RequireAdminDocument, data: { me } });
      if (me?.role !== UserRole.Admin) {
        setError('Ce compte n’a pas accès à l’administration.');
        return;
      }
      navigate(next, { replace: true });
    } catch (caught) {
      setError(getErrorMessage(caught));
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-zinc-50 p-6">
      <form
        onSubmit={submit}
        className="flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <span className="font-display text-primary text-[28px] font-black tracking-[0.04em]">
            FANTRAIL
          </span>
          <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs font-semibold text-zinc-600">
            Admin
          </span>
        </div>
        <AdminField id="login-email" label="Email">
          <AdminInput
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </AdminField>
        <AdminField id="login-password" label="Mot de passe">
          <AdminInput
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </AdminField>
        {error ? <AdminNotice tone="danger">{error}</AdminNotice> : null}
        <AdminButton
          type="submit"
          variant="primary"
          disabled={loginState.loading}
          className="justify-center"
        >
          Se connecter
        </AdminButton>
      </form>
    </main>
  );
}
