import {createFileRoute, Outlet, redirect} from '@tanstack/react-router';
import {useAuthStore} from '@/store/authStore.js';
import {useEffect} from 'react';
import {useLoadingStore} from "@/store/loadingStore.js";

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

    return <Outlet/>;
}

export const Route = createFileRoute('/_protected')({
    beforeLoad: async ({location}) => {
        const {loggedIn, checkAuth} = useAuthStore.getState();
        const setLoading = useLoadingStore.getState().setLoading;
        setLoading(true);
        const isAuthenticated = await checkAuth();
        setLoading(false);

        if (!isAuthenticated) {
            throw redirect({
                to: '/auth/login',
                search: {redirect: location.href},
            });
        }
    },
    component: ProtectedLayout,
});