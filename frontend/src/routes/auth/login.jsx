import {createFileRoute, redirect} from '@tanstack/react-router';
import Login from '@/pages/auth/login.jsx';
import {useAuthStore} from '@/store/authStore.js';

export const Route = createFileRoute('/auth/login')({
    beforeLoad: () => {
        const {loggedIn} = useAuthStore.getState();
        if (loggedIn) {
            throw redirect({to: '/dashboard'});
        }
    },
    component: Login,
});