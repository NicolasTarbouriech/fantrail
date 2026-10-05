import type { HTMLAttributes } from 'react';

import { cx } from './cx';

export type CardVariant = 'block' | 'flat' | 'dashed' | 'alert' | 'faded';

const VARIANT_CLASSES: Record<CardVariant, string> = {
  block: 'border-2 border-ink bg-white shadow-block',
  flat: 'border-2 border-ink bg-white',
  dashed: 'border-2 border-dashed border-faded',
  alert: 'border-2 border-dashed border-alert bg-alert-soft',
  faded: 'border-2 border-dashed border-muted bg-disabled',
};

export function cardClasses(variant: CardVariant = 'flat'): string {
  return cx('rounded-[14px]', VARIANT_CLASSES[variant]);
}

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
};

export function Card({ variant, className, ...props }: CardProps) {
  return <div className={cx(cardClasses(variant), className)} {...props} />;
}
