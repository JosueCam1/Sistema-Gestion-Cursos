const variants = {
  primary: 'button button-primary',
  secondary: 'button button-light',
  outline: 'reference-board-outline-action',
  boardPrimary: 'reference-board-primary-action',
};

export function Button({ variant = 'primary', className = '', type = 'button', ...props }) {
  return <button type={type} className={[variants[variant] || '', className].filter(Boolean).join(' ')} {...props} />;
}
