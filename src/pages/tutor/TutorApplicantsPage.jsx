import { useMemo, useState } from "react";
import { Check, FileDown, MessageSquareText } from "lucide-react";
import { Section, SidePanel, Status } from "../../components/board/BoardPrimitives.jsx";
import { applicants, followups } from "../../data/demoData.js";

const assignedApplicants = applicants.filter((applicant) => applicant.tutor === "M. Torres");
const initialHistory = [
  { applicantId: "POS-0042", date: "19 nov · 10:30", medium: "Llamada", result: "Sin respuesta" },
  { applicantId: "POS-0042", date: "18 nov · 09:00", medium: "Correo de alerta", result: "5 días de plazo" },
  { applicantId: "POS-0042", date: "15 nov · 16:20", medium: "Sistema", result: "Riesgo medio pasa a alto" },
  ...followups.map((item, index) => ({
    applicantId: applicants.find((applicant) => applicant.name === item.person)?.id,
    date: item.date,
    medium: item.medium,
    result: item.result,
    next: item.next,
    order: index,
  })),
];
const today = new Date().toISOString().slice(0, 10);
const emptyDraft = { date: today, time: "10:30", medium: "Llamada", result: "", commitment: "", notes: "", next: "" };

export function TutorApplicantsPage({ showForm, notify }) {
  const [selectedId, setSelectedId] = useState("POS-0042");
  const [draft, setDraft] = useState(emptyDraft);
  const [history, setHistory] = useState(initialHistory);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const selectedApplicant = assignedApplicants.find((applicant) => applicant.id === selectedId) ?? assignedApplicants[0];
  const applicantHistory = useMemo(
    () => history.filter((entry) => entry.applicantId === selectedApplicant.id),
    [history, selectedApplicant.id],
  );
  const visibleHistory = showAllHistory ? applicantHistory : applicantHistory.slice(0, 3);
  const updateDraft = (field) => (event) => setDraft((current) => ({ ...current, [field]: event.target.value }));
  const saveFollowup = () => {
    if (!draft.result.trim()) {
      notify("Escribe el resultado del contacto antes de registrar el seguimiento.");
      return;
    }
    const formattedDate = new Date(`${draft.date}T${draft.time || "12:00"}`).toLocaleDateString("es-EC", { day: "2-digit", month: "short" });
    setHistory((current) => [{
      applicantId: selectedApplicant.id,
      date: `${formattedDate} · ${draft.time}`,
      medium: draft.medium,
      result: draft.result.trim(),
      next: draft.next.trim(),
      commitment: draft.commitment.trim(),
      notes: draft.notes.trim(),
    }, ...current]);
    setDraft(emptyDraft);
    setShowAllHistory(false);
    notify(`Seguimiento registrado para ${selectedApplicant.name}.`);
  };
  const saveDraft = () => {
    sessionStorage.setItem("tutor-followup-draft", JSON.stringify({ applicantId: selectedApplicant.id, ...draft }));
    notify("Borrador guardado en este dispositivo.");
  };
  const exportReport = (format) => {
    if (format === "PDF") {
      window.print();
      return;
    }
    const rows = [
      ["Fecha", "Postulante", "Programa", "Medio", "Resultado", "Próxima acción"],
      ...applicantHistory.map((entry) => [entry.date, selectedApplicant.name, selectedApplicant.program, entry.medium, entry.result, entry.next ?? ""]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `seguimiento-${selectedApplicant.id}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    notify("Informe de seguimiento descargado en formato CSV para Excel.");
  };
  const selectTemplate = () => showForm(
    "Usar plantilla de mensaje",
    `Prepara un mensaje para ${selectedApplicant.name}. Puedes editar el texto antes de aplicarlo al seguimiento.`,
    [
      { label: "Plantilla", name: "template", type: "select", options: ["Recordatorio de plazo", "Solicitud de actualización", "Confirmación de compromiso"] },
      { label: "Mensaje", name: "message", type: "textarea", defaultValue: `Hola ${selectedApplicant.name}, ¿cómo va tu avance en ${selectedApplicant.program}? Cuéntame si necesitas apoyo.` , required: true },
    ],
    (values) => {
      setDraft((current) => ({ ...current, result: values.message }));
      notify("Plantilla aplicada al resultado del seguimiento. Puedes editarla antes de guardar.");
    },
  );

  return (
    <div className="reference-board-layout reference-tutor-applicants">
      <article className="reference-board-main">
        <header className="reference-screen-heading">
          <h1>Seguimiento de postulantes</h1>
          <p>Tutora M. Torres · 24 postulantes asignados</p>
        </header>
        <Section marker="1" title="Mis postulantes" hint="Color = nivel de riesgo">
          <div className="tutor-applicant-cards">
            {assignedApplicants.map((applicant) => (
              <button
                type="button"
                key={applicant.id}
                className={`tutor-applicant-card risk-${applicant.risk.toLowerCase()} ${selectedId === applicant.id ? "selected" : ""}`}
                onClick={() => { setSelectedId(applicant.id); setShowAllHistory(false); }}
                aria-pressed={selectedId === applicant.id}
              >
                <span className="tutor-applicant-card-top">
                  <strong>{applicant.progress}%</strong>
                </span>
                <span className="tutor-applicant-card-copy">
                  <b>{applicant.name}</b>
                  <small>{applicant.program} · {applicant.days} días · riesgo {applicant.risk.toLowerCase()}</small>
                  <span className="tutor-progress-track"><i style={{ width: `${applicant.progress}%` }} /></span>
                </span>
              </button>
            ))}
          </div>
        </Section>
        <Section marker="2" title="Registrar seguimiento" hint={`${selectedApplicant.name} · N.º ${selectedApplicant.id.replace("POS-", "")}`}>
          <div className="tutor-followup-fields">
            <label className="reference-board-field">Fecha<input type="date" value={draft.date} onChange={updateDraft("date")} /></label>
            <label className="reference-board-field">Hora<input type="time" value={draft.time} onChange={updateDraft("time")} /></label>
          </div>
          <div className="tutor-followup-contact">
            <span>Tipo de contacto</span>
            <div className="tutor-contact-options">
              {["Llamada", "Correo", "WhatsApp", "Videoconferencia", "Presencial"].map((medium) => (
                <button type="button" className={draft.medium === medium ? "active" : ""} key={medium} onClick={() => setDraft((current) => ({ ...current, medium }))} aria-pressed={draft.medium === medium}>{medium}</button>
              ))}
            </div>
          </div>
          <div className="tutor-followup-fields">
            <label className="reference-board-field">Resultado del contacto<textarea value={draft.result} onChange={updateDraft("result")} rows="3" /></label>
            <label className="reference-board-field">Compromisos adquiridos<textarea value={draft.commitment} onChange={updateDraft("commitment")} rows="3" /></label>
            <label className="reference-board-field">Observaciones y recomendaciones<textarea value={draft.notes} onChange={updateDraft("notes")} rows="3" /></label>
            <label className="reference-board-field">Próxima acción<input value={draft.next} onChange={updateDraft("next")} placeholder="Ej.: llamar el 21/11" /></label>
          </div>
          <div className="tutor-followup-actions">
            <button type="button" className="reference-board-outline-action" onClick={saveDraft}>Guardar borrador</button>
            <button type="button" className="reference-board-primary-action" onClick={saveFollowup}><Check size={16} /> Registrar y notificar</button>
          </div>
        </Section>
      </article>
      <aside className="reference-board-aside">
        <SidePanel title="Ficha del caso" subtitle={`${selectedApplicant.name} · ${selectedApplicant.program}`}>
          <Section marker="A" title="Riesgo">
            <div className="tutor-case-status">
              <Status tone={selectedApplicant.risk === "Alto" ? "high" : selectedApplicant.risk === "Medio" ? "medium" : "low"}>{selectedApplicant.risk}</Status>
              <Status>Estado: {selectedApplicant.status.toLowerCase()}</Status>
            </div>
            <p className="tutor-case-description">
              {selectedApplicant.risk === "Alto" ? `Sin actividad reciente y ${selectedApplicant.days} días para el próximo plazo.` : `${selectedApplicant.progress}% de avance y ${selectedApplicant.days} días para el próximo plazo.`}
            </p>
          </Section>
          <Section marker="B" title="Historial de trazabilidad">
            <div className="tutor-case-timeline">
              {visibleHistory.map((entry, index) => (
                <div key={`${entry.date}-${index}`}><strong>{entry.date}</strong><span>{entry.medium} · {entry.result}</span></div>
              ))}
              {visibleHistory.length === 0 && <p>Aún no hay seguimientos registrados para este caso.</p>}
            </div>
            <button type="button" className="reference-board-outline-action tutor-side-action" onClick={() => setShowAllHistory((current) => !current)}>{showAllHistory ? "Ver menos" : "Ver historial completo"}</button>
          </Section>
          <Section marker="C" title="Herramientas">
            <button type="button" className="reference-board-outline-action tutor-side-action" onClick={selectTemplate}><MessageSquareText size={16} /> Usar plantilla de mensaje</button>
            <button type="button" className="reference-board-outline-action tutor-side-action" onClick={() => showForm("Exportar informe", `Descarga la trazabilidad de ${selectedApplicant.name}.`, [{ label: "Formato", name: "format", type: "select", options: ["Excel", "PDF"] }], (values) => exportReport(values.format === "PDF" ? "PDF" : "Excel"))}><FileDown size={16} /> Exportar informe PDF / Excel</button>
          </Section>
        </SidePanel>
      </aside>
    </div>
  );
}
