import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';

import { Heading } from '@trail/shared/design/ui-react';

import { paths } from '../../app/paths';
import { useRequireAuthQuery } from '../../services/graphql';
import { AuthLayout } from './AuthLayout';
import { RegisterForm } from './RegisterForm';

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('suite') ?? paths.home;
  const { data } = useRequireAuthQuery({ fetchPolicy: 'cache-first' });

  if (data?.me) {
    return <Navigate to={next} replace />;
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-2">
        <Heading level={1}>Crée ton compte</Heading>
        <p className="text-muted m-0 text-[15px]">
          Pronostique le top 5 et le chrono du vainqueur sur chaque course,
          classe-toi parmi tous les joueurs, et défie tes potes dans des ligues
          si tu veux.
        </p>
      </div>
      <RegisterForm
        submitLabel="Créer mon compte"
        onRegistered={() => navigate(next, { replace: true })}
      />
      <p className="m-0 text-center text-sm">
        Déjà un compte ?{' '}
        <Link
          to={`${paths.login}?suite=${encodeURIComponent(next)}`}
          className="text-primary font-bold"
        >
          Connecte-toi
        </Link>
      </p>
    </AuthLayout>
  );
}
