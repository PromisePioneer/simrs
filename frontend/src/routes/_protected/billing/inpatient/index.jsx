import { createFileRoute } from "@tanstack/react-router";
import InpatientBillingPage from "@/pages/billing/inpatient.jsx";

export const Route = createFileRoute("/_protected/billing/inpatient/")({
    component: InpatientBillingPage,
});
