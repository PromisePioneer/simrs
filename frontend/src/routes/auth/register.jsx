import {createFileRoute, redirect} from '@tanstack/react-router';
import Register from '@/pages/auth/register.jsx';
import {useAuthStore} from '@/store/authStore.js';

export const Route = createFileRoute('/auth/register')({
    beforeLoad: () => {
        const {loggedIn} = useAuthStore.getState();
        if (loggedIn) {
            throw redirect({to: '/dashboard'});
        }
    },
    component: Register,
});