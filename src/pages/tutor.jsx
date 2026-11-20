import { EmptyState } from "../components/ui.jsx";
import { TutorApplicantsPage } from "./tutor/TutorApplicantsPage.jsx";
import { TutorFollowupsPage } from "./tutor/TutorFollowupsPage.jsx";
import { TutorAgendaPage } from "./tutor/TutorAgendaPage.jsx";
import { TutorAlertsPage } from "./tutor/TutorAlertsPage.jsx";
import { TutorTemplatesPage } from "./tutor/TutorTemplatesPage.jsx";
import { TutorReportsPage } from "./tutor/TutorReportsPage.jsx";
export function TutorPage(props) {
  switch (props.route) {
    case "tutor-postulantes":
      return <TutorApplicantsPage {...props} />;
    case "tutor-seguimiento":
      return <TutorFollowupsPage {...props} />;
    case "agenda":
      return <TutorAgendaPage {...props} />;
    case "tutor-alertas":
      return <TutorAlertsPage {...props} />;
    case "plantillas":
      return <TutorTemplatesPage {...props} />;
    case "tutor-reportes":
      return <TutorReportsPage {...props} />;
    default:
      return (
        <EmptyState
          title="Sección no disponible"
          detail="Selecciona una opción del menú."
        />
      );
  }
}
