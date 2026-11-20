import * as shared from "./shared.jsx";
const {
  Pill,
} = shared;

function StudentProgressPage({ fileName, onFile, actions }) {
  const courses = [
    ["Inglés", 80, "3 de 4 actividades", "#00747c"],
    ["Matemática", 50, "2 de 4 actividades", "#5d4393"],
    ["Proyecto final", 45, "1 de 2 entregas", "#ae367d"],
  ];
  const activities = [
    ["Certificado de inglés (PDF)", "30 nov", "Aprobada", "success", ""],
    ["Proyecto 1: diagnóstico", "01 dic", "En revisión", "warning", ""],
    [
      "Certificado de matemática (PDF)",
      "01 dic",
      "Rechazada",
      "danger",
      "Volver a cargar",
    ],
    ["Proyecto 2: propuesta", "05 dic", "Pendiente", "neutral", "Subir"],
  ];

  return (
    <div className="reference-board-layout reference-student-layout">
      <article className="reference-board-main">
        <header className="reference-screen-heading">
          <h1>Hola, Josué</h1>
          <p>Maestría en Ingeniería de Software · Convocatoria 2026-II</p>
        </header>
        <section className="reference-board-section">
          <div className="reference-board-section-heading">
            <span>1</span>
            <h2>Estado general</h2>
            <small>Quedan 12 días</small>
          </div>
          <div className="student-progress-summary">
            <div
              className="student-progress-ring"
              role="img"
              aria-label="Avance general del 62 por ciento"
            >
              <strong>62%</strong>
            </div>
            <div className="student-progress-copy">
              <h3>En curso · 5 de 8 actividades completadas</h3>
              <div className="student-process-steps">
                {[
                  ["Registro", "success"],
                  ["Inscripción", "success"],
                  ["Evidencias", "warning"],
                  ["Revisión", "neutral"],
                  ["Aprobación", "neutral"],
                ].map(([label, tone]) => (
                  <span className={tone} key={label}>
                    {label}
                  </span>
                ))}
              </div>
              <Pill tone="low" dot>
                Riesgo bajo
              </Pill>
            </div>
          </div>
        </section>
        <section className="reference-board-section">
          <div className="reference-board-section-heading">
            <span>2</span>
            <h2>Mis cursos preparatorios</h2>
            <small>Toca un curso para abrirlo</small>
          </div>
          <div className="student-course-cards">
            {courses.map(([name, progress, detail, color]) => (
              <button
                type="button"
                key={name}
                className="student-course-tile"
                onClick={() => actions.navigate("mis-cursos")}
                aria-label={`Abrir ${name}, ${progress}% de avance`}
              >
                <span
                  className="student-course-color"
                  style={{ backgroundColor: color }}
                >
                  <strong>{progress}%</strong>
                </span>
                <span className="student-course-copy">
                  <b>{name}</b>
                  <small>{detail}</small>
                  <progress
                    max="100"
                    value={progress}
                    aria-label={`Avance ${name}: ${progress}%`}
                  />
                </span>
              </button>
            ))}
          </div>
        </section>
        <section className="reference-board-section student-activities-section">
          <div className="reference-board-section-heading">
            <span>3</span>
            <h2>Mis actividades</h2>
            <small>Con fecha límite</small>
          </div>
          <div className="reference-board-table-wrap student-activity-table">
            <table>
              <caption className="sr-only">Actividades y estados</caption>
              <thead>
                <tr>
                  <th scope="col">Actividad</th>
                  <th scope="col">Límite</th>
                  <th scope="col">Estado</th>
                  <th scope="col">
                    <span className="sr-only">Acción</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {activities.map(([title, due, state, tone, action]) => (
                  <tr key={title}>
                    <td>{title}</td>
                    <td>{due}</td>
                    <td>
                      <span className={`student-status ${tone}`}>{state}</span>
                    </td>
                    <td>
                      {action && (
                        <button
                          type="button"
                          className={
                            action === "Subir"
                              ? "student-upload-action"
                              : "student-reupload-action"
                          }
                          onClick={() => actions.navigate("evidencias")}
                        >
                          {action}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </article>
      <aside className="reference-board-side-panel student-support-panel">
        <header className="reference-screen-heading">
          <h2>Tu acompañamiento</h2>
          <p>Plazos, tutor y avisos</p>
        </header>
        <section className="reference-board-section">
          <div className="reference-board-section-heading">
            <span>A</span>
            <h2>Cargar evidencia</h2>
          </div>
          <label className="student-upload-drop">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.zip,.ppt,.pptx"
              onChange={(event) => onFile(event.target.files?.[0]?.name || "")}
            />
            <span>{fileName || "Arrastra tu PDF o proyecto aquí (máx. 10 MB)"}</span>
          </label>
          <p className="student-feedback">
            Tutor: el certificado de matemática no es legible, súbelo de nuevo.
          </p>
        </section>
        <section className="reference-board-section">
          <div className="reference-board-section-heading">
            <span>B</span>
            <h2>Alertas de plazo</h2>
          </div>
          <div className="student-deadline-chips">
            {[
              ["15 ✓", "neutral"],
              ["10 ✓", "neutral"],
              ["5 · próxima", "warning"],
              ["3", "neutral"],
              ["1", "neutral"],
            ].map(([label, tone]) => (
              <span key={label} className={tone}>
                {label}
              </span>
            ))}
          </div>
          <button
            className="student-support-button"
            type="button"
            onClick={() =>
              actions.showForm(
                "Añadir plazos a mi calendario",
                "Elige qué recordatorios quieres añadir.",
                [
                  {
                    label: "Plazo",
                    name: "plazo",
                    type: "select",
                    options: [
                      "Todos mis plazos",
                      "Certificado de matemática",
                      "Proyecto 2: propuesta",
                    ],
                  },
                  {
                    label: "Recordatorio",
                    name: "recordatorio",
                    type: "select",
                    options: ["5 días antes", "3 días antes", "1 día antes"],
                  },
                ],
              )
            }
          >
            Añadir plazos a mi calendario
          </button>
        </section>
        <section className="reference-board-section">
          <div className="reference-board-section-heading">
            <span>C</span>
            <h2>Mi tutor</h2>
          </div>
          <p className="student-tutor-caption">M. Torres · tutora asignada</p>
          <div className="student-support-actions">
            <button
              className="primary"
              type="button"
              onClick={() =>
                actions.showForm(
                  "Escribir por WhatsApp",
                  "Prepara tu mensaje para M. Torres.",
                  [
                    {
                      label: "Mensaje",
                      name: "mensaje",
                      type: "textarea",
                      placeholder: "Escribe tu consulta",
                      required: true,
                    },
                  ],
                )
              }
            >
              Escribir por WhatsApp
            </button>
            <button
              type="button"
              onClick={() =>
                actions.showForm(
                  "Agendar videoconferencia",
                  "Solicita una reunión con tu tutora.",
                  [
                    { label: "Fecha", name: "fecha", type: "date", required: true },
                    { label: "Hora", name: "hora", type: "time", required: true },
                  ],
                )
              }
            >
              Agendar videoconferencia
            </button>
          </div>
        </section>
        <section className="reference-board-section">
          <div className="reference-board-section-heading">
            <span>D</span>
            <h2>Notificaciones</h2>
          </div>
          <button
            className="student-notification-link"
            type="button"
            onClick={() => actions.navigate("avisos")}
          >
            Evidencia rechazada: matemática
          </button>
          <button
            className="student-notification-link"
            type="button"
            onClick={() => actions.navigate("avisos")}
          >
            Documentación cargada correctamente
          </button>
        </section>
      </aside>
    </div>
  );
}

export function ProgressOverviewPage({ fileName, onFile, actions, notify, showForm }) {
  const localActions = actions || {
    navigate: () => {},
    notify,
    showForm,
  };
  return <StudentProgressPage fileName={fileName} onFile={onFile} actions={localActions} />;
}
