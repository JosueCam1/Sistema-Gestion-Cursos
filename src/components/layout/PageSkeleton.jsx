import { SkeletonBlock } from '../ui/Skeleton.jsx';

export function PageSkeleton({ title = 'Cargando' }) {
  return (
    <div className="page-skeleton" role="status" aria-live="polite" aria-busy="true" aria-label={'Cargando ' + title}>
      <span className="sr-only">Cargando {title}</span>
      <section className="page-skeleton-main" aria-hidden="true">
        <div className="page-skeleton-header"><SkeletonBlock width="42%" height="28px"/><SkeletonBlock width="28%" height="14px"/></div>
        <div className="page-skeleton-section-title"><SkeletonBlock width="160px" height="18px"/><SkeletonBlock width="90px" height="14px"/></div>
        <div className="page-skeleton-cards">{[1,2,3,4].map(item=><div className="page-skeleton-card" key={item}><SkeletonBlock height="84px"/><SkeletonBlock width="62%" height="14px"/><SkeletonBlock width="42%" height="12px"/></div>)}</div>
        <div className="page-skeleton-section-title"><SkeletonBlock width="190px" height="18px"/><SkeletonBlock width="100px" height="14px"/></div>
        <div className="page-skeleton-table">{[1,2,3,4].map(row=><div key={row}><SkeletonBlock width="24%" height="14px"/><SkeletonBlock width="16%" height="14px"/><SkeletonBlock width="14%" height="14px"/><SkeletonBlock width="19%" height="14px"/></div>)}</div>
      </section>
      <aside className="page-skeleton-aside" aria-hidden="true"><div className="page-skeleton-header"><SkeletonBlock width="64%" height="24px"/><SkeletonBlock width="38%" height="13px"/></div><SkeletonBlock width="54%" height="17px"/><SkeletonBlock height="44px"/><SkeletonBlock height="44px"/><SkeletonBlock height="44px"/></aside>
    </div>
  );
}
