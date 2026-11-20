import { useState } from 'react';
import { ArrowRight, Download, FileBarChart2, FileText, MessageCircle, Plus, UserRound, Users } from 'lucide-react';
import { Screen, Section, SidePanel, DataTable, Status, Toggle } from '../../components/board/BoardPrimitives.jsx';

export function ReportsReferencePage({ actions }) {
  const reports = [
    ["Matriz consolidada", "Excel", "19 nov", "Coordinación"],
    ["Trazabilidad MBA", "PDF", "18 nov", "M. Torres"],
    ["Individual A. Paredes", "PDF", "18 nov", "M. Torres"],
    ["Global 2026-II", "PDF", "15 nov", "Administrador"],
  ];
  return (
    <Screen
      className="reference-reports-view"
      title="Reportes"
      subtitle="Genera y exporta en un clic"
      aside={
        <SidePanel title="Filtros del reporte" subtitle="Antes de generar">
          <Section marker="A" title="Alcance">
            <label className="reference-board-field">
              Programa
              <select>
                <option>Todos</option>
                <option>MBA</option>
                <option>Software</option>
                <option>Educación</option>
              </select>
            </label>
            <label className="reference-board-field">
              Tutor
              <select>
                <option>Todos</option>
                <option>M. Torres</option>
                <option>C. Vega</option>
              </select>
            </label>
            <div className="reference-date-fields">
              <label className="reference-board-field">
                Desde
                <input type="date" defaultValue="2026-10-01" />
              </label>
              <label className="reference-board-field">
                Hasta
                <input type="date" defaultValue="2026-11-19" />
              </label>
            </div>
            <button
              className="reference-board-primary-action"
              type="button"
              onClick={() =>
                actions.notify("Reporte generado como demostración local.")
              }
            >
              Generar reporte
            </button>
          </Section>
          <Section marker="B" title="Envío programado">
            <Toggle label="Enviar matriz cada lunes" />
            <button
              className="reference-board-outline-action"
              type="button"
              onClick={() =>
                actions.showForm(
                  "Configurar envío",
                  "Define cuándo enviar el reporte.",
                  [
                    {
                      label: "Frecuencia",
                      name: "frecuencia",
                      type: "select",
                      options: ["Cada lunes", "Cada mes"],
                    },
                    {
                      label: "Destinatarios",
                      name: "destinatarios",
                      placeholder: "Correo institucional",
                    },
                  ],
                )
              }
            >
              Configurar envío
            </button>
          </Section>
        </SidePanel>
      }
    >
      <Section marker="1" title="Generar reporte" hint="Elige formato">
        <div className="reference-report-cards">
          {[
            ["PDF", "Individual", "Por postulante", "#5d4393"],
            ["XLS", "Matriz consolidada", "Excel o PDF", "#00747c"],
            ["PDF", "Trazabilidad", "PDF o Excel", "#ae367d"],
            ["ALL", "Global", "Indicadores", "#08774b"],
          ].map(([badge, title, detail, color]) => (
            <button
              key={title}
              className="reference-report-tile"
              type="button"
              onClick={() => actions.notify(`${title}: formato seleccionado.`)}
            >
              <span style={{ backgroundColor: color }}>
                <strong>{badge}</strong>
              </span>
              <span>
                <b>{title}</b>
                <small>{detail}</small>
              </span>
            </button>
          ))}
        </div>
      </Section>
      <Section marker="2" title="Reportes recientes" hint="Últimos 4">
        <DataTable
          className="reference-reports-table"
          caption="Reportes recientes"
          headings={["Reporte", "Formato", "Fecha", "Generado por"]}
          rows={reports}
        />
      </Section>
    </Screen>
  );
}
