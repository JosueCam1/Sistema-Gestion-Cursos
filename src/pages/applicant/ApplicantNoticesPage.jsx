import { useMemo, useState } from "react";
import { CheckCheck } from "lucide-react";
import { DataTable, Screen, Section, SidePanel, Status, Toggle } from "../../components/board/BoardPrimitives.jsx";

const seedNotices = [
  { id: 1, title: "Evidencia rechazada: matemática", type: "Evidencia", time: "Hoy 10:42", unread: true },
  { id: 2, title: "Quedan 5 días para tu plazo", type: "Plazo", time: "Hoy 08:00", unread: true },
  { id: 3, title: "Documentación cargada correctamente", type: "Carga", time: "Ayer", unread: true },
  { id: 4, title: "Inscripción confirmada", type: "Inscripción", time: "12 nov", unread: false },
  { id: 5, title: "Registro exitoso", type: "Cuenta", time: "10 nov", unread: false },
];
const settings = ["Registro", "Inscripción a curso", "Documentación cargada", "Evidencia aprobada o rechazada", "Fecha límite cercana"];
const typeTone = { Evidencia: "high", Plazo: "warning", Carga: "success", Inscripción: "success", Cuenta: "success" };

export function ApplicantNoticesPage({ notify }) {
  const [notices, setNotices] = useState(seedNotices);
  const [filter, setFilter] = useState("Todos");
  const [preferences, setPreferences] = useState([true, true, true, true, true]);
  const unreadCount = notices.filter((item) => item.unread).length;
  const visible = useMemo(() => notices.filter((item) => filter === "Todos" || (filter === "Sin leer" ? item.unread : item.type === filter)), [notices, filter]);
  const markAllRead = () => { setNotices((current) => current.map((item) => ({ ...item, unread: false }))); notify("Todos tus avisos quedaron marcados como leídos."); };
  const markRead = (id) => setNotices((current) => current.map((item) => item.id === id ? { ...item, unread: false } : item));
  const rows = visible.map((item) => [
    <button type="button" className={`applicant-notice-title ${item.unread ? "unread" : ""}`} key={`${item.id}-title`} onClick={() => { markRead(item.id); notify(`Aviso abierto: ${item.title}`); }}>{item.title}</button>,
    <Status key={`${item.id}-type`} tone={typeTone[item.type] ?? "neutral"}>{item.type}</Status>,
    item.time,
  ]);

  return (
    <Screen className="reference-applicant-notices" title="Notificaciones" subtitle="Todo lo que ocurre en tu proceso" aside={
      <SidePanel title="Preferencias de correo" subtitle="Qué quieres recibir">
        <Section marker="A" title="Eventos">
          {settings.map((label, index) => <Toggle key={label} label={label} checked={preferences[index]} onChange={() => setPreferences((current) => current.map((value, i) => i === index ? !value : value))} />)}
        </Section>
        <Section marker="B" title="Resumen">
          <div className="applicant-notice-summary"><div><strong>{unreadCount}</strong><span>Sin leer</span></div><div><strong>12</strong><span>Este mes</span></div></div>
        </Section>
      </SidePanel>
    }>
      <Section marker="1" title="Mis avisos" hint={`${unreadCount} sin leer`}>
        <div className="applicant-notice-filters">{["Todos", "Sin leer", "Evidencia", "Plazo"].map((value) => <button type="button" key={value} className={filter === value ? "active" : ""} onClick={() => setFilter(value)} aria-pressed={filter === value}>{value}</button>)}
          <button type="button" className="applicant-mark-all" onClick={markAllRead}><CheckCheck size={16} /> Marcar todo leído</button>
        </div>
        <DataTable caption="Mis notificaciones" headings={["Aviso", "Tipo", "Hora"]} rows={rows} />
        {visible.length === 0 && <p className="applicant-empty-state">No hay avisos para este filtro.</p>}
      </Section>
    </Screen>
  );
}
