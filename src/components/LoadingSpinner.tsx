interface LoadingSpinnerProps {
  label?: string;
}

export default function LoadingSpinner({ label = "Cargando..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 min-h-[40vh]">
      <div
        className="h-6 w-6 border border-white-broken/30 border-t-white-broken/60 rounded-full animate-spin"
        aria-hidden
      />
      <p className="mt-6 text-grey-muted text-sm">{label}</p>
    </div>
  );
}
