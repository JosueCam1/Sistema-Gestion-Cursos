import { EmptyState } from "../components/ui.jsx";
import { ProgressOverviewPage } from "./applicant/StudentProgressPage.jsx";
import { ApplicantCoursesPage } from "./applicant/ApplicantCoursesPage.jsx";
import { ApplicantEvidencePage } from "./applicant/ApplicantEvidencePage.jsx";
import { ApplicantDeadlinesPage } from "./applicant/ApplicantDeadlinesPage.jsx";
import { ApplicantNoticesPage } from "./applicant/ApplicantNoticesPage.jsx";
import { ApplicantTutorPage } from "./applicant/ApplicantTutorPage.jsx";
import { ApplicantProfilePage } from "./applicant/ApplicantProfilePage.jsx";
export { StatusPill } from "./applicant/shared.jsx";
export function ApplicantPage(props) {
  switch (props.route) {
    case "avance":
      return <ProgressOverviewPage {...props} />;
    case "mis-cursos":
      return <ApplicantCoursesPage {...props} />;
    case "evidencias":
      return <ApplicantEvidencePage {...props} />;
    case "plazos":
      return <ApplicantDeadlinesPage {...props} />;
    case "avisos":
      return <ApplicantNoticesPage {...props} />;
    case "mi-tutor":
      return <ApplicantTutorPage {...props} />;
    case "perfil":
      return <ApplicantProfilePage {...props} />;
    default:
      return (
        <EmptyState
          title="Sección no disponible"
          detail="Selecciona una opción del menú."
        />
      );
  }
}
