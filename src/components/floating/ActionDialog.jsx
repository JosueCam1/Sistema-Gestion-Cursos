import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, LockKeyhole, Send, X } from "lucide-react";
import { ActionDialogSkeleton } from "./ActionDialogSkeleton.jsx";

const applicants = [
  ["Ana Paredes", "MBA", "riesgo alto", true],
  ["Karla Mena", "Educación", "riesgo medio", true],
  ["Josué Camisan", "Software", "riesgo bajo", false],
  ["Luis Andrade", "Finanzas", "riesgo bajo", false],
];

export function ActionDialog({ dialog, onClose, onSubmit }) {
  const ref = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState("3 días");
  const [selectedApplicants, setSelectedApplicants] = useState(["Ana Paredes", "Karla Mena"]);
  const isReminder = dialog?.title?.toLowerCase().includes("recordatorio");
  const isReassignment = dialog?.title?.toLowerCase().includes("reasignar");
  const isAssignTutor = dialog?.title?.toLowerCase().includes("asignar tutor");
  const isSchedule = dialog?.title?.toLowerCase().includes("configurar envío");
  const isInvite = dialog?.title?.toLowerCase().includes("invitar usuario");
  const isHelp = dialog?.title?.toLowerCase().includes("centro de ayuda");

  useEffect(() => {
    if (!dialog) {
      if (ref.current?.open) ref.current.close();
      return;
    }
    if (!ref.current?.open) ref.current?.showModal();
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 420);
    return () => window.clearTimeout(timer);
  }, [dialog]);

  useEffect(() => {
    setSelectedDays("3 días");
    setSelectedApplicants(["Ana Paredes", "Karla Mena"]);
  }, [dialog?.title]);

  const toggleApplicant = (name) => setSelectedApplicants((current) =>
    current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
  );

  return (
    <dialog ref={ref} className="floating-dialog" aria-labelledby="floating-dialog-title" onClose={onClose} onClick={(event) => { if (event.target === ref.current) onClose(); }}>
      {dialog && (loading ? <ActionDialogSkeleton rows={isReassignment ? 4 : 3} /> : (
        <form onSubmit={onSubmit}>
          <header className="floating-dialog-header">
            <div><h2 id="floating-dialog-title">{dialog.title}</h2><p>{dialog.description}</p></div>
            <button className="floating-icon-button" type="button" aria-label="Cerrar" onClick={onClose}><X size={18} /></button>
          </header>
          {isReminder ? (
            <div className="floating-dialog-body">
              <label className="floating-field"><span>Destinatarios</span>
                <div className="floating-choice-row">{[["15 días", 40], ["10 días", 28], ["5 días", 17], ["3 días", 9], ["1 día", 4]].map(([label, count]) => <button type="button" key={label} className={selectedDays === label ? "selected" : ""} onClick={() => setSelectedDays(label)}>{label} <strong>{count}</strong></button>)}</div>
                <input type="hidden" name="destinatarios" value={selectedDays} />
              </label>
              <label className="floating-field"><span>Programa</span><select name="programa"><option>Todos los programas</option><option>MBA</option><option>Ingeniería de Software</option><option>Educación</option><option>Finanzas</option></select></label>
              <div className="floating-summary"><span>Recibirán este correo</span><strong>{selectedDays === "3 días" ? 9 : selectedDays === "1 día" ? 4 : selectedDays === "5 días" ? 17 : selectedDays === "10 días" ? 28 : 40} postulantes</strong></div>
              <label className="floating-field"><span>Plantilla</span><input name="plantilla" defaultValue="Recordatorio de plazo" /></label>
              <label className="floating-field"><span>Mensaje</span><textarea name="mensaje" rows="3" defaultValue="Hola {nombre}, tu plazo vence el {fecha_limite}. Revisa tus actividades pendientes en la plataforma." required /></label>
            </div>
          ) : isReassignment ? (
            <div className="floating-dialog-body">
              <div className="floating-tutor-transfer">
                <label className="floating-field"><span>Tutor actual</span><select name="tutorActual"><option>M. Torres · 24</option><option>C. Vega · 19</option><option>R. León · 14</option></select></label>
                <ArrowRight aria-hidden="true" />
                <label className="floating-field"><span>Nuevo tutor</span><select name="nuevoTutor"><option>C. Vega · 19</option><option>M. Torres · 24</option><option>R. León · 14</option></select></label>
              </div>
              <fieldset className="floating-applicant-list"><legend>Postulantes a mover</legend>
                {applicants.map(([name, program, risk]) => <label className="floating-applicant" key={name}><input type="checkbox" checked={selectedApplicants.includes(name)} onChange={() => toggleApplicant(name)} /><span>{name}</span><small>{program} · {risk}</small></label>)}
              </fieldset>
              <div className="floating-summary"><span>{selectedApplicants.length} postulantes pasarán al nuevo tutor</span><strong>22 / 21</strong></div>
              <input type="hidden" name="postulantes" value={selectedApplicants.join(", ")} />
            </div>
          ) : isAssignTutor ? (
            <div className="floating-dialog-body">
              <label className="floating-field"><span>Tutor</span><select name="tutor" defaultValue="M. Torres"><option>M. Torres</option><option>C. Vega</option><option>R. León</option></select></label>
            </div>
          ) : isSchedule ? (
            <div className="floating-dialog-body">
              <label className="floating-field"><span>Frecuencia</span><select name="frecuencia"><option>Cada lunes</option><option>Cada mes</option></select></label>
              <label className="floating-field"><span>Destinatarios</span><input name="destinatarios" type="email" placeholder="Correo institucional" required /></label>
            </div>
          ) : isInvite ? (
            <div className="floating-dialog-body floating-invite-fields">
              <label className="floating-field"><span>Nombre</span><input name="nombre" placeholder="Nombre y apellido" required /></label>
              <label className="floating-field"><span>Correo</span><input name="correo" type="email" placeholder="usuario@institucion.edu.ec" required /></label>
              <label className="floating-field"><span>Rol</span><select name="rol"><option>Tutor</option><option>Coordinador</option><option>Postulante</option><option>Administrador</option></select></label>
            </div>
          ) : isHelp ? (
            <div className="floating-dialog-body">
              <label className="floating-field"><span>¿Qué necesitas resolver?</span><textarea name="asunto" rows="3" placeholder="Escribe tu consulta" required /></label>
            </div>
          ) : (
            <div className="floating-dialog-body"><p className="floating-generic-description">{dialog.description}</p>{dialog.fields.map((field) => <label className="floating-field" key={field.name}><span>{field.label}</span>{field.type === "select" ? <select name={field.name} defaultValue={field.defaultValue ?? field.options?.[0]} required={field.required}>{field.options?.map((option) => <option key={option}>{option}</option>)}</select> : field.type === "textarea" ? <textarea name={field.name} defaultValue={field.defaultValue} placeholder={field.placeholder} rows="3" required={field.required} /> : <input type={field.type || "text"} name={field.name} defaultValue={field.defaultValue} placeholder={field.placeholder} required={field.required} />}</label>)}</div>
          )}
          <footer className="floating-dialog-footer">
            <span className="floating-local-note"><LockKeyhole size={13} /> Demostración local</span>
            <div><button type="button" className="floating-secondary" onClick={onClose}>Cancelar</button><button type="submit" className="floating-primary">{isReminder ? <><Send size={15} /> Enviar recordatorio</> : isReassignment ? "Reasignar tutores" : isAssignTutor ? <><Check size={15} /> Guardar asignación</> : isSchedule ? <><Check size={15} /> Guardar configuración</> : isInvite ? <><Check size={15} /> Enviar invitación</> : isHelp ? <><Send size={15} /> Enviar consulta</> : <><Check size={15} /> Guardar borrador</>}</button></div>
          </footer>
        </form>
      ))}
    </dialog>
  );
}
