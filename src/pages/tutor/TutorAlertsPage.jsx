import { useState } from "react";
import { BellRing, MessageCircle } from "lucide-react";
import { DataTable, Screen, Section, SidePanel, Status } from "../../components/board/BoardPrimitives.jsx";
import { applicants } from "../../data/demoData.js";

const deadlines = [[15, 6, "neutral"], [10, 4, "neutral"], [5, 3, "warning"], [3, 2, "high"], [1, 1, "high"]];
const reasonFor = (item) => item.risk === "Alto" ? `Sin actividad ${item.days + 6} días` : item.risk === "Medio" ? "Bajo avance" : "Próximo plazo";

export function TutorAlertsPage({ notify, showForm }) {
  const [risk, setRisk] = useState("Todos");
  const [reminders, setReminders] = useState([true, true, true, true, true]);
  const [recent, setRecent] = useState(["Hoy · Ana Paredes pasa a riesgo alto", "Ayer · Alerta de 3 días enviada"]);
  const rows = applicants.filter((item) => risk === "Todos" ? item.risk !== "Bajo" : item.risk === risk);
  const contact = (applicant) => showForm(
    `Contactar a ${applicant.name}`,
    `Prepara un aviso de seguimiento · ${applicant.program}.`,
    [
      { label: "Canal", name: "canal", type: "select", options: ["Llamada", "Correo", "WhatsApp"] },
      { label: "Mensaje", name: "mensaje", type: "textarea", defaultValue: `Hola ${applicant.name}, noté que necesitas apoyo con tu avance. ¿Cómo puedo ayudarte?`, required: true },
    ],
    (values) => {
      setRecent((current) => [`Ahora · Mensaje enviado a ${applicant.name} por ${values.canal}`, ...current].slice(0, 5));
      notify(`Mensaje de seguimiento preparado para ${applicant.name}.`);
    },
  );
  const tableRows = rows.map((item) => [
    item.name,
    reasonFor(item),
    <Status key={`${item.id}-risk`} tone={item.risk === "Alto" ? "high" : "medium"}>{item.risk}</Status>,
    <button key={`${item.id}-contact`} className="reference-board-primary-action tutor-alert-contact" type="button" onClick={() => contact(item)}><MessageCircle size={15} /> Contactar</button>,
  ]);

  return (
    <Screen className="reference-tutor-alerts" title="Alertas de mis postulantes" subtitle="Semáforo y vencimientos" aside={
      <SidePanel title="Vencimientos" subtitle="Días restantes">
        <Section marker="A" title="Próximos plazos">
          <div className="tutor-deadline-chips">{deadlines.map(([day, count, tone], index) => <button type="button" key={day} className={`tutor-deadline-chip ${tone} ${reminders[index] ? "enabled" : "disabled"}`} onClick={() => setReminders((current) => current.map((value, i) => i === index ? !value : value))} aria-pressed={reminders[index]}><span>{day} d</span><strong>{count}</strong></button>)}</div>
        </Section>
        <Section marker="B" title="Avisos recientes">
          <div className="tutor-alert-timeline">{recent.map((item, index) => <p key={`${item}-${index}`}>{item}</p>)}</div>
          <button type="button" className="reference-board-outline-action tutor-side-action" onClick={() => notify("Mostrando todos tus avisos recientes.")}><BellRing size={15} /> Ver todos los avisos</button>
        </Section>
      </SidePanel>
    }>
      <Section marker="1" title="Semáforo" hint="24 postulantes">
        <div className="reference-risk-cards tutor-risk-cards">
          <button type="button" className={`high ${risk === "Alto" ? "active" : ""}`} onClick={() => setRisk(risk === "Alto" ? "Todos" : "Alto")}><strong>5</strong><span>Riesgo alto</span></button>
          <button type="button" className={`medium ${risk === "Medio" ? "active" : ""}`} onClick={() => setRisk(risk === "Medio" ? "Todos" : "Medio")}><strong>9</strong><span>Riesgo medio</span></button>
          <button type="button" className={`low ${risk === "Bajo" ? "active" : ""}`} onClick={() => setRisk(risk === "Bajo" ? "Todos" : "Bajo")}><strong>10</strong><span>Riesgo bajo</span></button>
        </div>
        <div className="tutor-alert-filter"><button type="button" className={risk === "Todos" ? "active" : ""} onClick={() => setRisk("Todos")}>Ver todas</button></div>
      </Section>
      <Section marker="2" title="Requieren acción" hint="Más urgentes">
        <DataTable caption="Alertas de postulantes" headings={["Postulante", "Motivo", "Nivel", "Acción"]} rows={tableRows} />
        {rows.length === 0 && <p className="tutor-agenda-empty">No hay postulantes en este nivel de riesgo.</p>}
      </Section>
    </Screen>
  );
}
