import {createFileRoute} from '@tanstack/react-router';
import Index from '@features/dashboard/pages/index.jsx';
import DashboardPage from "@features/dashboard/pages/index.jsx";

export const Route = createFileRoute('/_protected/dashboard')({
    component: DashboardPage,
});