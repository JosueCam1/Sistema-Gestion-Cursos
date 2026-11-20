import { MetricCard } from "../../components/coordinator/MetricCard.jsx";
import { Pill, TableWrap } from "../../components/ui.jsx";

export function ExecutiveDashboardPage({ actions }) {
  return (
      <div className="page-grid reference-grid">
        <section className="primary-column">
          <article className="reference-panel">
            <header className="reference-panel-head">
              <h1>Panel ejecutivo</h1>
              <p>Coordinador · Convocatoria 2026-II · datos de ejemplo</p>
            </header>
            <section
              className="reference-section"
              aria-labelledby="overview-title"
            >
              <div className="reference-section-title">
                <span>1</span>
                <h2 id="overview-title">Resumen general</h2>
                <small>
                  Tiempo real · toca un indicador para ver el detalle
                </small>
              </div>
              <div className="reference-stats">
                <MetricCard
                  label="Postulantes"
                  value={412}
                  tone="neutral"
                  onClick={() => actions.navigate("postulantes")}
                />
                <MetricCard
                  label="Aprobados"
                  value={96}
                  tone={96 / 412 >= 0.2 ? "success" : "warning"}
                  onClick={() => actions.navigate("postulantes")}
                />
                <MetricCard
                  label="En riesgo"
                  value={47}
                  tone={47 / 412 >= 0.1 ? "danger" : "warning"}
                  onClick={() => actions.navigate("alertas")}
                />
                <MetricCard
                  label="Cumplimiento"
                  value="68%"
                  tone="neutral"
                  onClick={() => actions.navigate("programas")}
                />
              </div>
              <div className="reference-stats reference-stats-secondary">
                <MetricCard
                  label="Cursos activos"
                  value={14}
                  tone="neutral"
                  onClick={() => actions.navigate("cursos")}
                />
                <MetricCard
                  label="Actividades pendientes"
                  value="1.208"
                  tone="neutral"
                  onClick={() => actions.navigate("cursos")}
                />
                <MetricCard
                  label="Seguimientos"
                  value={735}
                  tone="neutral"
                  onClick={() => actions.navigate("seguimiento")}
                />
                <MetricCard
                  label="Sin respuesta"
                  value={64}
                  tone="warning"
                  onClick={() => actions.navigate("seguimiento")}
                />
              </div>
            </section>
            <section
              className="reference-section"
              aria-labelledby="programs-title"
            >
              <div className="reference-section-title">
                <span>2</span>
                <h2 id="programs-title">Programas de maestría</h2>
                <small>Cumplimiento por programa · clic para administrar</small>
              </div>
              <div className="reference-programs">
                {[
                  {
                    name: "MBA",
                    students: 118,
                    atRisk: 9,
                    completed: 87,
                    color: "#5E4396",
                  },
                  {
                    name: "Ing. de Software",
                    students: 104,
                    atRisk: 14,
                    completed: 63,
                    color: "#00717C",
                  },
                  {
                    name: "Educación",
                    students: 96,
                    atRisk: 17,
                    completed: 50,
                    color: "#B03A80",
                  },
                  {
                    name: "Finanzas",
                    students: 94,
                    atRisk: 7,
                    completed: 74,
                    color: "#087548",
                  },
                ].map((program) => {
                  const progress = Math.round(
                    (program.completed / program.students) * 100,
                  );
                  return (
                    <article className="reference-program" key={program.name}>
                      <div style={{ backgroundColor: program.color }}>
                        <strong>{progress}%</strong>
                      </div>
                      <section>
                        <h3>{program.name}</h3>
                        <p>
                          {program.students} postulantes · {program.atRisk} en
                          riesgo
                        </p>
                        <progress
                          max="100"
                          value={progress}
                          aria-label={`Cumplimiento ${program.name}: ${progress}%`}
                        />
                      </section>
                      <button
                        className="reference-program-open"
                        type="button"
                        aria-label={`Abrir programas para ${program.name}`}
                        onClick={() => actions.navigate("programas")}
                      />
                    </article>
                  );
                })}
              </div>
            </section>
            <section
              className="reference-section"
              aria-labelledby="attention-title"
            >
              <div className="reference-section-title">
                <span>3</span>
                <h2 id="attention-title">Postulantes que requieren atención</h2>
                <small>Ordenados por riesgo</small>
              </div>
              <TableWrap caption="Postulantes que requieren atención">
                <thead>
                  <tr>
                    <th scope="col">Postulante</th>
                    <th scope="col">Programa</th>
                    <th scope="col">Avance</th>
                    <th scope="col">Días</th>
                    <th scope="col">Tutor</th>
                    <th scope="col">Riesgo</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Ana Lucía Paredes", "MBA", "42%", 3, "M. Torres", "Alto"],
                    ["Diego Salazar", "Software", "38%", 5, "C. Vega", "Alto"],
                    [
                      "Karla Mena",
                      "Educación",
                      "61%",
                      10,
                      "M. Torres",
                      "Medio",
                    ],
                  ].map((row) => (
                    <tr key={row[0]}>
                      <th scope="row">{row[0]}</th>
                      <td>{row[1]}</td>
                      <td>{row[2]}</td>
                      <td>{row[3]}</td>
                      <td>{row[4]}</td>
                      <td>
                        <Pill tone={row[5] === "Alto" ? "high" : "medium"}>
                          {row[5]}
                        </Pill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TableWrap>
            </section>
          </article>
        </section>
        <aside className="support-column reference-aside">
          <section className="reference-panel">
            <header className="reference-panel-head">
              <h2>Atención hoy</h2>
              <p>Lo urgente, en un vistazo</p>
            </header>
            <section className="reference-section">
              <div className="reference-aside-title">
                <span>A</span>
                <h3>Semáforo de riesgo</h3>
              </div>
              <div className="reference-risk-chips">
                {[
                  ["Alto", 11, "high"],
                  ["Medio", 36, "medium"],
                  ["Bajo", 365, "low"],
                ].map(([label, count, tone]) => (
                  <button
                    key={label}
                    className={"reference-risk-chip " + tone}
                    type="button"
                    onClick={() => actions.navigate("alertas")}
                  >
                    {label} · {count}
                  </button>
                ))}
              </div>
            </section>
            <section className="reference-section">
              <div className="reference-aside-title">
                <span>B</span>
                <h3>Vencimientos próximos</h3>
              </div>
              <div className="reference-deadlines">
                {[
                  [15, 40, "neutral"],
                  [10, 28, "neutral"],
                  [5, 17, "warning"],
                  [3, 9, "danger"],
                  [1, 4, "danger"],
                ].map(([days, count, tone]) => (
                  <button
                    className={"reference-deadline " + tone}
                    key={days}
                    type="button"
                    aria-label={`${count} postulantes con vencimiento en ${days} días`}
                    onClick={() => actions.navigate("alertas")}
                  >
                    <span>{days} d</span>
                    <strong>{count}</strong>
                  </button>
                ))}
              </div>
            </section>
            <section className="reference-section">
              <div className="reference-aside-title">
                <span>C</span>
                <h3>Acciones rápidas</h3>
              </div>
              <div className="reference-quick-actions">
                <button
                  className="primary"
                  type="button"
                  onClick={() =>
                    actions.showForm(
                      "Enviar recordatorio masivo",
                      "Elige a quiénes enviar un recordatorio.",
                      [
                        {
                          label: "Destinatarios",
                          name: "destinatarios",
                          type: "select",
                          options: [
                            "Postulantes con vencimiento en 3 días",
                            "Postulantes sin respuesta",
                            "Todos los postulantes",
                          ],
                        },
                        {
                          label: "Mensaje",
                          name: "mensaje",
                          type: "textarea",
                          placeholder: "Escribe el recordatorio",
                          required: true,
                        },
                      ],
                    )
                  }
                >
                  Enviar recordatorio masivo
                </button>
                <button
                  type="button"
                  onClick={() =>
                    actions.showForm(
                      "Reasignar tutores",
                      "Selecciona el tutor y las personas que cambiarán de asignación.",
                      [
                        {
                          label: "Tutor actual",
                          name: "tutorActual",
                          type: "select",
                          options: ["M. Torres", "C. Vega", "R. León"],
                        },
                        {
                          label: "Nuevo tutor",
                          name: "nuevoTutor",
                          type: "select",
                          options: ["M. Torres", "C. Vega", "R. León"],
                        },
                        {
                          label: "Postulantes",
                          name: "postulantes",
                          type: "textarea",
                          placeholder: "Nombres o programa",
                        },
                      ],
                    )
                  }
                >
                  Reasignar tutores
                </button>
                <button type="button" onClick={actions.exportCsv}>
                  Exportar matriz (Excel / PDF)
                </button>
                <button
                  type="button"
                  onClick={() => actions.navigate("reportes")}
                >
                  Informe de trazabilidad
                </button>
              </div>
            </section>
            <section className="reference-section">
              <div className="reference-aside-title">
                <span>D</span>
                <h3>Actividad reciente</h3>
              </div>
              <ul className="reference-activity">
                <li>Evidencia aprobada, D. Salazar</li>
                <li>Alerta de 3 días enviada a 9 postulantes</li>
                <li>A. Paredes pasa a riesgo alto</li>
              </ul>
            </section>
          </section>
        </aside>
      </div>
    );
}