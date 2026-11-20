import { useMemo, useState } from "react";
import { Plus, Search, UserRoundCog } from "lucide-react";
import { users as seedUsers } from "../../data/demoData.js";
import { Screen, Section, SidePanel, Status, DataTable } from "../../components/board/BoardPrimitives.jsx";

const roles = ["Administrador", "Coordinador", "Tutor", "Postulante"];
const roleLabel = (role) => ({ Administrador: "Administrador", Administradora: "Administrador", Coordinador: "Coordinador", Coordinadora: "Coordinador", Tutor: "Tutor", Tutora: "Tutor", Postulante: "Postulante" }[role] || role);

export function AdminUsersPage({ actions }) {
  const [accounts, setAccounts] = useState(seedUsers.map((user) => ({ ...user })));
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");
  const [stateFilter, setStateFilter] = useState("Todos");
  const visible = useMemo(() => accounts.filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase()) && (roleFilter === "Todos" || roleLabel(user.role) === roleFilter) && (stateFilter === "Todos" || user.state === stateFilter)), [accounts, query, roleFilter, stateFilter]);
  const invite = () => actions.showForm("Invitar usuario", "Agrega una cuenta y define su acceso al portal.", [{ label: "Nombre completo", name: "nombre", required: true }, { label: "Correo institucional", name: "correo", type: "email", required: true }, { label: "Rol", name: "rol", type: "select", options: roles }], ({ nombre, correo, rol }) => {
    const initials = nombre.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
    setAccounts((current) => [...current, { name: nombre, email: correo, role: rol, state: "Pendiente", initials }]);
    actions.notify(`Invitación preparada para ${nombre}.`);
  });
  const edit = (user) => actions.showForm("Editar usuario", `Actualiza los datos y permisos de ${user.name}.`, [{ label: "Nombre completo", name: "nombre", required: true, defaultValue: user.name }, { label: "Correo", name: "correo", type: "email", required: true, defaultValue: user.email }, { label: "Rol", name: "rol", type: "select", options: roles, defaultValue: roleLabel(user.role) }], ({ nombre, correo, rol }) => {
    setAccounts((current) => current.map((item) => item === user ? { ...item, name: nombre, email: correo, role: rol, initials: nombre.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() } : item));
    actions.notify(`Se actualizaron los datos de ${nombre}.`);
  });
  const rows = visible.map((user) => [<span className="admin-account-name" key={user.email}><i>{user.initials}</i><span><b>{user.name}</b><small>{user.email}</small></span></span>, roleLabel(user.role), <Status key={`${user.email}-state`} tone={user.state === "Activo" ? "success" : user.state === "Pendiente" ? "warning" : "neutral"}>{user.state}</Status>, <div className="admin-row-actions" key={`${user.email}-actions`}><button type="button" className="reference-edit-button" onClick={() => edit(user)}>Editar</button><button type="button" className="reference-edit-button" onClick={() => { setAccounts((current) => current.map((item) => item === user ? { ...item, state: item.state === "Inactivo" ? "Activo" : "Inactivo" } : item)); actions.notify(`${user.name}: estado actualizado.`); }}>{user.state === "Inactivo" ? "Activar" : "Desactivar"}</button></div>]);

  return <Screen className="reference-admin-users" title="Usuarios y accesos" subtitle="Administra cuentas, roles e invitaciones" aside={<SidePanel title="Resumen de cuentas" subtitle="Estado actual">
    <Section marker="A" title="Por rol">{roles.map((role) => <div className="admin-service-row" key={role}><span>{role}</span><strong>{accounts.filter((user) => roleLabel(user.role) === role && user.state === "Activo").length}</strong></div>)}</Section>
    <Section marker="B" title="Invitaciones"><div className="admin-invite-summary"><strong>{accounts.filter((user) => user.state === "Pendiente").length}</strong><span>pendientes de registro</span></div><button type="button" className="reference-board-primary-action" onClick={invite}><Plus size={16}/> Invitar usuario</button></Section>
    <Section marker="C" title="Acceso seguro"><p>Asigna a cada integrante solo los permisos que necesita para su trabajo.</p><div className="admin-security-note"><UserRoundCog size={18}/> Revisa el rol antes de guardar cambios.</div></Section>
  </SidePanel>}>
    <Section marker="1" title="Cuentas del sistema" hint={`${visible.length} de ${accounts.length} cuentas`}>
      <div className="admin-users-toolbar"><label className="admin-search"><Search size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre o correo" aria-label="Buscar usuarios"/></label><select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} aria-label="Filtrar por rol"><option value="Todos">Todos los roles</option>{roles.map((role) => <option key={role}>{role}</option>)}</select><select value={stateFilter} onChange={(event) => setStateFilter(event.target.value)} aria-label="Filtrar por estado"><option value="Todos">Todos los estados</option>{["Activo", "Pendiente", "Inactivo"].map((state) => <option key={state}>{state}</option>)}</select><button type="button" className="reference-board-primary-action" onClick={invite}><Plus size={16}/> Invitar usuario</button></div>
      <DataTable className="admin-users-table" caption="Cuentas del sistema" headings={["Usuario", "Rol", "Estado", "Acciones"]} rows={rows}/>
      {!visible.length && <p className="admin-empty-state">No hay cuentas que coincidan con estos filtros.</p>}
    </Section>
    <Section marker="2" title="Buenas prácticas de acceso" hint="Recomendación"><p>Desactiva temporalmente las cuentas que ya no requieren acceso. Puedes volver a activarlas desde esta lista.</p></Section>
  </Screen>;
}
