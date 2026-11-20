import { useState } from 'react';
import { ArrowRight, Download, FileBarChart2, FileText, MessageCircle, Plus, UserRound, Users } from 'lucide-react';
import { Screen, Section, SidePanel, DataTable, Status, Toggle } from '../../components/board/BoardPrimitives.jsx';

export function AuditReferencePage({ actions }) {
  const logs = [
    ["19 nov 10:42", "M. Torres", "Tutor", "Aprobó evidencia", "Evidencias"],
    ["19 nov 10:30", "M. Torres", "Tutor", "Registró llamada", "Seguimiento"],
    ["19 nov 09:12", "Sistema", "Auto", "Cambió riesgo a alto", "Alertas"],
    ["18 nov 17:05", "Coordinación", "Coord.", "Editó fecha límite", "Cursos"],
  ];
  return (
    <Screen
      className="reference-audit-view"
      title="Bitácora de auditoría"
      subtitle="Historial completo de acciones del sistema"
      aside={
        <SidePanel title="Resumen" subtitle="Hoy">
          <Section marker="A" title="Actividad">
            <div className="reference-summary-cards compact">
              <div>
                <strong>128</strong>
                <span>Acciones</span>
              </div>
              <div>
                <strong>46</strong>
                <span>Accesos</span>
              </div>
            </div>
          </Section>
          <Section marker="B" title="Exportar">
            <div className="reference-board-actions">
              <button
                className="reference-export-excel"
                type="button"
                onClick={() => actions.notify("Bitácora de Excel preparada.")}
              >
                Bitácora en Excel
              </button>
              <button
                className="reference-export-pdf"
                type="button"
                onClick={() => actions.notify("Bitácora PDF preparada.")}
              >
                Bitácora en PDF
              </button>
            </div>
          </Section>
        </SidePanel>
      }
    >
      <Section marker="1" title="Filtros" hint="1.482 registros">
        <div className="reference-filter-fields">
          <label>
            Usuario
            <select>
              <option>Todos</option>
              <option>M. Torres</option>
              <option>C. Vega</option>
              <option>Sistema</option>
            </select>
          </label>
          <label>
            Módulo
            <select>
              <option>Todos</option>
              <option>Evidencias</option>
              <option>Seguimiento</option>
              <option>Alertas</option>
              <option>Cursos</option>
            </select>
          </label>
        </div>
      </Section>
      <Section marker="2" title="Registro de acciones" hint="Más recientes">
        <DataTable
          className="reference-audit-table"
          caption="Registro de acciones"
          headings={["Fecha", "Usuario", "Rol", "Acción", "Módulo"]}
          rows={logs}
        />
      </Section>
    </Screen>
  );
}
