import { createFileRoute } from '@tanstack/react-router';
import EmailVerify from '@/pages/email-verify.jsx';

export const Route = createFileRoute('/email/verify')({
    component: EmailVerify,
});