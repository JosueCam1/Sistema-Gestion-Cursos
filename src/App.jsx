import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Info,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Download,
  Eye,
  FileBarChart2,
  FileCheck2,
  FileClock,
  FileText,
  Filter,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  Video,
  X,
  Zap,
  UserPlus,
  Phone,
  UploadCloud,
  CalendarPlus,
  LockKeyhole,
  Ellipsis,
  BookMarked,
  ChartNoAxesCombined,
  CircleDollarSign,
} from "lucide-react";
import {
  applicants,
  programs,
  users,
  notifications,
  evidence,
  followups,
  activityLog,
} from "./data/demoData.js";
import {
  cx,
  Progress,
  Pill,
  Avatar,
  SectionTitle,
  Card,
  StatCard,
  TableWrap,
  EmptyState,
} from "./components/ui.jsx";
import { AuthScreen } from "./pages/AuthScreen.jsx";
import { PageSkeleton } from "./components/layout/PageSkeleton.jsx";
import { ActionDialog } from "./components/floating/ActionDialog.jsx";
import { GlobalSearchDialog } from "./components/floating/GlobalSearchDialog.jsx";
import { pageHeading, pageDescription } from "./pages/metadata.js";
import {
  CoordinatorPage,
  riskTone,
  ActivityRow,
} from "./pages/coordinator.jsx";
import { ApplicantPage } from "./pages/applicant.jsx";
import { TutorPage } from "./pages/tutor.jsx";
import { AdminPage } from "./pages/admin.jsx";
import { AccountProfilePage } from "./pages/AccountProfilePage.jsx";

const roleNames = {
  coordinador: "Coordinador",
  tutor: "Tutor",
  postulante: "Postulante",
  administrador: "Administrador",
};
const demoUserNames = {
  coordinador: "María F. Paz",
  postulante: "Josué Camisan",
  tutor: "Lucía Mena",
  administrador: "Admin sistema",
};
const initialsFor = (name) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toLocaleUpperCase("es"))
    .join("");
const navItems = {
  coordinador: [
    ["panel", "Panel", LayoutDashboard],
    ["programas", "Programas", GraduationCap],
    ["cursos", "Cursos", BookOpen],
    ["postulantes", "Postulantes", Users],
    ["seguimiento", "Seguimiento", MessageSquare],
    ["alertas", "Alertas", Bell],
    ["reportes", "Reportes", FileBarChart2],
    ["auditoria", "Auditoría", ShieldCheck],
    ["ajustes", "Ajustes", SlidersHorizontal],
  ],
  postulante: [
    ["avance", "Mi avance", Activity],
    ["mis-cursos", "Mis cursos", BookOpen],
    ["evidencias", "Evidencias", UploadCloud],
    ["plazos", "Plazos", CalendarDays],
    ["avisos", "Avisos", Bell],
    ["mi-tutor", "Mi tutor", MessageCircle],
  ],
  tutor: [
    ["tutor-postulantes", "Postulantes", Users],
    ["tutor-seguimiento", "Seguimiento", ClipboardList],
    ["agenda", "Agenda", CalendarDays],
    ["tutor-alertas", "Alertas", Bell],
    ["plantillas", "Plantillas", Mail],
    ["tutor-reportes", "Reportes", FileBarChart2],
  ],
  administrador: [
    ["admin-resumen", "Resumen", LayoutDashboard],
    ["usuarios", "Usuarios", Users],
    ["configuracion", "Configuración", Settings2],
    ["admin-reportes", "Reportes", FileBarChart2],
  ],
};
const initialRoute = {
  coordinador: "panel",
  postulante: "avance",
  tutor: "tutor-postulantes",
  administrador: "admin-resumen",
};
const titleByRoute = Object.fromEntries(
  Object.values(navItems)
    .flat()
    .map(([id, label]) => [id, label]),
);
const allSearch = [
  ...applicants.map((x) => ({
    title: x.name,
    detail: x.program + " · " + x.id,
    route: "postulantes",
    kind: "Postulantes",
    risk: x.risk,
  })),
  ...programs.map((x) => ({
    title: "Maestría en " + x.name,
    detail: x.code,
    route: "programas",
    kind: "Programas",
    count: x.students,
  })),
  ...users.filter((x) => x.role.toLowerCase().includes("tutor")).map((x) => ({
    title: x.name,
    detail: x.role + " · tutor asignable",
    route: "postulantes",
    kind: "Tutores",
  })),
];

