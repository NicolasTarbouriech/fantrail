export type PasswordRule = {
  label: string;
  isMet: boolean;
};

export function getPasswordRules(password: string): PasswordRule[] {
  return [
    { label: '8 caractères', isMet: password.length >= 8 },
    { label: 'une lettre', isMet: /\p{L}/u.test(password) },
    { label: 'un chiffre', isMet: /\p{N}/u.test(password) },
    { label: 'un caractère spécial', isMet: /[^\p{L}\p{N}\s]/u.test(password) },
  ];
}

export function isPasswordValid(password: string): boolean {
  return getPasswordRules(password).every((rule) => rule.isMet);
}

export function getPseudoError(pseudo: string): string | null {
  const trimmed = pseudo.trim();
  if (trimmed.length < 3 || trimmed.length > 20) {
    return 'Entre 3 et 20 caractères.';
  }
  return /^[\p{L}\p{N}_.\- ]+$/u.test(trimmed)
    ? null
    : 'Lettres, chiffres, espaces, points, tirets et soulignés seulement.';
}

export function getInitial(pseudo: string): string {
  return pseudo.trim().charAt(0).toUpperCase() || '?';
}
