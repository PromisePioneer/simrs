import { createFileRoute } from '@tanstack/react-router'
import OutpatientVisitDetail from "@features/outpatient/pages/visit/diagnose/detail.jsx";

export const Route = createFileRoute('/_protected/outpatient/visit/$id')({
  component: OutpatientVisitDetail,
})

