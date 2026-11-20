import { cx } from '../ui.jsx';

export function Section({ marker, title, hint, children, className = "" }) {
  return (
    <section className={`reference-board-section ${className}`}>
      <header className="reference-board-section-heading">
        <span>{marker}</span>
        <h2>{title}</h2>
        {hint && <small>{hint}</small>}
      </header>
      {children}
    </section>
  );
}
