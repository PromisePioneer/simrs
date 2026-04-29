import { createFileRoute } from '@tanstack/react-router'
import AppointmentFormPage from "@features/appointment/pages/form.jsx";

export const Route = createFileRoute('/_protected/appointments/create')({
  component: AppointmentFormPage,
})