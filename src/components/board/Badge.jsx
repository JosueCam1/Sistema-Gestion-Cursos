export function Status({ children, tone = "neutral" }) {
  return <span className={`reference-chip ${tone}`}>{children}</span>;
}
