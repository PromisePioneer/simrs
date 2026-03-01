import { createFileRoute } from '@tanstack/react-router'
import OutpatientVisitDetail from "@/pages/outpatient/visit/diagnose/detail.jsx";

export const Route = createFileRoute('/_protected/outpatient/visit/$id')({
  component: OutpatientVisitDetail,
})

