import {createFileRoute} from '@tanstack/react-router'
import UserForm from "@/pages/master/user/form.jsx";

export const Route = createFileRoute('/_protected/master/user/create')({
    component: UserForm,
})
