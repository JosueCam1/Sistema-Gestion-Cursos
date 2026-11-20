import { MetricCard } from "../components/coordinator/MetricCard.jsx";
import { ExecutiveDashboardPage } from "./coordinator/ExecutiveDashboardPage.jsx";
import { ProgramsReferencePage } from "./coordinator/ProgramsPage.jsx";
import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Download,
  FileBarChart2,
  FileCheck2,
  FileClock,
  FileText,
  Mail,
  MessageCircle,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Zap,
  UserPlus,
  Phone,
  ChartNoAxesCombined,
} from "lucide-react";
import {
  applicants,
  users,
} from "../data/demoData.js";
import {
  cx,
  Progress,
  Pill,
  Avatar,
  SectionTitle,
  Card,
  TableWrap,
  EmptyState,
} from "../components/ui.jsx";
import {
  ApplicantsReferencePage,
  FollowupsReferencePage,
  AlertsReferencePage,
  ReportsReferencePage,
  AuditReferencePage,
  SettingsReferencePage,
  CoursesReferencePage,
} from "./referenceCoordinator.jsx";

export function CoordinatorPage({
  route,
  filters,
  actions,
}) {
  if (route === "panel") return <ExecutiveDashboardPage actions={actions} />;
  if (route === "programas") return <ProgramsReferencePage actions={actions} />;
  if (route === "cursos") return <CoursesReferencePage actions={actions} />;
  if (route === "postulantes")
    return <ApplicantsReferencePage filters={filters} actions={actions} />;
  if (route === "seguimiento")
    return <FollowupsReferencePage actions={actions} />;
  if (route === "alertas") return <AlertsReferencePage actions={actions} />;
  if (route === "reportes") return <ReportsReferencePage actions={actions} />;
  if (route === "auditoria") return <AuditReferencePage actions={actions} />;
  if (route === "ajustes") return <SettingsReferencePage actions={actions} />;
  return (
    <EmptyState
      title="Sección no disponible"
      detail="Selecciona una opción del menú."
    />
  );
}

