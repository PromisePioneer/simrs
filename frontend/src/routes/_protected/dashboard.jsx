import { createFileRoute } from '@tanstack/react-router';
import Index from '@/pages/Dashboard/index.jsx';

export const Route = createFileRoute('/_protected/dashboard')({
    component: Index,
});