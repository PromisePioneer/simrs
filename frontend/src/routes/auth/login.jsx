import {createFileRoute, redirect} from '@tanstack/react-router';
import Login from '@features/auth/pages/login.jsx';
import {useAuthStore} from '@features/auth';

export const Route = createFileRoute('/auth/login')({
    beforeLoad: () => {
        const {loggedIn} = useAuthStore.getState();
        if (loggedIn) {
            throw redirect({to: '/dashboard'});
        }
    },
    component: Login,
});