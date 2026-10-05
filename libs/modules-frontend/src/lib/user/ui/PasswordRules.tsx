import { CheckIcon, cx } from '@trail/shared/design/ui-react';

import { getPasswordRules } from '../mappers';

export type PasswordRulesProps = {
  id: string;
  password: string;
};

export function PasswordRules({ id, password }: PasswordRulesProps) {
  return (
    <ul id={id} className="m-0 flex list-none flex-wrap gap-1.5 p-0">
      {getPasswordRules(password).map((rule) => (
        <li
          key={rule.label}
          className={cx(
            'flex items-center gap-1 rounded-full border-2 px-2 py-0.5 text-xs font-semibold',
            rule.isMet
              ? 'border-ink bg-primary text-white'
              : 'border-line-strong text-muted bg-white',
          )}
        >
          {rule.isMet ? <CheckIcon size={12} /> : null}
          {rule.label}
        </li>
      ))}
    </ul>
  );
}
