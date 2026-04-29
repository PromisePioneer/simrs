import { createFileRoute } from '@tanstack/react-router'
import AppointmentPage from "@features/appointment/pages/index.jsx";

export const Route = createFileRoute('/_protected/appointments/')({
  component: AppointmentPage,
});
