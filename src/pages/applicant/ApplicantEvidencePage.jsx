import { useMemo, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { DataTable, Screen, Section, SidePanel, Status } from "../../components/board/BoardPrimitives.jsx";

export function ApplicantEvidencePage({ reviewState, fileName, onFile, onSubmitEvidence, notify }) {
  const [activity, setActivity] = useState("Certificado de matemática");
  const [kind, setKind] = useState("Certificado PDF");
  const [comment, setComment] = useState("");
  const fileInput = useRef(null);
  const approved = reviewState.filter((item) => item.status === "Aprobada").length;
  const inReview = reviewState.filter((item) => item.status === "En revisión").length;
  const rejected = reviewState.filter((item) => item.status === "Rechazada" || item.status === "Requiere ajustes").length;
  const rejectedEvidence = useMemo(() => reviewState.find((item) => item.status === "Rechazada" || item.status === "Requiere ajustes"), [reviewState]);
  const selectFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      notify("El archivo supera el límite de 10 MB.");
      event.target.value = "";
      return;
    }
    onFile(file.name);
  };
  const submit = () => {
    if (!fileName) return notify("Selecciona un archivo antes de enviarlo.");
    onSubmitEvidence?.(activity, fileName, comment);
    onFile("");
    setComment("");
  };
  const tableRows = reviewState.map((item) => [
    item.title,
    item.date,
    <Status key={`${item.title}-status`} tone={item.status === "Aprobada" ? "success" : item.status === "En revisión" ? "warning" : item.status === "Rechazada" || item.status === "Requiere ajustes" ? "high" : "neutral"}>{item.status}</Status>,
    item.feedback || "Sin observaciones",
  ]);

  return (
    <Screen className="reference-applicant-evidence" title="Evidencias" subtitle="Sube certificados y proyectos" aside={
      <SidePanel title="Resumen" subtitle="Tus entregas">
        <Section marker="A" title="Estado">
          <div className="applicant-evidence-stats">
            <div className="success"><strong>{approved}</strong><span>Aprobadas</span></div>
            <div className="warning"><strong>{inReview}</strong><span>En revisión</span></div>
            <div className="high"><strong>{rejected}</strong><span>Rechazadas</span></div>
          </div>
        </Section>
        <Section marker="B" title="Observación del tutor">
          <p className="applicant-tutor-feedback">{rejectedEvidence?.feedback ?? "No tienes evidencias con observaciones pendientes."}</p>
          <button type="button" className="reference-board-primary-action" disabled={!rejectedEvidence} onClick={() => { setActivity(rejectedEvidence.title); fileInput.current?.click(); }}>Volver a cargar</button>
        </Section>
      </SidePanel>
    }>
      <Section marker="1" title="Cargar evidencia" hint="PDF o proyecto">
        <label className="reference-board-field applicant-evidence-activity">Actividad<select value={activity} onChange={(event) => setActivity(event.target.value)}>{[...new Set(reviewState.map((item) => item.title)), "Proyecto 2: propuesta", "Entrega final"].map((item) => <option key={item}>{item}</option>)}</select></label>
        <div className="applicant-evidence-type">{["Certificado PDF", "Proyecto"].map((value) => <button type="button" key={value} className={kind === value ? "active" : ""} onClick={() => setKind(value)} aria-pressed={kind === value}>{value}</button>)}</div>
        <label className="applicant-evidence-drop" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const file = event.dataTransfer.files?.[0]; if (file) { if (file.size > 10 * 1024 * 1024) return notify("El archivo supera el límite de 10 MB."); onFile(file.name); } }}>
          <input ref={fileInput} type="file" accept={kind === "Certificado PDF" ? ".pdf,application/pdf" : ".pdf,.doc,.docx,.zip,.ppt,.pptx"} onChange={selectFile} />
          <UploadCloud size={22} /><span>{fileName || "Arrastra tu PDF o proyecto aquí (máx. 10 MB)"}</span>
        </label>
        <label className="reference-board-field applicant-evidence-comment">Comentario para tu tutora<textarea rows="2" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Contexto o nota de la entrega (opcional)" /></label>
        <button type="button" className="reference-board-primary-action applicant-evidence-submit" disabled={!fileName} onClick={submit}><UploadCloud size={16} /> Enviar a revisión</button>
      </Section>
      <Section marker="2" title="Mis evidencias" hint="Fecha y estado">
        <DataTable caption="Historial de evidencias" headings={["Evidencia", "Fecha de carga", "Estado", "Observación"]} rows={tableRows} />
      </Section>
    </Screen>
  );
}
