import {createFileRoute} from '@tanstack/react-router';
import RolePage from "@/pages/master/roles/index.jsx";

export const Route = createFileRoute('/_protected/master/role')({
    component: RolePage,
});