import { createFileRoute } from '@tanstack/react-router';
import User from '@/pages/master/User/detail/user.jsx';

export const Route = createFileRoute('/_protected/master/user/$id')({
    component: User,
});