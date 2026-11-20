export function pageHeading(route) {
  return (
    {
      panel: "Panel ejecutivo",
      programas: "Programas y convocatorias",
      cursos: "Cursos preparatorios",
      postulantes: "Postulantes",
      seguimiento: "Seguimientos",
      alertas: "Alertas de riesgo",
      reportes: "Reportes",
      auditoria: "Bitácora de auditoría",
      ajustes: "Ajustes del sistema",
      avance: "Hola, Josué",
      "mis-cursos": "Mis cursos preparatorios",
      evidencias: "Sube certificados y proyectos",
      plazos: "Mis plazos",
      avisos: "Notificaciones",
      "mi-tutor": "Acompañamiento personalizado",
      perfil: "Datos personales",
      "tutor-postulantes": "Seguimiento de postulantes",
      "tutor-seguimiento": "Casos de seguimiento",
      agenda: "Agenda de contactos",
      "tutor-alertas": "Alertas de mis postulantes",
      plantillas: "Plantillas de mensajes",
      "tutor-reportes": "Mis reportes",
      "admin-resumen": "Administración del portal",
      usuarios: "Usuarios y roles",
      configuracion: "Parámetros generales",
      "admin-reportes": "Reportes globales",
    }[route] || "Portal académico"
  );
}
export function pageDescription(route) {
  return (
    {
      panel: "Coordinador · Convocatoria 2026-II · datos de ejemplo",
      programas: "Crea programas, abre convocatorias y define fechas.",
      cursos: "Define cursos, proyectos y ponderaciones.",
      postulantes: "Supervisa avance, tutor y riesgo.",
      seguimiento: "Supervisa el trabajo de los tutores.",
      alertas: "Semáforo y reglas automáticas.",
      reportes: "Genera y exporta en un clic.",
      auditoria: "Historial completo de acciones del sistema.",
      ajustes: "Usuarios, roles y parámetros.",
      avance: "Maestría en Ingeniería de Software · Convocatoria 2026-II",
      "mis-cursos": "Maestría en Ingeniería de Software · 2026-II",
      evidencias: "Carga certificados y proyectos para revisión.",
      plazos: "Fechas límite y días restantes.",
      avisos: "Todo lo que ocurre en tu proceso.",
      "mi-tutor": "Mi tutora asignada a tu programa.",
      perfil: "Perfil 70% completo.",
      "tutor-postulantes": "Tutora M. Torres · 24 postulantes asignados.",
      "tutor-seguimiento": "Historial por postulante.",
      agenda: "Tu semana de seguimientos.",
      "tutor-alertas": "Semáforo y vencimientos.",
      plantillas: "Contacta más rápido.",
      "tutor-reportes": "Genera y exporta en un clic.",
      "admin-resumen":
        "Estado general de usuarios, procesos y actividad del sistema.",
      usuarios: "Invita al equipo y administra sus roles de acceso.",
      configuracion: "Parámetros visibles para la operación del portal.",
      "admin-reportes": "Consulta el uso y actividad general de la plataforma.",
    }[route] || ""
  );
}
