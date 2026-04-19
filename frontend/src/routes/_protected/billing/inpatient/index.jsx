import { createFileRoute } from "@tanstack/react-router";
import InpatientBillingPage from "@features/billing/pages/inpatient.jsx";

export const Route = createFileRoute("/_protected/billing/inpatient/")({
    component: InpatientBillingPage,
});
