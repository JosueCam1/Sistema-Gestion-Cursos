import { useMemo, useState } from "react";
import { Check, Plus } from "lucide-react";
import { Screen, Section, SidePanel, Status, Toggle } from "../../components/board/BoardPrimitives.jsx";

const palette = ["teal", "violet", "magenta", "green"];
const initialCourses = [
  { id: "english", name: "Inglés", progress: 80, completed: 3, total: 4, program: "Ing. de Software", color: palette[0] },
  { id: "math", name: "Matemática", progress: 50, completed: 2, total: 4, program: "Ing. de Software", color: palette[1] },
  { id: "final", name: "Proyecto final", progress: 45, completed: 1, total: 2, program: "Ing. de Software", color: palette[2] },
];
const initialActivities = [
  { id: 1, title: "Certificado de matemática", course: "math", courseName: "Matemática", due: "01 dic", status: "Rechazada", tone: "high" },
  { id: 2, title: "Proyecto 2: propuesta", course: "final", courseName: "Proyecto final", due: "05 dic", status: "Pendiente", tone: "neutral" },
  { id: 3, title: "Entrega final", course: "final", courseName: "Proyecto final", due: "15 dic", status: "Pendiente", tone: "neutral" },
];
const availableCourses = ["Estadística", "Lectura académica", "Metodología de investigación"];

export function ApplicantCoursesPage({ notify, actions }) {
  const [courses, setCourses] = useState(initialCourses);
  const [activities] = useState(initialActivities);
  const [selectedCourse, setSelectedCourse] = useState("todos");
  const [enrollCourse, setEnrollCourse] = useState(availableCourses[0]);
  const [requirements, setRequirements] = useState([true, false, true]);
  const enrolledNames = new Set(courses.map((item) => item.name));
  const choices = availableCourses.filter((name) => !enrolledNames.has(name));
  const visibleActivities = useMemo(() => selectedCourse === "todos" ? activities : activities.filter((item) => item.course === selectedCourse), [activities, selectedCourse]);
  const enroll = () => {
    if (!enrollCourse || enrolledNames.has(enrollCourse)) return notify("Selecciona un curso disponible para inscribirte.");
    const newCourse = { id: `course-${Date.now()}`, name: enrollCourse, progress: 0, completed: 0, total: 3, program: "Ing. de Software", color: palette[courses.length % palette.length] };
    setCourses((current) => [...current, newCourse]);
    setSelectedCourse(newCourse.id);
    notify(`Solicitud de inscripción a ${enrollCourse} registrada localmente.`);
  };

  return (
    <Screen className="reference-applicant-courses" title="Mis cursos preparatorios" subtitle="Maestría en Ingeniería de Software · 2026-II" aside={
      <SidePanel title="Inscripción" subtitle="Programa y curso">
        <Section marker="A" title="Inscribirme">
          <label className="reference-board-field">Programa de maestría<input value="Ing. de Software" readOnly /></label>
          <label className="reference-board-field applicant-course-enroll-field">Curso preparatorio asignado<select value={enrollCourse} onChange={(event) => setEnrollCourse(event.target.value)}>{choices.length ? choices.map((name) => <option key={name}>{name}</option>) : <option value="">No hay cursos disponibles</option>}</select></label>
          <button type="button" className="reference-board-primary-action applicant-enroll-button" onClick={enroll}><Plus size={16} /> Inscribirme a otro curso</button>
        </Section>
        <Section marker="B" title="Requisitos de aprobación">
          {["Evidencias aprobadas", "Proyectos entregados", "Documentos personales completos"].map((label, index) => <Toggle key={label} label={label} checked={requirements[index]} onChange={() => setRequirements((current) => current.map((value, i) => i === index ? !value : value))} />)}
        </Section>
      </SidePanel>
    }>
      <Section marker="1" title="Mis cursos" hint="Toca un curso para abrirlo">
        <div className="applicant-course-cards">
          {courses.map((course) => <button type="button" key={course.id} className={`applicant-course-card ${course.color} ${selectedCourse === course.id ? "selected" : ""}`} onClick={() => setSelectedCourse(selectedCourse === course.id ? "todos" : course.id)} aria-pressed={selectedCourse === course.id}>
            <span className="applicant-course-card-top"><strong>{course.progress}%</strong></span>
            <span className="applicant-course-card-copy"><b>{course.name}</b><small>{course.completed} de {course.total} actividades</small><span className="applicant-course-progress"><i style={{ width: `${course.progress}%` }} /></span></span>
          </button>)}
        </div>
      </Section>
      <Section marker="2" title="Actividades pendientes" hint="Ordenadas por fecha">
        <div className="reference-board-table-wrap">
          <table className="applicant-course-activities"><thead><tr><th>Actividad</th><th>Curso</th><th>Límite</th><th>Estado</th><th><span className="sr-only">Acción</span></th></tr></thead>
            <tbody>{visibleActivities.map((activity) => <tr key={activity.id}><td>{activity.title}</td><td>{activity.courseName}</td><td>{activity.due}</td><td><Status tone={activity.tone}>{activity.status}</Status></td><td><button type="button" className={activity.status === "Rechazada" ? "applicant-reupload-action" : "applicant-upload-action"} onClick={() => actions?.navigate("evidencias")}>{activity.status === "Rechazada" ? "Volver a cargar" : "Subir"}</button></td></tr>)}</tbody>
          </table>
          {visibleActivities.length === 0 && <p className="applicant-empty-state"><Check size={17} /> No hay actividades pendientes en este curso.</p>}
        </div>
      </Section>
    </Screen>
  );
}
