import { useMemo, useState } from "react";
import { Check, Eye } from "lucide-react";
import { Avatar } from "../../components/ui.jsx";
import { DataTable, Screen, Section, SidePanel, Status } from "../../components/board/BoardPrimitives.jsx";
import { applicants } from "../../data/demoData.js";

const initialCases = [
  { id: "0042", applicant: applicants[0], medium: "Llamada", result: "Sin respuesta", state: "Abierto", commitment: "", notes: "", next: "Llamar el 21/11", history: [["19 nov · 10:30", "Llamada sin respuesta"], ["18 nov · 09:00", "Correo de alerta (5 días)"], ["15 nov", "Riesgo medio pasa a alto"]] },
  { id: "0041", applicant: applicants[2], medium: "WhatsApp", result: "Respondió", state: "En curso", commitment: "Enviar certificado", notes: "Dar seguimiento al archivo", next: "Revisar certificado", history: [["18 nov · 12:00", "Respondió por WhatsApp"], ["16 nov · 09:30", "Recordatorio de evidencia"]] },
  { id: "0040", applicant: applicants[3], medium: "Correo", result: "Compromiso", state: "Cerrado", commitment: "Completar el módulo", notes: "Avance estable", next: "", history: [["15 nov · 15:20", "Compromiso de entrega"], ["12 nov · 10:00", "Correo de seguimiento"]] },
];

export function TutorFollowupsPage({ notify, changeEvidence, reviewState }) {
  const [cases, setCases] = useState(initialCases);
  const [selectedId, setSelectedId] = useState("0042");
  const [filter, setFilter] = useState("Todos");
  const selected = cases.find((item) => item.id === selectedId) ?? cases[0];
  const [draft, setDraft] = useState(() => ({ result: selected.result, commitment: selected.commitment, notes: selected.notes, next: selected.next }));
  const filtered = useMemo(() => filter === "Todos" ? cases : cases.filter((item) => item.state === filter), [cases, filter]);
  const evidenceItem = reviewState?.find((item) => item.status === "En revisión");
  const chooseCase = (item) => {
    setSelectedId(item.id);
    setDraft({ result: item.result, commitment: item.commitment, notes: item.notes, next: item.next });
  };
  const update = (field) => (event) => setDraft((current) => ({ ...current, [field]: event.target.value }));
  const save = () => {
    if (!draft.result.trim()) return notify("Completa el resultado del contacto antes de guardar.");
    setCases((current) => current.map((item) => item.id === selected.id ? {
      ...item,
      ...draft,
      state: item.state === "Cerrado" ? "Cerrado" : "En curso",
      history: [["20 nov · 10:30", draft.result.trim()], ...item.history],
    } : item));
    notify(`Cambios guardados para ${selected.applicant.name}.`);
  };
  const columns = [
    { key: "id", title: "N.º" },
    { key: "applicant", title: "Postulante" },
    { key: "medium", title: "Medio" },
    { key: "result", title: "Resultado" },
    { key: "state", title: "Estado" },
  ];

  return (
    <Screen className="reference-tutor-followups" title="Casos de seguimiento" subtitle="Historial por postulante" aside={
      <SidePanel title="Trazabilidad" subtitle={`Caso ${selected.id}`}>
        <Section marker="A" title="Historial cronológico">
          <div className="tutor-case-timeline">
            {selected.history.map(([date, detail], index) => <div key={`${date}-${index}`}><strong>{date}</strong><span>{detail}</span></div>)}
          </div>
        </Section>
        <Section marker="B" title="Evidencia asociada">
          <button type="button" className="reference-board-outline-action tutor-side-action" onClick={() => evidenceItem ? notify(`Vista previa de ${evidenceItem.title}.`) : notify("No hay evidencias pendientes para este caso.")}><Eye size={16} /> Ver certificado cargado</button>
        </Section>
      </SidePanel>
    }>
      <Section marker="1" title="Mis casos" hint="Estado del caso">
        <div className="tutor-case-filters">
          {["Todos", "Abierto", "En curso", "Cerrado"].map((value) => <button type="button" key={value} className={filter === value ? "active" : ""} onClick={() => setFilter(value)} aria-pressed={filter === value}>{value === "Abierto" ? "Abiertos" : value === "Cerrado" ? "Cerrados" : value}</button>)}
        </div>
        <div className="reference-board-table-wrap">
          <table className="tutor-cases-table">
            <thead><tr>{columns.map((column) => <th scope="col" key={column.key}>{column.title}</th>)}</tr></thead>
            <tbody>{filtered.map((item) => <tr key={item.id} className={item.id === selected.id ? "selected" : ""} onClick={() => chooseCase(item)}>
              <td>{item.id}</td>
              <td><span className="tutor-case-person"><Avatar initials={item.applicant.initials} size="small" />{item.applicant.name}</span></td>
              <td>{item.medium}</td>
              <td><Status tone={item.result.toLowerCase().includes("sin respuesta") ? "warning" : "success"}>{item.result}</Status></td>
              <td>{item.state}</td>
            </tr>)}</tbody>
          </table>
        </div>
      </Section>
      <Section marker="2" title={`Detalle del caso ${selected.id}`} hint={selected.applicant.name}>
        <div className="tutor-followup-fields">
          <label className="reference-board-field">Resultado del contacto<textarea rows="3" value={draft.result} onChange={update("result")} /></label>
          <label className="reference-board-field">Compromisos adquiridos<textarea rows="3" value={draft.commitment} onChange={update("commitment")} /></label>
          <label className="reference-board-field">Observaciones y recomendaciones<textarea rows="3" value={draft.notes} onChange={update("notes")} /></label>
          <label className="reference-board-field">Próxima acción<input value={draft.next} onChange={update("next")} placeholder="Ej.: llamar el 21/11" /></label>
        </div>
        <button type="button" className="reference-board-primary-action tutor-save-case" onClick={save}><Check size={16} /> Guardar cambios</button>
      </Section>
    </Screen>
  );
}
