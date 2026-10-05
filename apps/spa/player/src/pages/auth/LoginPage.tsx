import { type FormEvent, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';

import { formatCountdown, getNextLockAt } from '@trail/modules-frontend';
import {
  Button,
  Heading,
  Sticker,
  TextField,
} from '@trail/shared/design/ui-react';

import { paths } from '../../app/paths';
import { useAuthActions } from '../../auth/useAuthActions';
import { getErrorMessage } from '../../services/errors';
import { useLoginPageQuery, useRequireAuthQuery } from '../../services/graphql';
import { AuthLayout } from './AuthLayout';

function useNextRaceSticker(): string | null {
  const { data } = useLoginPageQuery();
  const now = new Date();
  const next = (data?.races ?? [])
    .map((race) => ({ name: race.name, lockAt: getNextLockAt(race) }))
    .filter(
      (race): race is { name: string; lockAt: string } => race.lockAt !== null,
    )
    .sort((a, b) => a.lockAt.localeCompare(b.lockAt))[0];
  return next
    ? `${next.name} : départ dans ${formatCountdown(next.lockAt, now)}`
    : null;
}

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('suite') ?? paths.home;
  const { data: meData } = useRequireAuthQuery({ fetchPolicy: 'cache-first' });
  const { login, isSubmitting } = useAuthActions();
  const sticker = useNextRaceSticker();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (meData?.me) {
    return <Navigate to={next} replace />;
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await login(email.trim(), password);
      navigate(next, { replace: true });
    } catch (caught) {
      setError(getErrorMessage(caught));
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-start gap-3">
        <Heading level={1}>Content de te revoir</Heading>
        {sticker ? <Sticker>{sticker}</Sticker> : null}
      </div>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <TextField
          id="login-email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          id="login-password"
          label="Mot de passe"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={error}
        />
        <Button
          type="submit"
          variant="cta"
          size="lg"
          block
          disabled={isSubmitting}
        >
          Se connecter
        </Button>
      </form>
      <p className="m-0 text-center text-sm">
        Pas encore de compte ?{' '}
        <Link
          to={`${paths.register}?suite=${encodeURIComponent(next)}`}
          className="text-primary font-bold"
        >
          Crée-le en 30 secondes
        </Link>
      </p>
    </AuthLayout>
  );
}
