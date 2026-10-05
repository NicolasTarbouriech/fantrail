import { Link } from 'react-router-dom';

import {
  ChevronLeftIcon,
  iconButtonClasses,
} from '@trail/shared/design/ui-react';

export type BackLinkProps = {
  to: string;
  label: string;
};

export function BackLink({ to, label }: BackLinkProps) {
  return (
    <Link to={to} aria-label={label} className={iconButtonClasses()}>
      <ChevronLeftIcon />
    </Link>
  );
}
