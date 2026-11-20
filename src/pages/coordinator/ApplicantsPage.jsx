import { useState } from 'react';
import { ArrowRight, Download, FileBarChart2, FileText, MessageCircle, Plus, UserRound, Users } from 'lucide-react';
import { Screen, Section, SidePanel, DataTable, Status, Toggle } from '../../components/board/BoardPrimitives.jsx';

export function ApplicantsReferencePage({ filters, actions }) {
  const [selected, setSelected] = useState("Ana Paredes");
  const rows = [
    [
      "AP",
      "Ana Paredes",
      "MBA",
      "02 oct",
      "22%",
      "M. Torres",
      ["Alto", "high"],
    ],
    [
      "DS",
      "Diego Salazar",
      "Software",
      "05 oct",
      "35%",
      "C. Vega",
      ["Alto", "high"],
    ],
    [
      "KM",
      "Karla Mena",
      "Educación",
      "08 oct",
      "48%",
      "M. Torres",
      ["Medio", "medium"],
    ],
    [
      "PO",
      "Pablo Ortiz",
      "Finanzas",
      "10 oct",
      "80%",
      "R. León",
      ["Bajo", "low"],
    ],
    [
      "JC",
      "Josué Camisan",
      "Software",
      "12 oct",
      "85%",
      "C. Vega",
      ["Bajo", "low"],
    ],
  ];
  const rowSelected = rows.find((row) => row[1] === selected) || rows[0];
  return (
    <Screen
      title="Postulantes"
      subtitle="Supervisa avance, tutor y riesgo"
      aside={
        <SidePanel
          title="Ficha rápida"
          subtitle={`${rowSelected[1]} · ${rowSelected[2]}`}
        >
          <Section marker="A" title="Estado">
            <Status tone={rowSelected[6][1]}>{rowSelected[6][0]}</Status>
            <p className="reference-board-note">
              Avance {rowSelected[4]} · quedan{" "}
              {rowSelected[3] === "02 oct" ? "3" : "5"} días · 2 documentos
              pendientes
            </p>
            <progress
              className="reference-board-progress"
              max="100"
              value={Number.parseInt(rowSelected[4], 10)}
            />
          </Section>
          <Section marker="B" title="Acciones">
            <div className="reference-board-actions">
              <button
                type="button"
                onClick={() =>
                  actions.showForm(
                    "Asignar tutor",
                    "Selecciona un tutor para el postulante.",
                    [
                      {
                        label: "Tutor",
                        name: "tutor",
                        type: "select",
                        options: ["M. Torres", "C. Vega", "R. León"],
                      },
                    ],
                  )
                }
              >
                Asignar o cambiar tutor
              </button>
              <button
                className="primary"
                type="button"
                onClick={() =>
                  actions.notify(`Mensaje preparado para ${rowSelected[1]}.`)
                }
              >
                Enviar mensaje
              </button>
              <button
                type="button"
                onClick={() =>
                  actions.notify(
                    "Reporte individual preparado en la demostración.",
                  )
                }
              >
                Reporte individual (PDF)
              </button>
              <button
                type="button"
                onClick={() => actions.notify("Abriendo historial completo.")}
              >
                Ver historial completo
              </button>
            </div>
          </Section>
        </SidePanel>
      }
    >
      <Section marker="1" title="Filtros" hint="412 resultados">
        <div className="reference-filter-chips">
          {[
            ["Todos", "Todos los riesgos"],
            ["Riesgo alto", "Alto"],
            ["Riesgo medio", "Medio"],
            ["Riesgo bajo", "Bajo"],
          ].map(([label, value]) => (
            <button
              key={label}
              type="button"
              className={filters.filterRisk === value ? "active" : ""}
              onClick={() => filters.setFilterRisk(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="reference-filter-fields">
          <label>
            Programa
            <select
              value={filters.filterProgram}
              onChange={(event) => filters.setFilterProgram(event.target.value)}
            >
              <option>Todos los programas</option>
              <option>MBA</option>
              <option>Ingeniería de Software</option>
              <option>Educación</option>
              <option>Finanzas</option>
            </select>
          </label>
          <label>
            Tutor
            <select defaultValue="Todos">
              <option>Todos</option>
              <option>M. Torres</option>
              <option>C. Vega</option>
              <option>R. León</option>
            </select>
          </label>
        </div>
      </Section>
      <Section
        marker="2"
        title="Lista de postulantes"
        hint="Clic para ver ficha"
      >
        <DataTable
          className="reference-applicants-table"
          caption="Postulantes de la convocatoria"
          headings={[
            "Postulante",
            "Programa",
            "Inscrito",
            "Avance",
            "Tutor",
            "Riesgo",
          ]}
          rows={rows.map((row) => [
            <button
              key={row[1]}
              className="reference-row-person"
              type="button"
              onClick={() => setSelected(row[1])}
            >
              <span>{row[0]}</span>
              {row[1]}
            </button>,
            row[2],
            row[3],
            row[4],
            row[5],
            <Status key={row[1] + "-risk"} tone={row[6][1]}>
              {row[6][0]}
            </Status>,
          ])}
        />
      </Section>
    </Screen>
  );
}
