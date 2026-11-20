import { Check, ShieldCheck } from "lucide-react";
import { Avatar } from "../components/ui.jsx";
import { Section, SidePanel } from "../components/board/BoardPrimitives.jsx";

export function AccountProfilePage({ roleName, profile, onProfileChange, notify }) {
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();
  const initials = fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toLocaleUpperCase("es"))
    .join("");
  const update = (field) => (event) =>
    onProfileChange((current) => ({ ...current, [field]: event.target.value }));

  return (
    <div className="reference-board-layout reference-profile-layout">
      <article className="reference-board-main">
        <Section marker="01" title="Datos personales" hint="Información de tu cuenta">
          <div className="reference-profile-identity">
            <Avatar initials={initials} tone="violet" />
            <div>
              <strong>{fullName}</strong>
              <span>{roleName} · Portal académico</span>
            </div>
          </div>
          <div className="reference-profile-fields">
            <label className="reference-board-field">
              Nombres
              <input value={profile.firstName} onChange={update("firstName")} />
            </label>
            <label className="reference-board-field">
              Apellidos
              <input value={profile.lastName} onChange={update("lastName")} />
            </label>
            <label className="reference-board-field">
              Correo electrónico
              <input type="email" value={profile.email} onChange={update("email")} />
            </label>
            <label className="reference-board-field">
              Teléfono
              <input type="tel" value={profile.phone} onChange={update("phone")} />
            </label>
          </div>
          <button
            type="button"
            className="reference-board-primary-action reference-profile-save"
            onClick={() => notify("Perfil guardado en esta demostración local.")}
          >
            <Check size={16} /> Guardar cambios
          </button>
        </Section>
      </article>
      <aside className="reference-board-aside">
        <SidePanel title="Cuenta y seguridad" subtitle="Acceso y protección de tu información.">
          <Section marker="A" title="Sesión">
            <div className="reference-profile-security">
              <ShieldCheck size={20} />
              <div>
                <strong>Sesión protegida</strong>
                <span>Acceso de {roleName.toLocaleLowerCase("es")}</span>
              </div>
            </div>
            <p className="reference-profile-note">
              Tus datos personales solo deben ser visibles para el equipo autorizado.
            </p>
          </Section>
        </SidePanel>
      </aside>
    </div>
  );
}
