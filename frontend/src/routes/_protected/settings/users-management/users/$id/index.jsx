import { createFileRoute } from '@tanstack/react-router'
import UserForm from "@features/users-management/pages/users/form.jsx";

export const Route = createFileRoute(
  '/_protected/settings/users-management/users/$id/',
)({
  component: UserForm,
})