function ApplicantDetailDialog({ refElement, applicant, onClose }) {
  const [tab, setTab] = useState("resumen");
  useEffect(() => setTab("resumen"), [applicant?.id]);
  const tabs = [
    ["resumen", "Resumen"],
    ["evidencias", "Evidencias"],
    ["seguimientos", "Seguimientos"],
    ["historial", "Historial"],
  ];
  return (
    <dialog
      ref={refElement}
      className="detail-dialog"
      aria-labelledby="applicant-detail-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === refElement.current) onClose();
      }}
    >
      {applicant && (
        <>
          <header className="detail-header">
            <div className="detail-person">
              <Avatar
                initials={applicant.initials}
                tone={riskTone(applicant.risk)}
              />
              <div>
                <span className="eyebrow">
                  FICHA DEL POSTULANTE · {applicant.id}
                </span>
                <h2 id="applicant-detail-title">{applicant.name}</h2>
                <p>{applicant.program}</p>
              </div>
            </div>
            <button
              className="icon-button"
              type="button"
              aria-label="Cerrar ficha"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </header>
          <nav
            className="detail-tabs"
            role="tablist"
            aria-label="Secciones de la ficha"
          >
            {tabs.map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                className={tab === id ? "selected" : ""}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </nav>
          <div role="tabpanel" className="detail-panel">
            {tab === "resumen" && (
              <>
                <div className="detail-highlight">
                  <span>
                    <span className="eyebrow">AVANCE DEL PROCESO</span>
                    <strong>{applicant.progress}%</strong>
                  </span>
                  <div>
                    <Progress value={applicant.progress} />
                    <small>Metodología de investigación</small>
                  </div>
                  <Pill tone={riskTone(applicant.risk)} dot>
                    Riesgo {applicant.risk.toLowerCase()}
                  </Pill>
                </div>
                <div className="detail-facts">
                  <div>
                    <span>Curso</span>
                    <strong>{applicant.course}</strong>
                  </div>
                  <div>
                    <span>Tutora asignada</span>
                    <strong>{applicant.tutor}</strong>
                  </div>
                  <div>
                    <span>Próximo vencimiento</span>
                    <strong>En {applicant.days} días</strong>
                  </div>
                  <div>
                    <span>Estado</span>
                    <strong>{applicant.status}</strong>
                  </div>
                </div>
                <div className="detail-note">
                  <strong>Motivo de atención</strong>
                  <p>
                    {applicant.risk === "Alto"
                      ? "Avance bajo o comunicación pendiente. Revisar el próximo compromiso acordado."
                      : "Seguimiento regular; confirmar que las fechas de entrega se mantengan."}
                  </p>
                </div>
              </>
            )}
            {tab === "evidencias" && (
              <div className="detail-list">
                {evidence.map((item) => (
                  <div className="detail-list-row" key={item.title}>
                    <FileCheck2 size={16} />
                    <span>
                      <strong>{item.title}</strong>
                      <small>
                        {item.date} · {item.feedback}
                      </small>
                    </span>
                    <Pill
                      tone={
                        item.status === "Aprobada"
                          ? "success"
                          : item.status === "En revisión"
                            ? "info"
                            : "neutral"
                      }
                    >
                      {item.status}
                    </Pill>
                  </div>
                ))}
              </div>
            )}
            {tab === "seguimientos" && (
              <div className="detail-list">
                {followups.slice(0, 3).map((item) => (
                  <div className="detail-list-row" key={item.person}>
                    <MessageSquare size={16} />
                    <span>
                      <strong>
                        {item.medium} · {item.result}
                      </strong>
                      <small>
                        {item.date} · Próxima acción: {item.next}
                      </small>
                    </span>
                    <Pill tone={riskTone(item.risk)}>{item.risk}</Pill>
                  </div>
                ))}
              </div>
            )}
            {tab === "historial" && (
              <div className="timeline-card detail-history">
                {activityLog.map((item) => (
                  <ActivityRow item={item} key={item.title} />
                ))}
              </div>
            )}
          </div>
          <footer className="detail-footer">
            <small>
              Vista de demostración · Los datos reales se cargarán desde
              FastAPI.
            </small>
            <button
              className="button button-light"
              type="button"
              onClick={onClose}
            >
              Cerrar ficha
            </button>
          </footer>
        </>
      )}
    </dialog>
  );
}
export default function App() {
  const [role, setRole] = useState("coordinador"),
    [route, setRoute] = useState("panel"),
    [isPageLoading, setIsPageLoading] = useState(false),
    [dialog, setDialog] = useState(null),
    [searchOpen, setSearchOpen] = useState(false),
    [searchTerm, setSearchTerm] = useState(""),
    [filterRisk, setFilterRisk] = useState("Todos los riesgos"),
    [filterProgram, setFilterProgram] = useState("Todos los programas"),
    [toast, setToast] = useState(""),
    [mobileNav, setMobileNav] = useState(false),
    [showNotifications, setShowNotifications] = useState(false),
    [readNotifications, setReadNotifications] = useState(false),
    [reviewState, setReviewState] = useState(evidence),
    [profile, setProfile] = useState({
      firstName: "Josué",
      lastName: "Camisan",
      email: "josue.camisan@correo.edu.ec",
      phone: "+593 99 000 0000",
      identity: "••••••••42",
      program: "Maestría en Gestión Educativa",
    }),
    [roleProfiles, setRoleProfiles] = useState({
      coordinador: {
        firstName: "María F.",
        lastName: "Paz",
        email: "mfpaz@institucion.edu.ec",
        phone: "+593 99 000 0001",
      },
      tutor: {
        firstName: "Lucía",
        lastName: "Mena",
        email: "lucia.mena@institucion.edu.ec",
        phone: "+593 99 000 0002",
      },
      administrador: {
        firstName: "Admin",
        lastName: "Sistema",
        email: "admin@institucion.edu.ec",
        phone: "+593 99 000 0003",
      },
    }),
    [demoRows, setDemoRows] = useState(applicants),
    [selectedFile, setSelectedFile] = useState(""),
    [authenticated, setAuthenticated] = useState(false),
    [detailApplicant, setDetailApplicant] = useState(null);
  const activeUserName =
      role === "postulante"
        ? `${profile.firstName} ${profile.lastName}`.trim()
        : `${roleProfiles[role]?.firstName ?? ""} ${roleProfiles[role]?.lastName ?? ""}`.trim() || demoUserNames[role],
    activeUserInitials = initialsFor(activeUserName);
  const detailDialogRef = useRef(null);
  const visibleApplicants = useMemo(
    () =>
      demoRows.filter(
        (x) =>
          (filterRisk === "Todos los riesgos" || x.risk === filterRisk) &&
          (filterProgram === "Todos los programas" ||
            x.program.includes(filterProgram)) &&
          (x.name + x.program + x.tutor)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      ),
    [demoRows, filterRisk, filterProgram, searchTerm],
  );
  const currentNav =
      navItems[role].find((x) => x[0] === route) || navItems[role][0],
    currentTitle = route === "perfil" ? "Mi perfil" : titleByRoute[route] || "Inicio",
    unreadCount = readNotifications
      ? 0
      : notifications.filter((x) => x.unread).length,
    isReferenceBoard =
      (role === "coordinador" &&
        [
          "panel",
          "programas",
          "cursos",
          "postulantes",
          "seguimiento",
          "alertas",
          "reportes",
          "auditoria",
          "ajustes",
        ].includes(route)) ||
      (role === "postulante" && route !== "perfil") ||
      (role === "tutor" && route !== "perfil") ||
      (role === "administrador" && route !== "perfil");
  useEffect(() => {
    function onKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  useEffect(() => {
    const el = detailDialogRef.current;
    if (!el) return;
    if (detailApplicant && !el.open) el.showModal();
    if (!detailApplicant && el.open) el.close();
  }, [detailApplicant]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (!isPageLoading) return;
    const timer = setTimeout(() => setIsPageLoading(false), 600);
    return () => clearTimeout(timer);
  }, [isPageLoading, route, role]);
  function navigate(next) {
    if (next !== route) setIsPageLoading(true);
    setRoute(next);
    setMobileNav(false);
    setSearchOpen(false);
    setShowNotifications(false);
  }
  function changeRole(next) {
    setIsPageLoading(true);
    setRole(next);
    setRoute(initialRoute[next]);
    setSearchTerm("");
    setFilterRisk("Todos los riesgos");
  }
  function notify(message) {
    setToast(message);
  }
  function showForm(title, description, fields = [], onSave) {
    setDialog({ title, description, fields, onSave });
  }
  function saveForm(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget),
      value = data.get("nombre") || data.get("titulo") || data.get("asunto");
    if (dialog?.onSave) {
      dialog.onSave(Object.fromEntries(data.entries()));
      setDialog(null);
      return;
    }
    setDialog(null);
    notify(
      value
        ? "“" + value + "” se guardó como demostración local."
        : "Cambios guardados en esta demostración.",
    );
  }
  function exportCsv() {
    const csv = [
      "Postulante,Programa,Avance,Riesgo,Tutor",
      ...visibleApplicants.map((x) =>
        [x.name, x.program, x.progress + "%", x.risk, x.tutor]
          .map((v) => '"' + String(v).replaceAll('"', '""') + '"')
          .join(","),
      ),
    ].join("\r\n");
    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "postulantes-demo.csv";
    a.click();
    URL.revokeObjectURL(url);
    notify("CSV de demostración descargado.");
  }
  function changeEvidence(id, status, observation) {
    setReviewState((items) =>
      items.map((x) =>
        x.title === id
          ? { ...x, status, feedback: observation || x.feedback }
          : x,
      ),
    );
    notify(
      status === "Aprobada"
        ? "Evidencia aprobada en la vista local."
        : "Evidencia marcada para corrección.",
    );
  }
  function submitApplicantEvidence(activity, fileName, comment) {
    const date = new Date().toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" });
    setReviewState((items) => {
      const existing = items.some((item) => item.title === activity);
      return existing
        ? items.map((item) => item.title === activity
            ? { ...item, status: "En revisión", date, feedback: comment || `Archivo recibido: ${fileName}` }
            : item)
        : [...items, { title: activity, course: "Curso preparatorio", date, status: "En revisión", feedback: comment || `Archivo recibido: ${fileName}` }];
    });
    notify(`“${activity}” se envió a revisión.`);
  }
  function openApplicant(name) {
    setDetailApplicant(applicants.find((item) => item.name === name) || null);
  }
  const actions = { showForm, notify, exportCsv, navigate };
  if (!authenticated)
    return (
      <AuthScreen
        onLogin={(selectedRole) => {
          setRole(selectedRole);
          setRoute(initialRoute[selectedRole]);
          setAuthenticated(true);
        }}
        notify={notify}
      />
    );
  return (
    <div
      className={cx(
        "app-shell",
        isReferenceBoard && "reference-board-view",
        role === "administrador" && route !== "perfil" && "reference-admin-view",
        role === "coordinador" &&
          route === "programas" &&
          "reference-program-view",
        role === "postulante" && route === "avance" && "reference-student-view",
      )}
    >
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <aside className={cx("sidebar", mobileNav && "sidebar-open")}>
        <div className="brand-lockup">
          <span className="brand-mark" aria-label="Portal de maestrías">
            PM
          </span>
        </div>
        <div className="sidebar-context">
          <span className="context-dot" />
          PORTAL ACADÉMICO
        </div>
        <button
          type="button"
          className="reference-user-mark reference-user-profile-button"
          aria-label={`Abrir perfil de ${activeUserName}`}
          title="Abrir mi perfil"
          onClick={() => navigate("perfil")}
        >
          {activeUserInitials}
        </button>
        <nav aria-label="Navegación principal" className="side-nav">
          {navItems[role].map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              className={cx("nav-link", route === id && "active")}
              onClick={() => navigate(id)}
              aria-current={route === id ? "page" : undefined}
              title={label}
            >
              <span className="nav-icon">
                <Icon size={18} strokeWidth={1.9} />
                {id.includes("alert") && <i className="nav-dot" />}
              </span>
              <span className="nav-label">{label}</span>
              {id === "alertas" && <span className="nav-counter">4</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button
            type="button"
            className="nav-link help-link"
            onClick={() =>
              showForm(
                "Centro de ayuda",
                "Encuentra orientación para usar el portal.",
                [
                  {
                    label: "¿Qué necesitas resolver?",
                    name: "asunto",
                    placeholder: "Escribe tu consulta",
                    required: true,
                  },
                ],
              )
            }
          >
            <span className="nav-icon">
              <CircleHelp size={18} />
            </span>
            <span className="nav-label">Ayuda</span>
          </button>
          <div className="side-user">
            <Avatar initials={activeUserInitials} tone="violet" size="small" />
            <div>
              <strong>{activeUserName}</strong>
              <span>{roleNames[role]}</span>
            </div>
            <button
              type="button"
              className="icon-button subtle"
              aria-label="Cerrar sesión"
              onClick={() => setAuthenticated(false)}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
      {mobileNav && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Cerrar menú"
          onClick={() => setMobileNav(false)}
        />
      )}
      <div className="workspace">
        <header className={cx("topbar", route === "perfil" && "profile-topbar")}>
          <button
            type="button"
            className="mobile-menu icon-button"
            aria-label="Abrir menú"
            onClick={() => setMobileNav(true)}
          >
            <Menu size={20} />
          </button>
          <div className="breadcrumb">
            <span>Portal académico</span>
            <ChevronRight size={14} />
            <strong>{currentTitle}</strong>
          </div>
          <div className="top-actions">
            <button
              type="button"
              className="global-search"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={16} />
              <span>Buscar personas, programas...</span>
              <kbd>Ctrl K</kbd>
            </button>
            <label className="role-switch-label">
              <span className="sr-only">Vista de rol</span>
              <select
                className="role-switch"
                value={role}
                onChange={(e) => changeRole(e.target.value)}
                aria-label="Cambiar vista de demostración"
              >
                {Object.entries(roleNames).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} />
            </label>
            <div className="notification-wrap">
              <button
                type="button"
                className="icon-button notification-button"
                aria-label={
                  "Notificaciones" +
                  (unreadCount ? ", " + unreadCount + " sin leer" : "")
                }
                aria-expanded={showNotifications}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </button>
              {showNotifications && (
                <div className="notification-popover">
                  <div className="popover-heading">
                    <strong>Notificaciones</strong>
                    <button
                      type="button"
                      onClick={() => {
                        setReadNotifications(true);
                        notify("Notificaciones marcadas como leídas.");
                      }}
                    >
                      Marcar leídas
                    </button>
                  </div>
                  {notifications.map((item) => (
                    <div
                      className={cx(
                        "notification-item",
                        item.unread && !readNotifications && "unread",
                      )}
                      key={item.title}
                    >
                      <span className="notification-icon">
                        <Bell size={15} />
                      </span>
                      <div>
                        <strong>{item.title}</strong>
                        <small>{item.detail}</small>
                      </div>
                    </div>
                  ))}
                  <button
                    className="popover-footer"
                    type="button"
                    onClick={() =>
                      navigate(
                        role === "postulante"
                          ? "avisos"
                          : role === "tutor"
                            ? "tutor-alertas"
                            : "alertas",
                      )
                    }
                  >
                    Ver todas las notificaciones <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
            <span className="reference-convocation">Convocatoria 2026-II</span>
          </div>
        </header>
        <main
          id="main-content"
          className={cx(
            "main-content",
            isReferenceBoard && "reference-board-view",
            role === "coordinador" &&
              route === "panel" &&
              "reference-dashboard",
            role === "coordinador" &&
              route === "programas" &&
              "reference-program-view",
            role === "postulante" &&
              route === "avance" &&
              "reference-student-view",
          )}
        >
          {isPageLoading ? (
            <PageSkeleton title={currentTitle} />
          ) : (
            <>
          <div className="page-heading">
            <div>
              <div className="page-kicker">
                <span className="live-indicator" />
                {role === "postulante"
                  ? "ESPACIO DEL POSTULANTE"
                  : role === "tutor"
                    ? "ESPACIO DE TUTORÍA"
                    : role === "administrador"
                      ? "ADMINISTRACIÓN DEL SISTEMA"
                      : "GESTIÓN ACADÉMICA"}
                <span className="kicker-divider">/</span>
                <span>{currentTitle.toUpperCase()}</span>
              </div>
              <h1>{route === "perfil" ? "Datos personales" : pageHeading(route)}</h1>
              <p>{route === "perfil" ? "Actualiza la información de tu cuenta." : pageDescription(route)}</p>
            </div>
            <div className="heading-actions">
              {role === "coordinador" && route !== "perfil" && (
                <label className="convocation-select">
                  <CalendarDays size={15} />
                  <select aria-label="Convocatoria" defaultValue="2026A">
                    <option value="2026A">Convocatoria 2026-A</option>
                    <option value="2025B">Convocatoria 2025-B</option>
                  </select>
                  <ChevronDown size={14} />
                </label>
              )}
              {route === "postulantes" && (
                <button
                  className="button button-primary"
                  type="button"
                  onClick={() =>
                    showForm(
                      "Registrar postulante",
                      "Completa los datos básicos para crear su ficha.",
                      [
                        {
                          label: "Nombre completo",
                          name: "nombre",
                          placeholder: "Nombre y apellido",
                          required: true,
                        },
                        {
                          label: "Correo institucional",
                          name: "correo",
                          type: "email",
                          placeholder: "nombre@institucion.edu.ec",
                          required: true,
                        },
                        {
                          label: "Programa",
                          name: "programa",
                          type: "select",
                          options: [
                            "Gestión Educativa",
                            "Finanzas",
                            "Sistemas",
                          ],
                        },
                      ],
                    )
                  }
                >
                  <Plus size={16} /> Nuevo postulante
                </button>
              )}
              {route === "programas" && (
                <button
                  className="button button-primary"
                  type="button"
                  onClick={() =>
                    showForm(
                      "Crear programa",
                      "Añade un programa de maestría al catálogo.",
                      [
                        {
                          label: "Nombre del programa",
                          name: "nombre",
                          placeholder: "Ej. Gestión Educativa",
                          required: true,
                        },
                        {
                          label: "Código",
                          name: "codigo",
                          placeholder: "Ej. MGE-2026",
                          required: true,
                        },
                      ],
                    )
                  }
                >
                  <Plus size={16} /> Crear programa
                </button>
              )}
              {route === "usuarios" && (
                <button
                  className="button button-primary"
                  type="button"
                  onClick={() =>
                    showForm(
                      "Invitar usuario",
                      "El acceso será asignado al rol seleccionado.",
                      [
                        {
                          label: "Nombre completo",
                          name: "nombre",
                          placeholder: "Nombre y apellido",
                          required: true,
                        },
                        {
                          label: "Correo electrónico",
                          name: "correo",
                          type: "email",
                          placeholder: "usuario@institucion.edu.ec",
                          required: true,
                        },
                        {
                          label: "Rol",
                          name: "rol",
                          type: "select",
                          options: ["Coordinador", "Tutor", "Postulante"],
                        },
                      ],
                    )
                  }
                >
                  <Plus size={16} /> Invitar usuario
                </button>
              )}
            </div>
          </div>
          {role === "coordinador" && route === "perfil" && (
            <AccountProfilePage
              roleName={roleNames[role]}
              profile={roleProfiles[role]}
              onProfileChange={(update) =>
                setRoleProfiles((current) => ({
                  ...current,
                  [role]: typeof update === "function" ? update(current[role]) : update,
                }))
              }
              notify={notify}
            />
          )}
          {role === "coordinador" && route !== "perfil" && (
            <CoordinatorPage
              route={route}
              applicants={visibleApplicants}
              filters={{
                filterRisk,
                setFilterRisk,
                filterProgram,
                setFilterProgram,
                searchTerm,
                setSearchTerm,
              }}
              actions={actions}
              openApplicant={openApplicant}
            />
          )}
          {role === "postulante" && (
            <ApplicantPage
              route={route}
              reviewState={reviewState}
              fileName={selectedFile}
              onFile={setSelectedFile}
              onSubmitEvidence={submitApplicantEvidence}
              notify={notify}
              showForm={showForm}
              profile={profile}
              onProfileChange={setProfile}
              actions={actions}
            />
          )}
          {role === "tutor" && (
            route === "perfil" ? (
              <AccountProfilePage
                roleName={roleNames[role]}
                profile={roleProfiles[role]}
                onProfileChange={(update) =>
                  setRoleProfiles((current) => ({
                    ...current,
                    [role]: typeof update === "function" ? update(current[role]) : update,
                  }))
                }
                notify={notify}
              />
            ) : (
              <TutorPage
                route={route}
                showForm={showForm}
                notify={notify}
                changeEvidence={changeEvidence}
                reviewState={reviewState}
                openApplicant={openApplicant}
              />
            )
          )}
          {role === "administrador" && (
            route === "perfil" ? (
              <AccountProfilePage
                roleName={roleNames[role]}
                profile={roleProfiles[role]}
                onProfileChange={(update) =>
                  setRoleProfiles((current) => ({
                    ...current,
                    [role]: typeof update === "function" ? update(current[role]) : update,
                  }))
                }
                notify={notify}
              />
            ) : (
              <AdminPage route={route} showForm={showForm} notify={notify} navigate={navigate} />
            )
          )}
          <footer className="page-footer">
            <span>© 2026 Impulso · Portal de cursos preparatorios</span>
            <span>
              <span className="demo-dot" /> Entorno de demostración · Datos
              ficticios
            </span>
          </footer>
            </>
          )}
        </main>
      </div>
      <GlobalSearchDialog open={searchOpen} items={allSearch} onClose={() => setSearchOpen(false)} onNavigate={navigate} />
      <ActionDialog dialog={dialog} onClose={() => setDialog(null)} onSubmit={saveForm} />
      <ApplicantDetailDialog
        refElement={detailDialogRef}
        applicant={detailApplicant}
        onClose={() => setDetailApplicant(null)}
      />
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={17} />
          {toast}
          <button
            type="button"
            aria-label="Cerrar aviso"
            onClick={() => setToast("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
