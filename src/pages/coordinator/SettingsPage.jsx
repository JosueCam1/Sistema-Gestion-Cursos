import { useState } from 'react';
import { ArrowRight, Download, FileBarChart2, FileText, MessageCircle, Plus, UserRound, Users } from 'lucide-react';
import { Screen, Section, SidePanel, DataTable, Status, Toggle } from '../../components/board/BoardPrimitives.jsx';

export function SettingsReferencePage({ actions }) {
  const users = [
    ["MT", "M. Torres", "Tutor", "Activo"],
    ["CV", "C. Vega", "Tutor", "Activo"],
    ["C", "Coordinación", "Coordinador", "Activo"],
    ["RL", "R. León", "Tutor", "Inactivo"],
  ];
  return (
    <Screen
      className="reference-settings-view"
      title="Ajustes del sistema"
      subtitle="Usuarios, roles y parámetros"
      aside={
        <SidePanel title="Seguridad" subtitle="Acceso y datos">
          <Section marker="A" title="Autenticación">
            <Toggle label="Contraseña con verificación en dos pasos" checked />
            <Toggle label="Cierre de sesión por inactividad" checked />
          </Section>
          <Section marker="B" title="Documentos">
            <Toggle label="Almacenamiento cifrado" checked />
            <Toggle label="Copia de seguridad diaria" checked />
          </Section>
          <Section marker="C" title="Roles">
            <div className="reference-role-chips">
              {["Administrador", "Coordinador", "Tutor", "Postulante"].map(
                (role, index) => (
                  <button
                    key={role}
                    type="button"
                    className={index === 0 ? "active" : ""}
                    onClick={() =>
                      actions.notify(
                        `Rol ${role} seleccionado en la demostración.`,
                      )
                    }
                  >
                    {role}
                  </button>
                ),
              )}
            </div>
          </Section>
        </SidePanel>
      }
    >
      <Section marker="1" title="Usuarios y roles" hint="Control de acceso">
        <DataTable
          className="reference-settings-table"
          caption="Usuarios y roles"
          headings={["Usuario", "Rol", "Estado", "Acción"]}
          rows={users.map(([initials, name, role, state]) => [
            <span className="reference-row-person" key={initials}>
              <span>{initials}</span>
              {name}
            </span>,
            role,
            <Status tone={state === "Activo" ? "success" : "neutral"}>
              {state}
            </Status>,
            <button
              className="reference-edit-button"
              key={`${initials}-edit`}
              type="button"
              onClick={() => actions.notify(`Editando a ${name}.`)}
            >
              Editar
            </button>,
          ])}
        />
        <button
          className="reference-board-primary-action"
          type="button"
          onClick={() =>
            actions.showForm(
              "Invitar usuario",
              "Agrega un integrante y asigna su rol.",
              [
                { label: "Nombre", name: "nombre", required: true },
                {
                  label: "Correo",
                  name: "correo",
                  type: "email",
                  required: true,
                },
                {
                  label: "Rol",
                  name: "rol",
                  type: "select",
                  options: ["Tutor", "Coordinador", "Postulante"],
                },
              ],
            )
          }
        >
          <Plus size={14} /> Invitar usuario
        </button>
      </Section>
      <Section marker="2" title="Parámetros" hint="Valores por defecto">
        <div className="reference-settings-fields">
          <label>
            Plazo máximo (días)
            <input type="number" defaultValue="5" />
          </label>
          <label>
            Inactividad para riesgo alto (días)
            <input type="number" defaultValue="7" />
          </label>
          <label>
            Tamaño máx. de archivo (MB)
            <input type="number" defaultValue="10" />
          </label>
          <label>
            Formato de evidencias
            <select defaultValue="PDF">
              <option>PDF</option>
              <option>PDF o imagen</option>
            </select>
          </label>
        </div>
      </Section>
    </Screen>
  );
}
