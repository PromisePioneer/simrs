import { createFileRoute } from "@tanstack/react-router";
import OutpatientBillingPage from "@/pages/billing/outpatient.jsx";

export const Route = createFileRoute("/_protected/billing/outpatient/")({
    component: OutpatientBillingPage,
});
