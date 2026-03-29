import { createFileRoute } from "@tanstack/react-router";
import OutpatientBillingPage from "@features/billing/pages/outpatient.jsx";

export const Route = createFileRoute("/_protected/billing/outpatient/")({
    component: OutpatientBillingPage,
});
