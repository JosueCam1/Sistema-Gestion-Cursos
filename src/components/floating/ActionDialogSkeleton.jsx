export function ActionDialogSkeleton({ rows = 4 }) {
  return (
    <div className="floating-skeleton" role="status" aria-label="Cargando formulario">
      <span className="floating-skeleton-line title" />
      <span className="floating-skeleton-line short" />
      {Array.from({ length: rows }, (_, index) => <span className="floating-skeleton-line" key={index} />)}
      <span className="floating-skeleton-line footer" />
    </div>
  );
}
