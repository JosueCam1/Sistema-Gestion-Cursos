export function SkeletonBlock({ className = '', width, height }) {
  return <span aria-hidden="true" className={'skeleton-block ' + className} style={{ width, height }} />;
}
