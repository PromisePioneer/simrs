import {createFileRoute, Outlet, redirect} from '@tanstack/react-router';
import {useAuthStore} from '@/store/authStore.js';
import {useEffect} from 'react';

function ProtectedLayout() {
    const {loggedIn, fetchUser, userData, isLoading} = useAuthStore();

    useEffect(() => {
        const initAuth = async () => {
            if (loggedIn && !userData) {
                await fetchUser();
            }
        };
        initAuth();
    }, [loggedIn, userData, fetchUser]);

    // Optional: Show loading state
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <Outlet/>;
}

export const Route = createFileRoute('/_protected')({
    beforeLoad: async ({location}) => {
        const {loggedIn, checkAuth} = useAuthStore.getState();

        console.log('🔐 Protected Route Check:', {loggedIn});

        // Double check authentication
        const isAuthenticated = await checkAuth();

        if (!isAuthenticated) {
            throw redirect({
                to: '/auth/login',
                search: {
                    redirect: location.href,
                },
            });
        }
    },
    component: ProtectedLayout,
});