export function MetricCard({ label, value, tone = "neutral", onClick }) {
  return (
    <button
      type="button"
      className={`reference-metric ${tone}`}
      onClick={onClick}
      aria-label={`${label}: ${value}. Abrir detalle`}
    >
      <strong>{value}</strong>
      <span>{label}</span>
    </button>
  );
}

