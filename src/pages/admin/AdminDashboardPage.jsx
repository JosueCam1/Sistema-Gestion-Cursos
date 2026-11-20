import { Activity, AlertTriangle, ArrowRight, Database, ShieldCheck, UserPlus, Users } from "lucide-react";
import { Screen, Section, SidePanel, Status, DataTable } from "../../components/board/BoardPrimitives.jsx";

const access = [["Coordinación", 4, 22], ["Tutoría", 12, 58], ["Postulantes", 96, 86], ["Administración", 2, 18]];
const events = [["10:42", "M. Torres", "Aprobó evidencia", "Evidencias"], ["10:30", "C. Vega", "Registró seguimiento", "Seguimiento"], ["09:12", "Sistema", "Actualizó nivel de riesgo", "Alertas"], ["Ayer · 17:05", "Coordinación", "Editó fecha límite", "Cursos"]];

export function AdminDashboardPage({ actions }) {
  return <Screen className="reference-admin-dashboard" title="Administración del portal" subtitle="Control general, accesos y operación" aside={<SidePanel title="Salud del sistema" subtitle="Estado de los servicios">
    <Section marker="A" title="Servicios">
      {[["API académica", "Operativa", "success"], ["Correo institucional", "Operativo", "success"], ["Almacenamiento", "Conectado", "success"], ["Último respaldo", "Hoy · 02:00", "neutral"]].map(([label, value, tone]) => <div className="admin-service-row" key={label}><span>{label}</span><Status tone={tone}>{value}</Status></div>)}
    </Section>
    <Section marker="B" title="Acciones administrativas">
      <button className="reference-board-primary-action" type="button" onClick={() => actions.showForm("Invitar usuario", "Agrega una cuenta y define su acceso.", [{ label: "Nombre completo", name: "nombre", required: true }, { label: "Correo institucional", name: "correo", type: "email", required: true }, { label: "Rol", name: "rol", type: "select", options: ["Coordinador", "Tutor", "Postulante", "Administrador"] }], () => actions.notify("Invitación preparada en la demostración local."))}><UserPlus size={16}/> Invitar usuario</button>
      <button className="reference-board-outline-action" type="button" onClick={() => actions.navigate("usuarios")}>Gestionar cuentas <ArrowRight size={15}/></button>
      <button className="reference-board-outline-action" type="button" onClick={() => actions.notify("Respaldo local generado en la demostración.")}><Database size={15}/> Crear respaldo</button>
    </Section>
  </SidePanel>}>
    <Section marker="1" title="Resumen general" hint="Datos de la plataforma">
      <div className="admin-metric-grid">{[["114", "Usuarios activos", Users, "blue"], ["4", "Roles", ShieldCheck, "green"], ["24", "Eventos hoy", Activity, "violet"], ["2", "Alertas por revisar", AlertTriangle, "amber"]].map(([value, label, Icon, tone]) => <article className={`admin-metric ${tone}`} key={label}><Icon size={20}/><strong>{value}</strong><span>{label}</span></article>)}</div>
    </Section>
    <Section marker="2" title="Accesos por rol" hint="Cuentas habilitadas">
      <div className="admin-access-list">{access.map(([label, count, width]) => <div className="admin-access-row" key={label}><span>{label}</span><div className="admin-access-track"><i style={{ width: `${width}%` }}/></div><strong>{count}</strong></div>)}</div>
    </Section>
    <Section marker="3" title="Actividad reciente" hint="Últimos eventos">
      <DataTable caption="Actividad reciente" headings={["Hora", "Usuario", "Acción", "Módulo"]} rows={events}/>
    </Section>
  </Screen>;
}
