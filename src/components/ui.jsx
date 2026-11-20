import { ArrowUpRight, FileText } from "lucide-react";

export function cx(...values) {
  return values.filter(Boolean).join(" ");
}
export function Progress({ value, color = "blue" }) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label={"Avance " + value + "%"}
    >
      <span
        className={"progress-fill " + color}
        style={{ width: value + "%" }}
      />
    </div>
  );
}
export function Pill({ children, tone = "neutral", dot = false }) {
  return (
    <span className={"pill pill-" + tone}>
      {dot && <i aria-hidden="true" />}
      {children}
    </span>
  );
}
export function Avatar({ initials, tone = "blue", size = "normal" }) {
  return (
    <span
      className={cx(
        "avatar",
        "avatar-" + tone,
        size === "small" && "avatar-small",
      )}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
export function SectionTitle({
  number,
  eyebrow = "GESTIÓN",
  title,
  description,
  action,
  letter = false,
}) {
  return (
    <header className="section-title">
      <span className="section-index">
        {letter ? number : String(number).padStart(2, "0")}
      </span>
      <div className="section-heading">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="section-action">{action}</div>}
    </header>
  );
}
export function Card({ children, className = "" }) {
  const Tag = className.includes("filter-card") ? "search" : "section";
  return <Tag className={"card " + className}>{children}</Tag>;
}
export function StatCard({
  icon: Icon,
  label,
  value,
  note,
  tone = "blue",
  trend,
}) {
  return (
    <Card className="stat-card">
      <span className={"stat-icon stat-" + tone}>
        <Icon size={18} />
      </span>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-note">
        {trend && (
          <span className="trend">
            <ArrowUpRight size={13} />
            {trend}
          </span>
        )}
        {note}
      </div>
    </Card>
  );
}
export function TableWrap({ caption, children }) {
  return (
    <div
      className="table-scroll"
      role="region"
      aria-label={caption}
      tabIndex="0"
    >
      <table>
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}
export function EmptyState({ icon: Icon = FileText, title, detail }) {
  return (
    <div className="empty-state">
      <span>
        <Icon size={20} />
      </span>
      <strong>{title}</strong>
      <p>{detail}</p>
    </div>
  );
}
