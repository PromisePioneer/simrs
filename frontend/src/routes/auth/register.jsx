import {createFileRoute, redirect} from '@tanstack/react-router';
import Register from '@features/auth/pages/register.jsx';
import {useAuthStore} from '@features/auth';

export const Route = createFileRoute('/auth/register')({
    beforeLoad: () => {
        const {loggedIn} = useAuthStore.getState();
        if (loggedIn) {
            throw redirect({to: '/dashboard'});
        }
    },
    component: Register,
});