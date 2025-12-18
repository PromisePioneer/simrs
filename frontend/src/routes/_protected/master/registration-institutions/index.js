import {createFileRoute} from '@tanstack/react-router'
import registrationInstitutionsPage from "@/pages/master/registration-institutions/index.jsx";

export const Route = createFileRoute(
    '/_protected/master/registration-institutions/',
)({
    component: registrationInstitutionsPage,
});