import {createFileRoute} from '@tanstack/react-router';
import Users from '@/pages/Master/User/users.jsx';

export const Route = createFileRoute('/_protected/master/user/')({
    component: Users,
});