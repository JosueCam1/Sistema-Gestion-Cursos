import { useState } from "react";
import { Mail, Plus, Send } from "lucide-react";
import { Section, Screen, SidePanel } from "../../components/board/BoardPrimitives.jsx";
import { applicants } from "../../data/demoData.js";

const sampleTemplates = [
  { id: "deadline", name: "Recordatorio de plazo", channel: "Correo", subject: "Tu plazo vence pronto", message: "Hola {nombre}, recuerda que {actividad} vence el {fecha}. Avísame si necesitas apoyo." },
  { id: "evidence", name: "Evidencia rechazada", channel: "Correo", subject: "Necesitamos corregir tu evidencia", message: "Hola {nombre}, revisa las observaciones de {actividad} y vuelve a cargar el archivo." },
  { id: "welcome", name: "Bienvenida", channel: "WhatsApp", subject: "¡Bienvenida al programa!", message: "Hola {nombre}, cuenta conmigo durante tu programa {programa}." },
  { id: "retry", name: "Reintento sin respuesta", channel: "WhatsApp", subject: "¿Podemos conversar?", message: "Hola {nombre}, intento comunicarme contigo para revisar tu avance. ¿Qué horario te queda bien?" },
];
const colors = ["teal", "red", "violet", "green"];

export function TutorTemplatesPage({ showForm, notify }) {
  const [templates, setTemplates] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tutor-message-templates")) ?? sampleTemplates; }
    catch { return sampleTemplates; }
  });
  const [selectedId, setSelectedId] = useState(templates[0]?.id);
  const [channel, setChannel] = useState("Correo");
  const selected = templates.find((item) => item.id === selectedId) ?? templates[0];
  const update = (field) => (event) => setTemplates((current) => current.map((item) => item.id === selected.id ? { ...item, [field]: event.target.value } : item));
  const persist = () => {
    localStorage.setItem("tutor-message-templates", JSON.stringify(templates));
    notify("Plantilla guardada en este dispositivo.");
  };
  const createTemplate = () => {
    const item = { id: `template-${Date.now()}`, name: "Nueva plantilla", channel: "Correo", subject: "", message: "" };
    setTemplates((current) => [...current, item]);
    setSelectedId(item.id);
  };
  const testSend = () => showForm(
    "Enviar prueba de plantilla",
    `Comprueba “${selected.name}” antes de usarla con un postulante.`,
    [
      { label: "Postulante", name: "applicant", type: "select", options: applicants.map((item) => item.name) },
      { label: "Correo de prueba", name: "email", type: "email", placeholder: "tucorreo@institucion.edu.ec", required: true },
    ],
    (values) => notify(`Prueba de “${selected.name}” preparada para ${values.applicant} · ${values.email}.`),
  );
  const copyVariable = async (variable) => {
    try { await navigator.clipboard.writeText(variable); notify(`${variable} copiada.`); }
    catch { notify(`Variable para copiar: ${variable}`); }
  };

  if (!selected) return null;
  return (
    <Screen className="reference-tutor-templates" title="Plantillas de mensajes" subtitle="Contacta más rápido" aside={
      <SidePanel title="Opciones" subtitle="Variables y canal">
        <Section marker="A" title="Variables">
          <div className="tutor-template-variables">{["{nombre}", "{programa}", "{actividad}", "{fecha}", "{tutor}"].map((variable) => <button type="button" key={variable} onClick={() => copyVariable(variable)}>{variable}</button>)}</div>
          <p className="tutor-template-helper">Pulsa una variable para copiarla al portapapeles.</p>
        </Section>
        <Section marker="B" title="Canal">
          <div className="tutor-contact-options">{["Correo", "WhatsApp"].map((value) => <button type="button" key={value} className={channel === value ? "active" : ""} onClick={() => setChannel(value)} aria-pressed={channel === value}>{value}</button>)}</div>
          <button type="button" className="reference-board-outline-action tutor-side-action" onClick={testSend}><Send size={15} /> Enviar prueba</button>
        </Section>
      </SidePanel>
    }>
      <Section marker="1" title="Mis plantillas" hint={`${templates.length} disponibles`}>
        <div className="tutor-template-cards">
          {templates.map((item, index) => <button type="button" key={item.id} className={`tutor-template-card ${selectedId === item.id ? "selected" : ""}`} onClick={() => { setSelectedId(item.id); setChannel(item.channel); }} aria-pressed={selectedId === item.id}>
            <span className={`tutor-template-card-top ${colors[index % colors.length]}`}><strong>{index + 1}</strong></span>
            <span className="tutor-template-card-copy"><b>{item.name}</b><small>{item.channel}</small></span>
          </button>)}
          <button type="button" className="tutor-template-create" onClick={createTemplate}><Plus size={18} /> Nueva plantilla</button>
        </div>
      </Section>
      <Section marker="2" title="Editar plantilla" hint={selected.name}>
        <div className="tutor-template-editor">
          <label className="reference-board-field">Nombre<input value={selected.name} onChange={update("name")} /></label>
          <label className="reference-board-field">Canal<select value={selected.channel} onChange={update("channel")}><option>Correo</option><option>WhatsApp</option></select></label>
          <label className="reference-board-field tutor-template-wide">Asunto<input value={selected.subject} onChange={update("subject")} placeholder="Asunto del mensaje" /></label>
          <label className="reference-board-field tutor-template-wide">Mensaje<textarea rows="5" value={selected.message} onChange={update("message")} placeholder="Escribe el contenido de tu plantilla" /></label>
        </div>
        <button type="button" className="reference-board-primary-action tutor-template-save" onClick={persist}><Mail size={15} /> Guardar plantilla</button>
      </Section>
    </Screen>
  );
}
