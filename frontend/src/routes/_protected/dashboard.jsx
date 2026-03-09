import {createFileRoute} from '@tanstack/react-router';
import Index from '@/pages/dashboard/index.jsx';
import DashboardPage from "@/pages/dashboard/index.jsx";

export const Route = createFileRoute('/_protected/dashboard')({
    component: DashboardPage,
});