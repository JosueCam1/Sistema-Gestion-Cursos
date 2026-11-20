import { Button } from '../../components/ui/Button.jsx';
import { useState } from 'react';
import { ArrowRight, Download, FileBarChart2, FileText, MessageCircle, Plus, UserRound, Users } from 'lucide-react';
import { Screen, Section, SidePanel, DataTable, Status, Toggle } from '../../components/board/BoardPrimitives.jsx';

export function CoursesReferencePage({ actions }) {
  const palette = ["#00747c", "#5d4393", "#ae367d", "#08774b"];
  const [courseRows, setCourseRows] = useState([
    {
      id: "english",
      name: "Inglés",
      program: "MBA",
      detail: "4 actividades",
      weightKey: "Inglés",
      color: palette[0],
      deadline: "2026-12-01",
    },
    {
      id: "math",
      name: "Matemática",
      program: "Software",
      detail: "4 actividades",
      weightKey: "Mate",
      color: palette[1],
      deadline: "2026-12-10",
    },
    {
      id: "final",
      name: "Proyecto final",
      program: "Todos",
      detail: "2 entregas",
      weightKey: "Final",
      color: palette[2],
      deadline: "2026-12-15",
    },
  ]);
  const [selectedCourseId, setSelectedCourseId] = useState("math");
  const [draft, setDraft] = useState({
    name: "Matemática",
    program: "Ing. de Software",
    deadline: "2026-12-10",
    extensionDays: 5,
  });
  const [isCreating, setIsCreating] = useState(false);
  const [weights, setWeights] = useState({ Inglés: 30, Mate: 40, Final: 30 });
  const [activeWeight, setActiveWeight] = useState("Mate");
  const projects = [
    ["Diagnóstico", "Inglés", 15, "01 dic", "2026-12-01"],
    ["Propuesta", "Proyecto final", 30, "05 dic", "2026-12-05"],
    ["Certificado nivelación", "Matemática", 20, "10 dic", "2026-12-10"],
    ["Entrega final", "Proyecto final", 35, "15 dic", "2026-12-15"],
  ];
  const deadlineStatus = (iso) => {
    const target = new Date(iso + "T12:00:00");
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const days = Math.ceil((target - today) / 86400000);
    return days < 0
      ? ["reference-deadline-light danger", "Vencida"]
      : days <= 5
        ? ["reference-deadline-light danger", "Urgente"]
        : days <= 15
          ? ["reference-deadline-light warning", "Próxima"]
          : ["reference-deadline-light success", "En plazo"];
  };
  const totalWeight = Object.values(weights).reduce(
    (sum, value) => sum + Number(value || 0),
    0,
  );
  const selectCourse = (course) => {
    setSelectedCourseId(course.id);
    setIsCreating(false);
    setDraft({
      name: course.name,
      program:
        course.program === "Software" ? "Ing. de Software" : course.program,
      deadline: course.deadline,
      extensionDays: 5,
    });
    setActiveWeight(course.weightKey);
  };
  const updateDraft = (key, value) =>
    setDraft((current) => ({ ...current, [key]: value }));
  const createCourse = () => {
    setIsCreating(true);
    setSelectedCourseId("new");
    setDraft({
      name: "",
      program: "MBA",
      deadline: "2026-12-10",
      extensionDays: 5,
    });
  };
  const saveCourse = (event) => {
    event.preventDefault();
    const name = draft.name.trim();
    if (!name) {
      actions.notify("Escribe el nombre del curso.");
      return;
    }
    if (
      isCreating &&
      courseRows.some(
        (course) => course.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      actions.notify("Ya existe un curso con ese nombre.");
      return;
    }
    if (totalWeight !== 100) {
      actions.notify("Las ponderaciones deben sumar exactamente 100%.");
      return;
    }
    if (isCreating) {
      const item = {
        id: "course-" + Date.now(),
        name,
        program:
          draft.program === "Ing. de Software" ? "Software" : draft.program,
        detail: "0 actividades",
        weightKey: "Final",
        color: palette[courseRows.length % palette.length],
        deadline: draft.deadline,
      };
      setCourseRows((current) => [...current, item]);
      setSelectedCourseId(item.id);
      setActiveWeight("Final");
      setIsCreating(false);
    } else {
      setCourseRows((current) =>
        current.map((course) =>
          course.id === selectedCourseId
            ? {
                ...course,
                name,
                program:
                  draft.program === "Ing. de Software"
                    ? "Software"
                    : draft.program,
                deadline: draft.deadline,
              }
            : course,
        ),
      );
    }
    actions.notify(
      "Curso y configuración guardados en esta demostración local.",
    );
  };
  const updateWeight = (value) =>
    setWeights((current) => ({
      ...current,
      [activeWeight]: Math.max(0, Math.min(100, Number(value) || 0)),
    }));
  const selectedCourse = courseRows.find(
    (course) => course.id === selectedCourseId,
  );
  return (
    <div className="reference-board-layout reference-course-layout">
      <article className="reference-board-main">
        <header className="reference-screen-heading">
          <h1>Cursos preparatorios</h1>
          <p>Define cursos, proyectos y ponderaciones</p>
        </header>
        <Section
          marker="1"
          title="Cursos preparatorios"
          hint="Asignados por programa"
        >
          <div className="reference-course-cards">
            {courseRows.map((course) => (
              <button
                type="button"
                className={
                  "reference-course-card " +
                  (selectedCourseId === course.id ? "selected" : "")
                }
                key={course.id}
                onClick={() => selectCourse(course)}
                aria-pressed={selectedCourseId === course.id}
              >
                <span style={{ backgroundColor: course.color }}>
                  <strong>{weights[course.weightKey]}%</strong>
                </span>
                <span className="reference-course-card-copy">
                  <b>{course.name}</b>
                  <small>
                    {course.program} · {course.detail}
                  </small>
                </span>
              </button>
            ))}
          </div>
          <button
            className="reference-create-course"
            type="button"
            onClick={createCourse}
          >
            <Plus size={18} /> Nuevo curso
          </button>
        </Section>
        <Section marker="2" title="Proyectos y ponderaciones" hint="Suman 100%">
          <div className="reference-table-scroll">
            <table>
              <caption className="sr-only">Proyectos y ponderaciones</caption>
              <thead>
                <tr>
                  <th scope="col">Proyecto</th>
                  <th scope="col">Curso</th>
                  <th scope="col">Peso</th>
                  <th scope="col">Fecha límite</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(([project, course, weight, due, iso]) => (
                  <tr key={project}>
                    <td>{project}</td>
                    <td>
                      <button
                        type="button"
                        className="reference-project-course"
                        onClick={() => {
                          const match = courseRows.find(
                            (item) => item.name === course,
                          );
                          if (match) selectCourse(match);
                        }}
                      >
                        {course}
                      </button>
                    </td>
                    <td>{weight}%</td>
                    <td>
                      <span className="reference-deadline-cell">
                        {due}
                        <span className={deadlineStatus(iso)[0]}>
                          <i aria-hidden="true" />
                          {deadlineStatus(iso)[1]}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </article>
      <aside className="reference-board-side-panel reference-course-config">
        <header className="reference-screen-heading">
          <h2>{isCreating ? "Nuevo curso" : "Configurar curso"}</h2>
          <p>Plazos y pesos</p>
        </header>
        <form onSubmit={saveCourse}>
          <Section marker="A" title="Datos del curso">
            <label className="reference-board-field">
              Nombre del curso
              <input
                value={draft.name}
                onChange={(event) => updateDraft("name", event.target.value)}
                required
              />
            </label>
            <label className="reference-board-field">
              Programa
              <select
                value={draft.program}
                onChange={(event) => updateDraft("program", event.target.value)}
              >
                <option>MBA</option>
                <option>Ing. de Software</option>
                <option>Educación</option>
                <option>Finanzas</option>
                <option>Todos</option>
              </select>
            </label>
            <label className="reference-board-field">
              Fecha límite de cumplimiento
              <input
                type="date"
                value={draft.deadline}
                onChange={(event) =>
                  updateDraft("deadline", event.target.value)
                }
                required
              />
            </label>
          </Section>
          <Section marker="B" title="Ponderación">
            <div className="reference-weight-chips">
              {Object.entries(weights).map(([label, value]) => (
                <button
                  key={label}
                  type="button"
                  className={activeWeight === label ? "active" : ""}
                  aria-pressed={activeWeight === label}
                  onClick={() => setActiveWeight(label)}
                >
                  {label} {value}%
                </button>
              ))}
            </div>
            <label className="reference-weight-editor">
              Peso de {activeWeight}
              <span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={weights[activeWeight]}
                  onChange={(event) => updateWeight(event.target.value)}
                  aria-label={"Peso porcentual de " + activeWeight}
                />
                %
              </span>
            </label>
            <progress
              className="reference-weight-progress"
              max="100"
              value={Math.min(totalWeight, 100)}
              aria-label={"Suma de ponderaciones: " + totalWeight + "%"}
            />
            <p
              className={
                "reference-weight-note " +
                (totalWeight === 100 ? "valid" : "invalid")
              }
            >
              Total {totalWeight}%:{" "}
              {totalWeight === 100 ? "correcto" : "debe sumar 100%"}
            </p>
          </Section>
          <Section marker="C" title="Plazo máximo">
            <label className="reference-board-field">
              Días máximos de prórroga
              <input
                type="number"
                min="0"
                max="90"
                value={draft.extensionDays}
                onChange={(event) =>
                  updateDraft("extensionDays", event.target.value)
                }
              />
            </label>
            <Button variant="boardPrimary" type="submit">
              Guardar curso
            </Button>
          </Section>
        </form>
      </aside>
    </div>
  );
}
