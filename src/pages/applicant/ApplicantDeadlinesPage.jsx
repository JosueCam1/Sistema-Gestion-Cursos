import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import { DataTable, Screen, Section, SidePanel, Status, Toggle } from "../../components/board/BoardPrimitives.jsx";

const deadlines = [
  { name: "Certificado de matemática", date: "01 dic 2026", iso: "2026-12-01", days: 3, course: "Matemática" },
  { name: "Proyecto 2: propuesta", date: "05 dic 2026", iso: "2026-12-05", days: 7, course: "Proyecto final" },
  { name: "Entrega final", date: "15 dic 2026", iso: "2026-12-15", days: 12, course: "Proyecto final" },
];
const reminderDays = [15, 10, 5, 3, 1];

export function ApplicantDeadlinesPage({ notify }) {
  const [reminders, setReminders] = useState([true, true, true, false, false]);
  const [email, setEmail] = useState(true);
  const [calendar, setCalendar] = useState(false);
  const downloadCalendar = () => {
    const events = deadlines.flatMap((item) => {
      const [year, month, day] = item.iso.split("-");
      return ["BEGIN:VEVENT", `UID:${item.name.replaceAll(" ", "-")}@impulso.local`, `DTSTART;VALUE=DATE:${day}${month}${year}`, `DTEND;VALUE=DATE:${day}${month}${year}`, `SUMMARY:Vence: ${item.name}`, `DESCRIPTION:${item.course}`, "END:VEVENT"];
    });
    const content = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Impulso//Plazos postulante//ES", ...events, "END:VCALENDAR"].join("\r\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "mis-plazos.ics"; link.click(); URL.revokeObjectURL(url);
    setCalendar(true);
    notify("Tus plazos se descargaron para añadirlos a tu calendario.");
  };
  const rows = deadlines.map((item) => [item.name, item.date.replace(" 2026", ""), <Status key={item.name} tone={item.days <= 3 ? "high" : item.days <= 7 ? "warning" : "neutral"}>{item.days} días</Status>]);

  return (
    <Screen className="reference-applicant-deadlines" title="Mis plazos" subtitle="Fechas límite y días restantes" aside={
      <SidePanel title="Recordatorios" subtitle="A tu manera">
        <Section marker="A" title="Próximo plazo">
          <div className="applicant-next-deadline"><strong>{deadlines[0].days} días</strong><span>{deadlines[0].name}</span></div>
        </Section>
        <Section marker="B" title="Avisarme por">
          <Toggle label="Correo electrónico" checked={email} onChange={() => setEmail((value) => !value)} />
          <Toggle label="Mi calendario" checked={calendar} onChange={() => setCalendar((value) => !value)} />
          <button type="button" className="reference-board-primary-action applicant-calendar-action" onClick={downloadCalendar}><CalendarPlus size={16} /> Añadir plazos al calendario</button>
        </Section>
      </SidePanel>
    }>
      <Section marker="1" title="Próximos vencimientos" hint="Quedan 12 días">
        <DataTable caption="Próximos vencimientos" headings={["Actividad", "Fecha límite", "Faltan"]} rows={rows} />
      </Section>
      <Section marker="2" title="Avisos automáticos" hint="Antes del vencimiento">
        <div className="applicant-reminder-chips">{reminderDays.map((day, index) => <button type="button" key={day} className={`${reminders[index] ? "active" : ""} ${day === 5 ? "next" : ""}`} onClick={() => setReminders((current) => current.map((value, i) => i === index ? !value : value))} aria-pressed={reminders[index]}>{day} días {reminders[index] ? "✓" : ""}{day === 5 && reminders[index] ? " · próximo" : ""}</button>)}</div>
      </Section>
    </Screen>
  );
}
