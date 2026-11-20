import { cx } from '../ui.jsx';

export function SidePanel({ title, subtitle, children }) {
  return (
    <article className="reference-board-side-panel">
      <header className="reference-screen-heading">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </header>
      {children}
    </article>
  );
}
