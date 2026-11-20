import { useState } from "react";
import { ArrowRight, CheckCircle2, GraduationCap, Info } from "lucide-react";

export function AuthScreen({ onLogin, notify }) {
  const [view, setView] = useState("login");
  const [demoRole, setDemoRole] = useState("coordinador");
  function submit(e) {
    e.preventDefault();
    if (view === "recover") {
      notify("Si el correo está registrado, recibirá instrucciones.");
      setView("login");
    } else {
      onLogin(demoRole);
    }
  }
  return (
    <main className="auth-shell">
      <section className="auth-visual">
        <div className="brand-lockup">
          <span className="brand-mark">
            <GraduationCap size={21} />
          </span>
          <span className="brand-name">
            impulso<span>posgrados</span>
          </span>
        </div>
        <div className="auth-visual-content">
          <span className="eyebrow">PORTAL ACADÉMICO</span>
          <h1>
            Tu siguiente paso
            <br />
            empieza aquí.
          </h1>
          <p>
            Un espacio para acompañar tu proceso de formación y crecimiento
            profesional.
          </p>
          <div className="auth-benefits">
            <span>
              <CheckCircle2 size={16} /> Sigue tu avance académico
            </span>
            <span>
              <CheckCircle2 size={16} /> Coordina con tu tutor
            </span>
            <span>
              <CheckCircle2 size={16} /> Mantén tus entregas al día
            </span>
          </div>
        </div>
        <span className="auth-decoration auth-decoration-one" />
        <span className="auth-decoration auth-decoration-two" />
        <small className="auth-visual-footer">
          Impulso · Formación de posgrado
        </small>
      </section>
      <section className="auth-form-side">
        <div className="auth-form-card">
          <div className="auth-mobile-brand">
            <GraduationCap size={21} /> Impulso
          </div>
          <span className="eyebrow">BIENVENIDO/A</span>
          <h2>
            {view === "login"
              ? "Inicia sesión"
              : view === "recover"
                ? "Recupera tu acceso"
                : "Crea tu cuenta"}
          </h2>
          <p>
            {view === "login"
              ? "Ingresa con tu correo institucional para continuar."
              : view === "recover"
                ? "Te enviaremos instrucciones al correo asociado a tu cuenta."
                : "Regístrate para iniciar tu proceso de postulación."}
          </p>
          <form onSubmit={submit} className="auth-form">
            {view === "register" && (
              <label className="field">
                <span>Nombre completo</span>
                <input
                  required
                  autoComplete="name"
                  placeholder="Nombre y apellido"
                />
              </label>
            )}
            <label className="field">
              <span>Correo electrónico</span>
              <input
                required
                type="email"
                autoComplete="email"
                placeholder="nombre@institucion.edu.ec"
              />
            </label>
            {view !== "recover" && (
              <label className="field">
                <span>Contraseña</span>
                <input
                  required
                  type="password"
                  autoComplete={
                    view === "login" ? "current-password" : "new-password"
                  }
                  placeholder="Ingresa tu contraseña"
                  minLength="8"
                />
              </label>
            )}
            {view === "login" && (
              <button
                className="auth-forgot"
                type="button"
                onClick={() => setView("recover")}
              >
                ¿Olvidaste tu contraseña?
              </button>
            )}
            <button
              className="button button-primary button-full auth-submit"
              type="submit"
            >
              {view === "login"
                ? "Iniciar sesión"
                : view === "recover"
                  ? "Enviar instrucciones"
                  : "Crear cuenta"}{" "}
              <ArrowRight size={16} />
            </button>
          </form>
          <div className="auth-switch">
            {view === "login" ? (
              <>
                ¿Aún no tienes cuenta?{" "}
                <button onClick={() => setView("register")} type="button">
                  Regístrate
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes una cuenta?{" "}
                <button onClick={() => setView("login")} type="button">
                  Inicia sesión
                </button>
              </>
            )}
          </div>
          <p className="auth-demo-note">
            <Info size={14} /> Acceso visual de demostración. La autenticación
            se conectará a FastAPI.
          </p>
          {view === "login" && (
            <div className="auth-demo-access">
              <label className="field">
                <span>Entrar directamente como</span>
                <select value={demoRole} onChange={(event) => setDemoRole(event.target.value)}>
                  <option value="coordinador">Coordinador</option>
                  <option value="tutor">Tutor</option>
                  <option value="postulante">Postulante</option>
                  <option value="administrador">Administrador</option>
                </select>
              </label>
              <button className="button button-light button-full" type="button" onClick={() => onLogin(demoRole)}>
                Acceder a la demostración
              </button>
              <small>Acceso local de prueba; no requiere una cuenta real.</small>
            </div>
          )}
        </div>
        <footer className="auth-footer">
          © 2026 Impulso · Ayuda y privacidad
        </footer>
      </section>
    </main>
  );
}
