import { useState } from 'react';
import { ArrowRight, Download, FileBarChart2, FileText, MessageCircle, Plus, UserRound, Users } from 'lucide-react';
import { Screen, Section, SidePanel, DataTable, Status, Toggle } from '../../components/board/BoardPrimitives.jsx';

export function FollowupsReferencePage({ actions }) {
  const recent = [
    [
      "0042",
      "19 nov",
      "M. Torres",
      "Llamada",
      ["Sin respuesta", "warning"],
      "Abierto",
    ],
    [
      "0041",
      "18 nov",
      "C. Vega",
      "WhatsApp",
      ["Respondió", "success"],
      "En curso",
    ],
    [
      "0040",
      "18 nov",
      "R. León",
      "Correo",
      ["Respondió", "success"],
      "Cerrado",
    ],
    [
      "0039",
      "17 nov",
      "M. Torres",
      "Videoconferencia",
      ["Compromiso", "success"],
      "En curso",
    ],
  ];
  return (
    <Screen
      className="reference-followups-view"
      title="Seguimientos"
      subtitle="Supervisa el trabajo de los tutores"
      aside={
        <SidePanel title="Carga por tutor" subtitle="Seguimientos y pendientes">
          <Section marker="A" title="Tutores">
            <div className="reference-load-bars">
              {[
                ["M. Torres · 24", 80],
                ["C. Vega · 19", 62],
                ["R. León · 14", 46],
              ].map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <progress max="100" value={value} />
                </div>
              ))}
            </div>
          </Section>
          <Section marker="B" title="Sin respuesta" hint="Reintentar">
            <DataTable
              className="reference-followups-unanswered"
              caption="Postulantes sin respuesta"
              headings={["Postulante", "Intentos"]}
              rows={[
                ["Ana Paredes", "3"],
                ["Luis Andrade", "2"],
              ]}
            />
            <button
              className="reference-board-primary-action"
              type="button"
              onClick={() =>
                actions.notify(
                  "Solicitud de reintento enviada como demostración.",
                )
              }
            >
              Pedir reintento al tutor
            </button>
          </Section>
        </SidePanel>
      }
    >
      <Section marker="1" title="Resumen" hint="Este mes">
        <div className="reference-summary-cards">
          <div>
            <strong>735</strong>
            <span>Realizados</span>
          </div>
          <div className="warning">
            <strong>64</strong>
            <span>Sin respuesta</span>
          </div>
          <div>
            <strong>38</strong>
            <span>Reintentos hoy</span>
          </div>
          <div className="success">
            <strong>92%</strong>
            <span>Con próxima acción</span>
          </div>
        </div>
      </Section>
      <Section marker="2" title="Seguimientos recientes" hint="Trazabilidad">
        <DataTable
          className="reference-followups-table"
          caption="Seguimientos recientes"
          headings={[
            "N.º",
            "Fecha",
            "Responsable",
            "Medio",
            "Resultado",
            "Estado",
          ]}
          rows={recent.map((row) => [
            row[0],
            row[1],
            row[2],
            row[3],
            <Status key={row[0]} tone={row[4][1]}>
              {row[4][0]}
            </Status>,
            row[5],
          ])}
        />
      </Section>
    </Screen>
  );
}
