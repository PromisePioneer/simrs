import { createFileRoute } from '@tanstack/react-router';
import LandingPage from '@shared/pages/landing';

export const Route = createFileRoute('/')({
    component: LandingPage,
});