export function ApplicantTable({ rows, compact = false, onOpen }) {
  if (!rows.length)
    return (
      <EmptyState
        icon={Users}
        title="No encontramos postulantes"
        detail="Prueba cambiando los filtros."
      />
    );
  return (
    <TableWrap caption="Listado de postulantes">
      <thead>
        <tr>
          <th>Postulante</th>
          <th>Programa</th>
          <th>Avance</th>
          <th>Vence</th>
          <th>Riesgo</th>
          <th>{compact ? "Acción" : "Tutor"}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((p) => (
          <tr key={p.id}>
            <th scope="row">
              <span className="person-cell">
                <Avatar
                  initials={p.initials}
                  tone={
                    p.risk === "Alto"
                      ? "peach"
                      : p.risk === "Medio"
                        ? "amber"
                        : "blue"
                  }
                  size="small"
                />
                <span>
                  {p.name}
                  <small className="cell-subtitle">{p.id}</small>
                </span>
              </span>
            </th>
            <td>{shortProgram(p.program)}</td>
            <td>
              <span className="progress-cell">
                <Progress value={p.progress} />
                <small>{p.progress}%</small>
              </span>
            </td>
            <td>{p.days} días</td>
            <td>
              <Pill tone={riskTone(p.risk)} dot>
                {p.risk}
              </Pill>
            </td>
            <td>
              {compact ? (
                <button
                  type="button"
                  className="text-button"
                  onClick={() => onOpen(p.name)}
                >
                  Ver ficha <ArrowRight size={13} />
                </button>
              ) : (
                <span className="person-tutor">{p.tutor}</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </TableWrap>
  );
}
function shortProgram(program) {
  return program.replace("Maestría en ", "");
}
export function riskTone(level) {
  return level === "Alto" ? "high" : level === "Medio" ? "medium" : "low";
}
export function RiskRow({ label, count, tone, percent }) {
  return (
    <div className="risk-row">
      <span className={"risk-dot risk-" + tone} />
      <span className="risk-label">{label}</span>
      <strong>{count}</strong>
      <div className="risk-meter">
        <i className={"meter-" + tone} style={{ width: percent + "%" }} />
      </div>
    </div>
  );
}
export function ActivityRow({ item }) {
  const Icon =
    {
      "file-check-2": FileCheck2,
      phone: Phone,
      "user-plus": UserPlus,
      send: Send,
    }[item.icon] || Activity;
  return (
    <div className="activity-row">
      <span className={"activity-icon activity-" + item.tone}>
        <Icon size={15} />
      </span>
      <div>
        <strong>{item.title}</strong>
        <small>{item.detail}</small>
      </div>
      <time>{item.time}</time>
    </div>
  );
}
export function Requirement({ label, checked }) {
  return (
    <div className="requirement-row">
      <span className={cx("requirement-check", checked && "checked")}>
        {checked && <Check size={13} />}
      </span>
      <span>{label}</span>
      <span className="requirement-base">Configurado</span>
    </div>
  );
}
export function BigMetric({ value, label }) {
  return (
    <div className="big-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
export function QuickLinks({ onAction }) {
  return (
    <Card className="quick-links">
      <span className="eyebrow">ACCESOS RÁPIDOS</span>
      <button
        type="button"
        onClick={() => onAction("Matriz consolidada lista para exportar.")}
      >
        <FileBarChart2 size={15} /> Matriz consolidada <ArrowRight size={14} />
      </button>
      <button
        type="button"
        onClick={() => onAction("Informe de trazabilidad preparado.")}
      >
        <ShieldCheck size={15} /> Informe de trazabilidad{" "}
        <ArrowRight size={14} />
      </button>
      <button
        type="button"
        onClick={() => onAction("Calendario de plazos abierto.")}
      >
        <CalendarDays size={15} /> Calendario de plazos <ArrowRight size={14} />
      </button>
    </Card>
  );
}
export function InfoNote({ icon: Icon, title, text }) {
  return (
    <div className="info-note">
      <span>
        <Icon size={17} />
      </span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}
export function Channel({ icon: Icon, label, value, percent }) {
  return (
    <div className="channel-row">
      <span className="channel-icon">
        <Icon size={15} />
      </span>
      <div className="channel-content">
        <span>{label}</span>
        <Progress value={percent} />
        <small>{value}</small>
      </div>
    </div>
  );
}

export function AlertsPage({ actions }) {
  return (
    <div className="page-grid">
      <div className="primary-column">
        <SectionTitle
          number="1"
          title="Alertas que requieren acción"
          description="Revisa el motivo del riesgo y coordina el siguiente paso."
        />
        <div className="alert-stack">
          {applicants
            .filter((x) => x.risk !== "Bajo")
            .map((p) => (
              <Card className="alert-card" key={p.id}>
                <span className={"alert-marker marker-" + p.risk.toLowerCase()}>
                  <AlertTriangle size={18} />
                </span>
                <div className="alert-main">
                  <div className="alert-title-row">
                    <strong>{p.name}</strong>
                    <Pill tone={riskTone(p.risk)} dot>
                      Riesgo {p.risk.toLowerCase()}
                    </Pill>
                  </div>
                  <p>
                    {p.progress < 40
                      ? "Avance bajo y evidencia pendiente de carga."
                      : "Plazo próximo y requiere confirmar su plan de entrega."}
                  </p>
                  <span className="alert-meta">
                    <CalendarDays size={14} /> Vence en {p.days}{" "}
                    {p.days === 1 ? "día" : "días"} <i /> Tutor: {p.tutor}
                  </span>
                </div>
                <button
                  className="button button-light"
                  onClick={() =>
                    actions.notify("Ficha de " + p.name + " abierta.")
                  }
                  type="button"
                >
                  <MessageCircle size={15} /> Contactar
                </button>
              </Card>
            ))}
        </div>
        <div className="section-gap">
          <SectionTitle
            number="2"
            title="Reglas de alertas"
            description="Las reglas son referenciales hasta conectarlas a la API."
          />
        </div>
        <Card className="rule-list">
          {[
            [
              "Sin actividad reciente",
              "Marcar riesgo alto después de 10 días sin avance.",
            ],
            ["Evidencia pendiente", "Avisar al tutor si vence en 5 días."],
            [
              "Sin respuesta",
              "Escalar si no responde dos contactos consecutivos.",
            ],
          ].map((x, i) => (
            <label className="rule-row" key={x[0]}>
              <span className={"rule-icon rule-" + i}>
                <Zap size={16} />
              </span>
              <span>
                <strong>{x[0]}</strong>
                <small>{x[1]}</small>
              </span>
              <input
                type="checkbox"
                defaultChecked
                aria-label={"Activar regla: " + x[0]}
              />
            </label>
          ))}
        </Card>
      </div>
      <aside className="support-column">
        <SectionTitle
          number="A"
          letter
          title="Semáforo de riesgo"
          description="Criterios configurados para la convocatoria."
        />
        <Card className="risk-summary">
          <RiskRow
            label="Alto · acción inmediata"
            count="12"
            tone="high"
            percent={20}
          />
          <RiskRow
            label="Medio · dar seguimiento"
            count="28"
            tone="medium"
            percent={27}
          />
          <RiskRow label="Bajo · al día" count="66" tone="low" percent={53} />
          <button
            className="button button-light button-full"
            onClick={() =>
              actions.notify("Criterios de riesgo abiertos para configuración.")
            }
            type="button"
          >
            <SlidersHorizontal size={15} /> Ajustar criterios
          </button>
        </Card>
        <SectionTitle
          number="B"
          letter
          title="Avisos programados"
          description="Recordatorios antes del vencimiento."
        />
        <Card className="reminder-list">
          {[15, 10, 5, 3, 1].map((d) => (
            <div className="reminder-row" key={d}>
              <span className="reminder-days">{d}</span>
              <div>
                <strong>
                  {d} {d === 1 ? "día" : "días"} antes
                </strong>
                <small>Correo y aviso en el portal</small>
              </div>
              <CheckCircle2 size={16} className="reminder-check" />
            </div>
          ))}
        </Card>
        <InfoNote
          icon={Mail}
          title="Mensajes trazables"
          text="El envío se registrará en el historial cuando exista la integración."
        />
      </aside>
    </div>
  );
}

export function ReportsView({ actions }) {
  const reports = [
    [
      "Reporte individual",
      "Avance, entregas y seguimiento de una persona.",
      Users,
      "PDF",
    ],
    [
      "Matriz consolidada",
      "Resumen por programa, tutor, avance y riesgo.",
      FileBarChart2,
      "Excel",
    ],
    [
      "Informe de trazabilidad",
      "Historial cronológico de contactos y cambios.",
      ShieldCheck,
      "PDF / Excel",
    ],
    [
      "Resumen ejecutivo",
      "Indicadores generales de la convocatoria.",
      ChartNoAxesCombined,
      "PDF",
    ],
  ];
  return (
    <div className="page-grid">
      <div className="primary-column">
        <SectionTitle
          number="1"
          title="Generar un reporte"
          description="Elige el informe y filtra el periodo que necesitas."
        />
        <div className="report-grid">
          {reports.map(([title, desc, Icon, format], i) => (
            <Card className="report-card" key={title}>
              <span className={"report-icon report-" + i}>
                <Icon size={19} />
              </span>
              <Pill tone="neutral">{format}</Pill>
              <h3>{title}</h3>
              <p>{desc}</p>
              <button
                type="button"
                className="button button-light"
                onClick={() =>
                  actions.notify(title + " listo como reporte de demostración.")
                }
              >
                Preparar reporte <ArrowRight size={14} />
              </button>
            </Card>
          ))}
        </div>
        <div className="section-gap">
          <SectionTitle
            number="2"
            title="Actividad reciente"
            description="Últimos archivos preparados en esta vista."
          />
        </div>
        <Card className="recent-report">
          <span className="file-icon pdf">
            <FileText size={18} />
          </span>
          <div>
            <strong>Matriz de seguimiento · Convocatoria 2026-A</strong>
            <small>CSV · Generado hoy a las 10:24 · 106 postulantes</small>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Descargar matriz"
            onClick={actions.exportCsv}
          >
            <Download size={17} />
          </button>
        </Card>
        <Card className="recent-report">
          <span className="file-icon xls">
            <FileBarChart2 size={18} />
          </span>
          <div>
            <strong>Postulantes en riesgo · Noviembre</strong>
            <small>CSV · Generado ayer · 12 registros</small>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Descargar reporte"
            onClick={actions.exportCsv}
          >
            <Download size={17} />
          </button>
        </Card>
      </div>
      <aside className="support-column">
        <SectionTitle
          number="A"
          letter
          title="Filtros del reporte"
          description="Delimita la información del archivo."
        />
        <Card className="side-form">
          <label className="field">
            <span>Convocatoria</span>
            <select defaultValue="Convocatoria 2026-A">
              <option>Convocatoria 2026-A</option>
              <option>Convocatoria 2025-B</option>
            </select>
          </label>
          <label className="field">
            <span>Programa</span>
            <select defaultValue="Todos">
              <option>Todos</option>
              <option>MBA</option>
              <option>Ingeniería de Software</option>
              <option>Educación</option>
              <option>Finanzas</option>
            </select>
          </label>
          <label className="field">
            <span>Formato de salida</span>
            <select defaultValue="Excel (.xlsx)">
              <option>Excel (.xlsx)</option>
              <option>PDF</option>
            </select>
          </label>
          <button
            className="button button-dark button-full"
            type="button"
            onClick={() =>
              actions.notify("Reporte preparado con los filtros seleccionados.")
            }
          >
            Aplicar filtros
          </button>
        </Card>
        <InfoNote
          icon={FileClock}
          title="Descargas seguras"
          text="Los archivos finales se generarán desde la API y respetarán los permisos del usuario."
        />
      </aside>
    </div>
  );
}

export function UsersTable() {
  return (
    <TableWrap caption="Usuarios activos y roles">
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Correo</th>
          <th>Rol</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {users.map((x) => (
          <tr key={x.email}>
            <th scope="row">
              <span className="person-cell">
                <Avatar initials={x.initials} tone="blue" size="small" />
                <span>{x.name}</span>
              </span>
            </th>
            <td>{x.email}</td>
            <td>{x.role}</td>
            <td>
              <Pill tone="success" dot>
                {x.state}
              </Pill>
            </td>
          </tr>
        ))}
      </tbody>
    </TableWrap>
  );
}
