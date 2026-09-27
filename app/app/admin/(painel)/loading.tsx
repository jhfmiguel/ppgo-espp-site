export default function AdminLoading() {
  return (
    <div
      className="admin-loading-state flex min-h-[45vh] items-center justify-center"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <span
          className="h-9 w-9 animate-spin rounded-full border-4 border-ink-200 border-t-yellow-500"
          aria-hidden="true"
        />
        <p className="text-sm font-medium text-ink-600">Carregando...</p>
      </div>
    </div>
  );
}
