interface LoadingSpinnerProps {
  label?: string;
}

export default function LoadingSpinner({ label = "Cargando..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 min-h-[40vh]">
      <div
        className="h-10 w-10 border-2 border-red border-t-transparent rounded-full animate-spin"
        aria-hidden
      />
      <p className="mt-4 text-stone text-sm tracking-wider">{label}</p>
    </div>
  );
}
