import * as shared from "./shared.jsx";
import { Check, Eye, FileCheck2, LockKeyhole, ShieldCheck } from "lucide-react";
import { Section, SidePanel } from "../../components/board/BoardPrimitives.jsx";

const { Avatar, Pill } = shared;

export function ApplicantProfilePage({ notify, showForm, profile, onProfileChange }) {
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
        <Section marker="01" title="Datos personales" hint="Perfil 85% completo">
          <div className="reference-profile-identity">
            <Avatar initials={initials} tone="violet" />
            <div>
              <strong>{fullName}</strong>
              <span>Postulante · Registrado el 02 sep 2026</span>
            </div>
            <Pill tone="success" dot>Perfil 85%</Pill>
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
            <label className="reference-board-field">
              Documento de identidad
              <input value={profile.identity} onChange={update("identity")} />
            </label>
            <label className="reference-board-field">
              Programa
              <input value={profile.program} readOnly />
            </label>
          </div>
          <button
            type="button"
            className="reference-board-primary-action reference-profile-save"
            onClick={() => notify("Datos guardados como demostración local.")}
          >
            <Check size={16} /> Guardar cambios
          </button>
        </Section>
        <Section marker="02" title="Documentos personales" hint="Archivos asociados a tu inscripción">
          <div className="reference-profile-document">
            <FileCheck2 size={20} />
            <div>
              <strong>Documento de identidad.pdf</strong>
              <span>Cargado el 02 sep 2026 · Verificado</span>
            </div>
            <Pill tone="success">Verificado</Pill>
            <button
              type="button"
              className="reference-board-outline-action"
              onClick={() => notify("El documento se abrirá de forma segura cuando exista la API.")}
            >
              <Eye size={15} /> Ver
            </button>
          </div>
        </Section>
      </article>
      <aside className="reference-board-aside">
        <SidePanel title="Cuenta" subtitle="Acceso y protección de tu información.">
          <Section marker="A" title="Seguridad">
            <div className="reference-profile-security">
              <LockKeyhole size={19} />
              <div>
                <strong>Contraseña</strong>
                <span>Actualizada recientemente</span>
              </div>
            </div>
            <button
              className="reference-board-outline-action reference-profile-full-action"
              onClick={() => showForm("Cambiar contraseña", "La actualización se procesará de forma segura.", [
                { label: "Contraseña actual", name: "actual", type: "password", required: true },
                { label: "Nueva contraseña", name: "nueva", type: "password", required: true },
              ])}
              type="button"
            >
              Cambiar contraseña
            </button>
          </Section>
          <Section marker="B" title="Privacidad">
            <div className="reference-profile-security">
              <ShieldCheck size={19} />
              <p className="reference-profile-note">
                Tus datos personales solo deben ser visibles para el equipo autorizado.
              </p>
            </div>
          </Section>
        </SidePanel>
      </aside>
    </div>
  );
}
