import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { ActionDialogSkeleton } from "./ActionDialogSkeleton.jsx";

const categories = ["Todo", "Postulantes", "Programas", "Tutores"];

export function GlobalSearchDialog({ open, items, onClose, onNavigate }) {
  const ref = useRef(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todo");
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const results = useMemo(() => items.filter((item) => {
    const kind = item.kind || (item.route === "postulantes" ? "Postulantes" : item.route === "programas" ? "Programas" : "Tutores");
    return (category === "Todo" || kind === category) && `${item.title} ${item.detail}`.toLowerCase().includes(query.toLowerCase());
  }).slice(0, 10), [items, query, category]);
  const groups = useMemo(() => categories.slice(1).map((name) => ({ name, items: results.filter((item) => (item.kind || (item.route === "postulantes" ? "Postulantes" : item.route === "programas" ? "Programas" : "Tutores")) === name) })).filter((group) => group.items.length), [results]);

  useEffect(() => {
    if (!open) {
      if (ref.current?.open) ref.current.close();
      return;
    }
    if (!ref.current?.open) ref.current?.showModal();
    setLoading(true);
    setActiveIndex(0);
    const timer = window.setTimeout(() => setLoading(false), 360);
    window.setTimeout(() => ref.current?.querySelector("input")?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  function handleKeyDown(event) {
    if (event.key === "ArrowDown") { event.preventDefault(); setActiveIndex((index) => Math.min(index + 1, results.length - 1)); }
    if (event.key === "ArrowUp") { event.preventDefault(); setActiveIndex((index) => Math.max(index - 1, 0)); }
    if (event.key === "Enter" && results[activeIndex]) { event.preventDefault(); onNavigate(results[activeIndex].route); onClose(); }
    if (event.key === "Escape") onClose();
  }

  return (
    <dialog ref={ref} className="floating-search-dialog" aria-label="Buscar en el portal" onClose={onClose} onClick={(event) => { if (event.target === ref.current) onClose(); }} onKeyDown={handleKeyDown}>
      <div className="floating-search-input"><Search size={18} /><input value={query} onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }} placeholder="Busca postulantes, programas o tutores" aria-label="Buscar postulantes, programas o tutores" /><kbd>Esc</kbd><button type="button" className="floating-icon-button" aria-label="Cerrar búsqueda" onClick={onClose}><X size={16} /></button></div>
      <nav className="floating-search-categories" aria-label="Filtrar resultados">{categories.map((item) => <button type="button" key={item} className={category === item ? "active" : ""} aria-pressed={category === item} onClick={() => { setCategory(item); setActiveIndex(0); }}>{item}</button>)}</nav>
      <div className="floating-search-results" aria-live="polite">{loading ? <ActionDialogSkeleton rows={3} /> : groups.length ? groups.map((group) => <section key={group.name}><h2>{group.name}</h2>{group.items.map((item) => {
        const index = results.indexOf(item);
        const initials = item.title.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
        return <button type="button" key={item.title} className={`floating-search-result ${activeIndex === index ? "active" : ""}`} onMouseEnter={() => setActiveIndex(index)} onClick={() => { onNavigate(item.route); onClose(); }}><span className={`floating-search-avatar ${group.name === "Programas" ? "program" : ""}`}>{group.name === "Programas" ? "" : initials}</span><span className="floating-search-copy"><strong>{item.title}</strong><small>{item.detail}</small></span>{group.name === "Postulantes" && <span className={`floating-search-risk ${item.risk?.toLowerCase()}`}>{item.risk}</span>}{group.name === "Programas" && <span className="floating-search-count">{item.count} postulantes</span>}{group.name === "Tutores" && <span className="floating-search-count">Tutor</span>}<ArrowRight size={16} /></button>;
      })}</section>) : <p className="floating-search-empty">No hay coincidencias. Prueba con otro nombre o categoría.</p>}</div>
      <footer className="floating-search-hints"><span><kbd>↑</kbd> <kbd>↓</kbd> navegar</span><span><kbd>↵</kbd> abrir</span><span><kbd>Esc</kbd> cerrar</span></footer>
    </dialog>
  );
}
