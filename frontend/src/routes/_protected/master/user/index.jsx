import {createFileRoute} from '@tanstack/react-router';
import UserPage from "@/pages/master/user/index.jsx";

export const Route = createFileRoute('/_protected/master/user/')({
    component: UserPage
});