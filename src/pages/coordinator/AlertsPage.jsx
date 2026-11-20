import { useState } from 'react';
import { ArrowRight, Download, FileBarChart2, FileText, MessageCircle, Plus, UserRound, Users } from 'lucide-react';
import { Screen, Section, SidePanel, DataTable, Status, Toggle } from '../../components/board/BoardPrimitives.jsx';

export function AlertsReferencePage({ actions }) {
  const alertRows = [
    ["Ana Paredes", "Sin actividad 9 días", ["Alto", "high"]],
    ["Diego Salazar", "No carga evidencias", ["Alto", "high"]],
    ["Karla Mena", "Bajo avance", ["Medio", "medium"]],
  ];
  const rules = [
    "Alto: sin actividad en 7 días",
    "Alto: no responde comunicaciones",
    "Alto: no carga evidencias",
    "Medio: actividades pendientes",
    "Medio: bajo avance",
  ];
  return (
    <Screen
      className="reference-alerts-view"
      title="Alertas de riesgo"
      subtitle="Semáforo y reglas automáticas"
      aside={
        <SidePanel title="Avisos por correo" subtitle="Antes del vencimiento">
          <Section marker="A" title="Días de aviso">
            {[
              [15, 40],
              [10, 28],
              [5, 17],
              [3, 9],
              [1, 4],
            ].map(([day, count]) => (
              <Toggle
                key={day}
                label={`${day} días · ${count} postulantes`}
                checked
              />
            ))}
          </Section>
          <Section marker="B" title="Plantilla">
            <label className="reference-board-field">
              Asunto
              <input defaultValue="Tu plazo vence pronto" />
            </label>
            <button
              className="reference-board-primary-action"
              type="button"
              onClick={() =>
                actions.showForm(
                  "Editar aviso",
                  "Personaliza el mensaje de recordatorio.",
                  [
                    {
                      label: "Asunto",
                      name: "asunto",
                      defaultValue: "Tu plazo vence pronto",
                      required: true,
                    },
                    {
                      label: "Mensaje",
                      name: "mensaje",
                      type: "textarea",
                      required: true,
                    },
                  ],
                )
              }
            >
              Editar mensaje
            </button>
          </Section>
        </SidePanel>
      }
    >
      <Section marker="1" title="Semáforo" hint="412 postulantes">
        <div className="reference-risk-cards">
          <div className="high">
            <strong>11</strong>
            <span>Riesgo alto</span>
          </div>
          <div className="medium">
            <strong>36</strong>
            <span>Riesgo medio</span>
          </div>
          <div className="low">
            <strong>365</strong>
            <span>Riesgo bajo</span>
          </div>
        </div>
      </Section>
      <Section
        marker="2"
        title="Reglas automáticas"
        hint="Activar o desactivar"
      >
        {rules.map((rule, index) => (
          <Toggle key={rule} label={rule} checked={index !== 4} />
        ))}
      </Section>
      <Section marker="3" title="Alertas activas" hint="Más urgentes">
        <DataTable
          className="reference-alerts-table"
          caption="Alertas activas"
          headings={["Postulante", "Motivo", "Nivel"]}
          rows={alertRows.map((row) => [
            row[0],
            row[1],
            <Status key={row[0]} tone={row[2][1]}>
              {row[2][0]}
            </Status>,
          ])}
        />
      </Section>
    </Screen>
  );
}
