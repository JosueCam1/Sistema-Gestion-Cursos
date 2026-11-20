import { EmptyState } from "../components/ui.jsx";
import { ReportsReferencePage } from "./coordinator/ReportsPage.jsx";
import { AdminDashboardPage } from "./admin/AdminDashboardPage.jsx";
import { AdminUsersPage } from "./admin/AdminUsersPage.jsx";
import { AdminSettingsPage } from "./admin/AdminSettingsPage.jsx";

export function AdminPage({ route, showForm, notify, navigate }) {
  const actions = { showForm, notify, navigate };
  if (route === "admin-resumen") return <AdminDashboardPage actions={actions}/>;
  if (route === "usuarios") return <AdminUsersPage actions={actions}/>;
  if (route === "configuracion") return <AdminSettingsPage notify={notify}/>;
  if (route === "admin-reportes") return <ReportsReferencePage actions={actions}/>;
  return <EmptyState title="Sección no disponible" detail="Selecciona una opción del menú."/>;
}
