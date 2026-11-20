import { useState } from "react";
import { Avatar } from "../../components/ui.jsx";
import { DataTable, Screen, Section, SidePanel, Status } from "../../components/board/BoardPrimitives.jsx";

const initialContacts = [
  { date: "18 nov", medium: "Correo", result: "Respondió", commitment: "Subir certificado" },
  { date: "15 nov", medium: "Llamada", result: "Respondió", commitment: "Revisar proyecto 1" },
  { date: "12 nov", medium: "WhatsApp", result: "Respondió", commitment: "Completar perfil" },
];
const initialMeetings = [
  { date: "21 nov", title: "Subir certificado de matemática" },
  { date: "25 nov", title: "Entregar proyecto 2" },
];

export function ApplicantTutorPage({ notify, showForm }) {
  const [contacts, setContacts] = useState(initialContacts);
  const [meetings, setMeetings] = useState(initialMeetings);
  const [meetingDate, setMeetingDate] = useState("2026-11-21");
  const [meetingTime, setMeetingTime] = useState("15:00");
  const [meetingType, setMeetingType] = useState("Videoconferencia");
  const addContact = (medium, result) => setContacts((current) => [{ date: "Hoy", medium, result, commitment: "Pendiente de acordar" }, ...current]);
  const openMessage = (medium) => showForm(
    medium === "Correo" ? "Escribir a mi tutora" : "Enviar mensaje por WhatsApp",
    `Comunícate con M. Torres · tutora de Ing. de Software.`,
    [{ label: "Mensaje", name: "message", type: "textarea", placeholder: "Escribe tu consulta o mensaje", required: true }],
    (values) => { addContact(medium, "Enviado"); notify(`Mensaje enviado a M. Torres por ${medium}.`); },
  );
  const requestMeeting = () => {
    if (!meetingDate || !meetingTime) return notify("Elige fecha y hora para solicitar la reunión.");
    const date = new Date(`${meetingDate}T12:00:00`).toLocaleDateString("es-EC", { day: "2-digit", month: "short" });
    setMeetings((current) => [{ date, title: `Solicitud: ${meetingType} · ${meetingTime}` }, ...current]);
    addContact(meetingType, "Solicitud enviada");
    notify(`Solicitud de reunión enviada para el ${date} a las ${meetingTime}.`);
  };
  const meetingRows = meetings.map((item) => [item.date, item.title]);
  const contactRows = contacts.map((item) => [item.date, item.medium, <Status key={`${item.date}-${item.medium}-${item.result}`} tone={item.result === "Respondió" ? "success" : "warning"}>{item.result}</Status>, item.commitment]);

  return (
    <Screen className="reference-applicant-tutor" title="Mi tutor" subtitle="Acompañamiento personalizado" aside={
      <SidePanel title="Próxima acción" subtitle="Lo acordado">
        <Section marker="A" title="Compromisos">
          <div className="applicant-tutor-commitments">{meetings.slice(0, 4).map((item, index) => <div key={`${item.date}-${index}`}><strong>{item.date}</strong><span>{item.title}</span></div>)}</div>
        </Section>
        <Section marker="B" title="Mensaje rápido">
          <p className="applicant-tutor-side-copy">Escribe a tu tutora</p>
          <button type="button" className="reference-board-primary-action applicant-tutor-action" onClick={() => openMessage("WhatsApp")}>Escribir por WhatsApp</button>
          <button type="button" className="reference-board-outline-action applicant-tutor-action" onClick={() => openMessage("Correo")}>Enviar correo</button>
        </Section>
      </SidePanel>
    }>
      <Section marker="1" title="Mi tutora" hint="Asignada a tu programa">
        <div className="applicant-tutor-profile">
          <Avatar initials="MT" size="large" tone="blue" />
          <div><strong>M. Torres</strong><span>Tutora · Ing. de Software</span><small>Disponible esta semana</small></div>
          <div className="applicant-tutor-contact-actions">
            <button type="button" className="active" onClick={() => openMessage("WhatsApp")}>WhatsApp</button>
            <button type="button" onClick={() => openMessage("Correo")}>Correo</button>
            <button type="button" onClick={() => { setMeetingType("Videoconferencia"); document.getElementById("applicant-meeting-date")?.focus(); }}>Videoconferencia</button>
          </div>
        </div>
      </Section>
      <Section marker="2" title="Contactos registrados" hint="Trazabilidad">
        <DataTable caption="Contactos registrados" headings={["Fecha", "Medio", "Resultado", "Compromiso"]} rows={contactRows} />
      </Section>
      <Section marker="3" title="Agendar reunión" hint="Elige día y medio">
        <div className="applicant-meeting-fields">
          <label className="reference-board-field">Fecha<input id="applicant-meeting-date" type="date" value={meetingDate} onChange={(event) => setMeetingDate(event.target.value)} /></label>
          <label className="reference-board-field">Hora<input type="time" value={meetingTime} onChange={(event) => setMeetingTime(event.target.value)} /></label>
        </div>
        <div className="applicant-tutor-contact-actions applicant-meeting-types">{["Videoconferencia", "Presencial", "Llamada"].map((type) => <button type="button" key={type} className={meetingType === type ? "active" : ""} onClick={() => setMeetingType(type)} aria-pressed={meetingType === type}>{type}</button>)}</div>
        <button type="button" className="reference-board-primary-action applicant-meeting-submit" onClick={requestMeeting}>Solicitar reunión</button>
      </Section>
    </Screen>
  );
}
