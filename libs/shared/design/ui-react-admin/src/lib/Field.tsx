import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

import { cx } from '@trail/shared/design/ui-react';

const CONTROL_CLASSES =
  'w-full min-w-0 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 placeholder:text-zinc-400 focus:border-primary focus:outline-2 focus:outline-primary/20 disabled:bg-zinc-50 disabled:text-zinc-500';

export function adminControlClasses(): string {
  return CONTROL_CLASSES;
}

export type AdminFieldProps = {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function AdminField({
  id,
  label,
  hint,
  error,
  className,
  children,
}: AdminFieldProps) {
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-zinc-950">
        {label}
      </label>
      {children}
      {error ? (
        <span
          id={`${id}-error`}
          className="text-[13px] font-medium text-red-700"
        >
          {error}
        </span>
      ) : hint ? (
        <span id={`${id}-hint`} className="text-[13px] text-zinc-500">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

export function AdminInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(CONTROL_CLASSES, 'h-9', className)} {...props} />;
}

export function AdminSelect({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cx(CONTROL_CLASSES, 'h-9 pr-8', className)} {...props} />
  );
}

export function AdminTextarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cx(
        CONTROL_CLASSES,
        'min-h-28 py-2 font-mono text-[13px]',
        className,
      )}
      {...props}
    />
  );
}
