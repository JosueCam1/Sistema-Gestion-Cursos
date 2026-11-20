export function Badge({ children, tone = 'neutral', dot = false, className = '' }) {
  return <span className={'pill pill-' + tone + ' ' + className}>{dot && <i aria-hidden="true" />}{children}</span>;
}
