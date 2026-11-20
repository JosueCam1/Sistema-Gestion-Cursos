import { useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { Screen, Section, SidePanel, Toggle, Status } from "../../components/board/BoardPrimitives.jsx";

export function AdminSettingsPage({ notify }) {
  const [settings, setSettings] = useState({ mfa: true, lockout: true, encryption: true, backup: true });
  const [values, setValues] = useState({ portal: "Impulso · Cursos preparatorios", support: "soporte@institucion.edu.ec", session: "30", fileSize: "10" });
  const change = (key) => setSettings((current) => ({ ...current, [key]: !current[key] }));
  const update = (key, value) => setValues((current) => ({ ...current, [key]: value }));
  return <Screen className="reference-admin-settings" title="Configuración del sistema" subtitle="Seguridad, integraciones y parámetros" aside={<SidePanel title="Estado y seguridad" subtitle="Protección del portal">
    <Section marker="A" title="Autenticación"><Toggle label="Verificación en dos pasos" checked={settings.mfa} onChange={() => change("mfa")}/><Toggle label="Bloqueo por intentos fallidos" checked={settings.lockout} onChange={() => change("lockout")}/></Section>
    <Section marker="B" title="Documentos"><Toggle label="Almacenamiento cifrado" checked={settings.encryption} onChange={() => change("encryption")}/><Toggle label="Copia de seguridad diaria" checked={settings.backup} onChange={() => change("backup")}/></Section>
    <Section marker="C" title="Integraciones">{[["API académica", "Operativa"], ["Correo institucional", "Operativo"], ["Almacenamiento", "Conectado"], ["Base de datos", "Protegida"]].map(([name, state]) => <div className="admin-service-row" key={name}><span>{name}</span><Status tone="success">{state}</Status></div>)}</Section>
  </SidePanel>}>
    <Section marker="1" title="Parámetros generales" hint="Configuración del portal"><div className="admin-settings-grid">
      <label className="reference-board-field">Nombre del portal<input value={values.portal} onChange={(event) => update("portal", event.target.value)}/></label>
      <label className="reference-board-field">Correo de soporte<input type="email" value={values.support} onChange={(event) => update("support", event.target.value)}/></label>
      <label className="reference-board-field">Tiempo de sesión (minutos)<input type="number" min="5" value={values.session} onChange={(event) => update("session", event.target.value)}/></label>
      <label className="reference-board-field">Tamaño máximo de archivo (MB)<input type="number" min="1" value={values.fileSize} onChange={(event) => update("fileSize", event.target.value)}/></label>
    </div><button type="button" className="reference-board-primary-action" onClick={() => notify("Parámetros guardados en esta demostración local.")}><Check size={16}/> Guardar parámetros</button></Section>
    <Section marker="2" title="Perfiles de acceso" hint="Permisos por rol"><div className="admin-role-grid">{[["Administrador", "Control de usuarios y configuración"], ["Coordinador", "Gestión académica y reportes"], ["Tutor", "Seguimiento de postulantes asignados"], ["Postulante", "Cursos, evidencias y plazos propios"]].map(([role, detail]) => <article key={role}><ShieldCheck size={18}/><strong>{role}</strong><span>{detail}</span></article>)}</div></Section>
  </Screen>;
}
