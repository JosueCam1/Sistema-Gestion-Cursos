import { useState } from "react";
import { Download } from "lucide-react";
import { DataTable, Screen, Section, SidePanel, Status } from "../../components/board/BoardPrimitives.jsx";
import { applicants, followups } from "../../data/demoData.js";

const reportOptions = [
  { id: "individual", badge: "PDF", name: "Individual", detail: "Por postulante", color: "violet" },
  { id: "matrix", badge: "XLS", name: "Matriz de seguimiento", detail: "Excel o CSV", color: "teal" },
  { id: "trace", badge: "PDF", name: "Trazabilidad", detail: "PDF o Excel", color: "magenta" },
];

export function TutorReportsPage({ notify }) {
  const [reportId, setReportId] = useState("matrix");
  const [applicantId, setApplicantId] = useState("todos");
  const [from, setFrom] = useState("2026-11-01");
  const [to, setTo] = useState("2026-11-20");
  const [format, setFormat] = useState("Excel");
  const [recent, setRecent] = useState([
    { id: "matrix", name: "Matriz de mis postulantes", format: "Excel", date: "19 nov", applicantId: "todos" },
    { id: "individual", name: "Individual A. Paredes", format: "PDF", date: "18 nov", applicantId: "POS-0042" },
    { id: "trace", name: "Trazabilidad noviembre", format: "PDF", date: "15 nov", applicantId: "todos" },
  ]);
  const chosen = reportOptions.find((item) => item.id === reportId) ?? reportOptions[1];
  const generate = (reportIdOverride = reportId, formatOverride = format, applicantOverride = applicantId, record = true) => {
    if (from > to) return notify("La fecha inicial debe ser anterior a la fecha final.");
    const report = reportOptions.find((item) => item.id === reportIdOverride) ?? chosen;
    const selectedApplicants = applicants.filter((item) => applicantOverride === "todos" || item.id === applicantOverride);
    const rows = report.id === "trace"
      ? [["Postulante", "Medio", "Resultado", "Próxima acción"], ...followups.filter((item) => applicantOverride === "todos" || applicants.find((person) => person.name === item.person)?.id === applicantOverride).map((item) => [item.person, item.medium, item.result, item.next])]
      : [["Postulante", "Programa", "Avance", "Riesgo", "Días para plazo"], ...selectedApplicants.map((item) => [item.name, item.program, `${item.progress}%`, item.risk, item.days])];
    const reportName = report.id === "individual" ? `Individual ${selectedApplicants[0]?.name ?? "postulantes"}` : report.name;
    if (record) setRecent((current) => [{ id: report.id, name: reportName, format: formatOverride, date: new Date().toLocaleDateString("es-EC", { day: "2-digit", month: "short" }), applicantId: applicantOverride }, ...current].slice(0, 4));
    if (formatOverride === "PDF") {
      window.print();
      notify(`${report.name} listo para imprimir o guardar como PDF.`);
      return;
    }
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `${report.id}-tutoria.csv`; link.click(); URL.revokeObjectURL(url);
    notify(`${report.name} descargado como CSV para Excel.`);
  };

  return (
    <Screen className="reference-tutor-reports" title="Mis reportes" subtitle="Genera y exporta en un clic" aside={
      <SidePanel title="Filtros" subtitle="Antes de generar">
        <Section marker="A" title="Alcance">
          <label className="reference-board-field">Postulante<select value={applicantId} onChange={(event) => setApplicantId(event.target.value)}><option value="todos">Todos</option>{applicants.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <div className="tutor-report-dates">
            <label className="reference-board-field">Desde<input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></label>
            <label className="reference-board-field">Hasta<input type="date" value={to} onChange={(event) => setTo(event.target.value)} /></label>
          </div>
          <label className="reference-board-field">Formato<select value={format} onChange={(event) => setFormat(event.target.value)}><option>Excel</option><option>PDF</option></select></label>
          <button type="button" className="reference-board-primary-action tutor-report-generate" onClick={generate}>Generar reporte</button>
        </Section>
      </SidePanel>
    }>
      <Section marker="1" title="Generar reporte" hint="Elige formato">
        <div className="tutor-report-cards">{reportOptions.map((item) => <button type="button" key={item.id} className={`tutor-report-card ${item.color} ${reportId === item.id ? "selected" : ""}`} onClick={() => setReportId(item.id)} aria-pressed={reportId === item.id}>
          <span className="tutor-report-card-top"><strong>{item.badge}</strong></span>
          <span className="tutor-report-card-copy"><b>{item.name}</b><small>{item.detail}</small></span>
        </button>)}</div>
      </Section>
      <Section marker="2" title="Reportes recientes" hint={`Últimos ${recent.length}`}>
        <DataTable caption="Reportes recientes" headings={["Reporte", "Formato", "Fecha", "Acción"]} rows={recent.map((item, index) => [
          item.name,
          <Status key={`${item.name}-format`} tone={item.format === "PDF" ? "high" : "success"}>{item.format}</Status>,
          item.date,
          <button type="button" key={`${item.name}-${index}`} className="tutor-download-report" onClick={() => generate(item.id, item.format, item.applicantId, false)} aria-label={`Descargar ${item.name}`}><Download size={16} /> Descargar</button>,
        ])} />
      </Section>
    </Screen>
  );
}
