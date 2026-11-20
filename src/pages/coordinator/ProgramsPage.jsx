import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Section,
  SidePanel,
  DataTable,
  Status,
  Toggle,
} from "../../components/board/BoardPrimitives.jsx";

const palette = ["#5d4393", "#00747c", "#ae367d", "#08774b"];

export function ProgramsReferencePage({ actions }) {
  const [programs, setPrograms] = useState([
    { id: 1, name: "MBA", students: 118, closes: "15 dic", color: palette[0] },
    { id: 2, name: "Ing. de Software", students: 104, closes: "20 dic", color: palette[1] },
    { id: 3, name: "Educación", students: 96, closes: "20 dic", color: palette[2] },
    { id: 4, name: "Finanzas", students: 94, closes: "10 dic", color: palette[3] },
  ]);
  const [rules, setRules] = useState([true, true, true, false]);
  const [draft, setDraft] = useState({ name: "", start: "2027-03-01", end: "2027-05-30" });
  const [selected, setSelected] = useState(null);

  const saveProgram = (event) => {
    event.preventDefault();
    const name = draft.name.trim();
    if (!name) return;
    if (draft.end < draft.start) {
      actions.notify("La fecha de cierre debe ser posterior al inicio.");
      return;
    }
    if (programs.some((program) => program.name.toLowerCase() === name.toLowerCase())) {
      actions.notify("Ya existe un programa con ese nombre.");
      return;
    }
    const closeDate = new Date(`${draft.end}T12:00:00`).toLocaleDateString("es-EC", { day: "2-digit", month: "short" });
    setPrograms((current) => [...current, {
      id: Date.now(), name, students: 0, closes: closeDate,
      color: palette[current.length % palette.length],
    }]);
    setDraft((current) => ({ ...current, name: "" }));
    actions.notify("Programa creado en esta demostración local.");
  };

  const calls = [
    ["2026-II", "MBA", "01 oct", "15 dic", "Abierta", "success"],
    ["2026-II", "Software", "01 oct", "20 dic", "Abierta", "success"],
    ["2026-I", "Finanzas", "01 mar", "10 jun", "Cerrada", "neutral"],
    ["2027-I", "Educación", "10 ene", "30 mar", "Programada", "warning"],
  ];

  return (
    <div className="reference-board-layout reference-programs-view">
      <article className="reference-board-main">
        <header className="reference-screen-heading">
          <h1>Programas y convocatorias</h1>
          <p>Crea programas, abre convocatorias y define fechas</p>
        </header>
      <Section marker="1" title="Programas de maestría" hint={`${programs.length} activos`}>
        <div className="reference-programs">
          {programs.map((program) => (
            <button className="reference-program" type="button" key={program.id} onClick={() => setSelected(program)} aria-pressed={selected?.id === program.id}>
              <span style={{ backgroundColor: program.color }}><strong>{program.students}</strong></span>
              <span className="reference-program-copy"><b>{program.name}</b><small>Cierre {program.closes}</small></span>
            </button>
          ))}
        </div>
        <button className="reference-create-course" type="button" onClick={() => document.getElementById("program-name")?.focus()}><Plus size={18} /> Crear programa</button>
      </Section>
      <Section marker="2" title="Convocatorias" hint="Fechas de inicio y cierre">
        <DataTable caption="Convocatorias" headings={["Convocatoria", "Programa", "Inicio", "Cierre", "Estado"]} className="reference-programs-table" rows={calls.map(([call, program, start, end, state, tone]) => [call, program, start, end, <Status tone={tone} key={call + program}>{state}</Status>])} />
      </Section>
      </article>
      <aside className="reference-board-aside">
      <SidePanel title="Nuevo programa" subtitle="Configuración rápida">
        <form onSubmit={saveProgram}>
          <Section marker="A" title="Datos básicos">
            <label className="reference-board-field" htmlFor="program-name">Nombre del programa
              <input id="program-name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Ej.: Maestría en Datos" required />
            </label>
            <div className="reference-program-dates">
              <label className="reference-board-field">Fecha de inicio<input type="date" value={draft.start} onChange={(event) => setDraft({ ...draft, start: event.target.value })} required /></label>
              <label className="reference-board-field">Fecha de cierre<input type="date" value={draft.end} onChange={(event) => setDraft({ ...draft, end: event.target.value })} required /></label>
            </div>
          </Section>
          <Section marker="B" title="Requisitos de aprobación">
            {["Todas las evidencias aprobadas", "Proyectos entregados a tiempo", "Nota mínima 70%", "Documentos personales completos"].map((label, index) => <Toggle key={label} label={label} checked={rules[index]} onChange={() => setRules((current) => current.map((value, i) => i === index ? !value : value))} />)}
            <button className="reference-board-primary-action" type="submit">Guardar programa</button>
          </Section>
        </form>
      </SidePanel>
      </aside>
    </div>
  );
}
