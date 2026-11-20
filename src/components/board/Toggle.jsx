export function Toggle({ label, checked = false, onChange }) {
  return (
    <label className="reference-board-toggle">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <i aria-hidden="true" />
    </label>
  );
}
