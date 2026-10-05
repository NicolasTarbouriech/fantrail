export type SpinnerProps = {
  label?: string;
};

export function Spinner({ label = 'Chargement' }: SpinnerProps) {
  return (
    <div role="status" className="flex items-center justify-center p-8">
      <span className="border-line border-t-primary size-8 animate-spin rounded-full border-4" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
