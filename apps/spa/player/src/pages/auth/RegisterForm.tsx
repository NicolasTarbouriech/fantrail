import { type FormEvent, useState } from 'react';

import {
  PasswordRules,
  getPseudoError,
  isPasswordValid,
} from '@trail/modules-frontend';
import { Button, TextField } from '@trail/shared/design/ui-react';

import { useAuthActions } from '../../auth/useAuthActions';
import { getErrorCode, getErrorMessage } from '../../services/errors';

export type RegisterFormProps = {
  submitLabel: string;
  onRegistered: () => Promise<void> | void;
};

export function RegisterForm({ submitLabel, onRegistered }: RegisterFormProps) {
  const { register, isSubmitting } = useAuthActions();
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pseudoError, setPseudoError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const localPseudoError = getPseudoError(pseudo);
    setPseudoError(localPseudoError);
    setEmailError(null);
    setFormError(null);
    if (localPseudoError || !isPasswordValid(password)) {
      return;
    }
    try {
      await register({ pseudo: pseudo.trim(), email: email.trim(), password });
      await onRegistered();
    } catch (caught) {
      const code = getErrorCode(caught);
      if (code === 'PSEUDO_ALREADY_USED') {
        setPseudoError(getErrorMessage(caught));
      } else if (code === 'EMAIL_ALREADY_USED') {
        setEmailError(getErrorMessage(caught));
      } else {
        setFormError(getErrorMessage(caught));
      }
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <TextField
        id="register-pseudo"
        label="Pseudo"
        autoComplete="nickname"
        required
        maxLength={20}
        value={pseudo}
        onChange={(event) => setPseudo(event.target.value)}
        hint="C’est lui qui apparaît dans les classements"
        error={pseudoError}
      />
      <TextField
        id="register-email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={emailError}
      />
      <div className="flex flex-col gap-2">
        <TextField
          id="register-password"
          label="Mot de passe"
          type="password"
          autoComplete="new-password"
          required
          aria-describedby="register-password-rules"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <PasswordRules id="register-password-rules" password={password} />
      </div>
      {formError ? (
        <p role="alert" className="text-alert m-0 text-sm font-semibold">
          {formError}
        </p>
      ) : null}
      <Button
        type="submit"
        variant="cta"
        size="lg"
        block
        disabled={isSubmitting || !isPasswordValid(password)}
      >
        {submitLabel}
      </Button>
    </form>
  );
}
