import { createFileRoute } from '@tanstack/react-router'
import UserForm from "@/pages/settings/users-management/users/form.jsx";

export const Route = createFileRoute(
  '/_protected/settings/users-management/users/$id/',
)({
  component: UserForm,
})
