// src/routes/_protected.jsx
import {createFileRoute, Outlet, redirect} from '@tanstack/react-router';
import {useAuthStore} from '@features/auth';
import {useLoadingStore} from '@shared/store';

function ProtectedLayout() {
    return <Outlet/>;
}

export const Route = createFileRoute('/_protected')({
    beforeLoad: async ({location}) => {
        const {checkAuth} = useAuthStore.getState();
        const setLoading = useLoadingStore.getState().setLoading;

        setLoading(true);
        const result = await checkAuth();
        setLoading(false);

        if (!result) {
            throw redirect({
                to: '/auth/login',
                search: {redirect: location.href},
            });
        }

        // ✅ Redirect ke halaman upgrade kalau subscription expired/tidak ada
        if (result === 'upgrade') {
            // Jangan redirect kalau sudah di halaman upgrade
            if (!location.href.includes('/upgrade')) {
                throw redirect({to: '/upgrade'});
            }
        }
    },
    component: ProtectedLayout,
});