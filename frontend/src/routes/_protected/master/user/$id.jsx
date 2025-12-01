import {createFileRoute, redirect} from '@tanstack/react-router';
import UserDetail from "@/pages/master/user/detail/index.jsx";

export const Route = createFileRoute('/_protected/master/user/$id')({
    component: UserDetail,
});