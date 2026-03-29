import {createFileRoute} from '@tanstack/react-router'
import UsersManagementPage from "@features/users-management/pages/index.jsx";
import {z} from "zod";


const searchSchema = z.object({
    tab: z.enum(['users', 'roles']).optional().default('users')
})

export const Route = createFileRoute('/_protected/settings/users-management/')({
    validateSearch: searchSchema,
    component: UsersManagementPage,
})
