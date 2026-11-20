import { useMemo, useState } from "react";
import { CalendarPlus } from "lucide-react";
import { Avatar } from "../../components/ui.jsx";
import { DataTable, Screen, Section, SidePanel, Status, Toggle } from "../../components/board/BoardPrimitives.jsx";
import { applicants } from "../../data/demoData.js";

const initialEvents = [
  { id: "a1", date: "2026-11-20", time: "10:30", applicant: "Ana Lucía Paredes", medium: "Llamada", reason: "Riesgo alto", status: "Pendiente" },
  { id: "a2", date: "2026-11-20", time: "12:00", applicant: "Karla Mena", medium: "WhatsApp", reason: "Bajo avance", status: "Confirmado" },
  { id: "a3", date: "2026-11-20", time: "16:00", applicant: "Diego Salazar", medium: "Videoconferencia", reason: "Evidencia rechazada", status: "Confirmado" },
  { id: "a4", date: "2026-11-21", time: "10:00", applicant: "Ana Lucía Paredes", medium: "Llamada", reason: "Reintento de contacto", status: "Pendiente" },
  { id: "a5", date: "2026-11-23", time: "09:00", applicant: "Pablo Ortiz", medium: "Presencial", reason: "Revisar plan de trabajo", status: "Confirmado" },
  { id: "a6", date: "2026-11-24", time: "10:00", applicant: "Josué Camisan", medium: "Videoconferencia", reason: "Revisión de avance", status: "Confirmado" },
];
const defaultDraft = { applicant: applicants[0].name, date: "2026-11-21", time: "10:00", medium: "Llamada", reason: "" };
const dateLabel = (value) => new Date(`${value}T12:00:00`).toLocaleDateString("es-EC", { weekday: "short", day: "2-digit", month: "short" });

export function TutorAgendaPage({ notify }) {
  const [events, setEvents] = useState(initialEvents);
  const [draft, setDraft] = useState(defaultDraft);
  const [reminder, setReminder] = useState(true);
  const [weekView, setWeekView] = useState(false);
  const todayEvents = useMemo(() => events.filter((event) => event.date === "2026-11-20").sort((a, b) => a.time.localeCompare(b.time)), [events]);
  const upcoming = useMemo(() => events.filter((event) => event.date > "2026-11-20").sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)), [events]);
  const update = (field) => (event) => setDraft((current) => ({ ...current, [field]: event.target.value }));
  const schedule = (event) => {
    event.preventDefault();
    const scheduled = { ...draft, id: `event-${Date.now()}`, reason: draft.reason.trim() || `Seguimiento por ${draft.medium.toLowerCase()}`, status: "Pendiente" };
    setEvents((current) => [...current, scheduled]);
    setDraft(defaultDraft);
    notify(`Contacto agendado con ${scheduled.applicant} para el ${dateLabel(scheduled.date)}.`);
  };
  const toggleEvent = (id) => setEvents((current) => current.map((item) => item.id === id ? { ...item, status: item.status === "Completado" ? "Pendiente" : "Completado" } : item));
  const exportCalendar = () => {
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Impulso//Agenda tutor//ES"];
    upcoming.forEach((event) => {
      const [year, month, day] = event.date.split("-");
      const [hour, minute] = event.time.split(":");
      const endHour = String((Number(hour) + 1) % 24).padStart(2, "0");
      lines.push("BEGIN:VEVENT", `UID:${event.id}@impulso.local`, `DTSTART:${year}${month}${day}T${hour}${minute}00`, `DTEND:${year}${month}${day}T${endHour}${minute}00`, `SUMMARY:${event.medium} · ${event.applicant}`, `DESCRIPTION:${event.reason}`, "END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    const url = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "agenda-tutoria.ics"; link.click(); URL.revokeObjectURL(url);
    notify("Agenda descargada para añadirla a tu calendario.");
  };

  return (
    <Screen className="reference-tutor-agenda" title="Agenda de contactos" subtitle="Tu semana de seguimientos" aside={
      <SidePanel title="Nuevo contacto" subtitle="Programa un seguimiento">
        <form onSubmit={schedule}>
          <Section marker="A" title="Datos">
            <label className="reference-board-field">Postulante<select value={draft.applicant} onChange={update("applicant")}>{applicants.map((item) => <option key={item.id}>{item.name}</option>)}</select></label>
            <div className="tutor-agenda-date-fields">
              <label className="reference-board-field">Fecha<input type="date" value={draft.date} onChange={update("date")} required /></label>
              <label className="reference-board-field">Hora<input type="time" value={draft.time} onChange={update("time")} required /></label>
            </div>
            <div className="tutor-contact-options">{["Llamada", "Correo", "WhatsApp"].map((medium) => <button key={medium} type="button" className={draft.medium === medium ? "active" : ""} onClick={() => setDraft((current) => ({ ...current, medium }))} aria-pressed={draft.medium === medium}>{medium}</button>)}</div>
            <label className="reference-board-field tutor-agenda-reason">Motivo<input value={draft.reason} onChange={update("reason")} placeholder="Tema para revisar" /></label>
            <button className="reference-board-primary-action" type="submit">Agendar</button>
          </Section>
          <Section marker="B" title="Recordatorios"><Toggle label="Recordarme 1 día antes" checked={reminder} onChange={() => setReminder((current) => !current)} /></Section>
        </form>
      </SidePanel>
    }>
      <Section marker="1" title="Hoy" hint={`${todayEvents.length} contactos`}>
        <DataTable caption="Contactos de hoy" headings={["Hora", "Postulante", "Medio", "Motivo", "Estado"]} rows={todayEvents.map((event) => [
          event.time,
          <span className="tutor-agenda-person" key={event.id}><Avatar initials={applicants.find((item) => item.name === event.applicant)?.initials ?? "?"} size="small" />{event.applicant}</span>,
          event.medium,
          event.reason,
          <button type="button" className="tutor-event-status" key={`status-${event.id}`} onClick={() => toggleEvent(event.id)}><Status tone={event.status === "Completado" ? "success" : "warning"}>{event.status}</Status></button>,
        ])} />
        {todayEvents.length === 0 && <p className="tutor-agenda-empty">No tienes contactos para hoy.</p>}
      </Section>
      <Section marker="2" title="Próximos 7 días" hint={`${upcoming.length} contactos`}>
        <div className="tutor-agenda-section-actions"><button type="button" className="reference-board-outline-action" onClick={() => setWeekView((current) => !current)}>{weekView ? "Ver próximos" : "Vista semanal"}</button></div>
        <DataTable caption="Próximos contactos" headings={["Día", "Postulante", "Medio", "Motivo", "Estado"]} rows={(weekView ? upcoming : upcoming.slice(0, 3)).map((event) => [
          dateLabel(event.date),
          <span className="tutor-agenda-person" key={event.id}><Avatar initials={applicants.find((item) => item.name === event.applicant)?.initials ?? "?"} size="small" />{event.applicant}</span>,
          event.medium,
          event.reason,
          <button type="button" className="tutor-event-status" key={`status-${event.id}`} onClick={() => toggleEvent(event.id)}><Status tone={event.status === "Completado" ? "success" : "warning"}>{event.status}</Status></button>,
        ])} />
        <button type="button" className="reference-board-outline-action tutor-side-action" onClick={exportCalendar}><CalendarPlus size={16} /> Añadir a calendario</button>
      </Section>
    </Screen>
  );
}
