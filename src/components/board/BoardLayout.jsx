import { cx } from '../ui.jsx';

export function Screen({ title, subtitle, children, aside, className = "" }) {
  return (
    <div
      className={
        className
          ? "reference-board-layout " + className
          : "reference-board-layout"
      }
    >
      <article className="reference-board-main">
        <header className="reference-screen-heading">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </header>
        {children}
      </article>
      <aside className="reference-board-aside">{aside}</aside>
    </div>
  );
}
