import {redirect} from '@tanstack/react-router';
import {useAuthStore} from '@features/auth';
import {
    checkPermission,
    checkAllPermissions,
    hasActiveSubscription,
    hasPlanAtLeast,
} from '@shared/utils';

const ensureSubscription = (userData) => {
    if (!hasActiveSubscription(userData)) {
        throw redirect({to: '/upgrade'});
    }
};

export const requirePermission = (permission) => {
    return async () => {
        const {userData} = useAuthStore.getState();

        const isSuperAdmin = userData?.roles?.some(
            role => (typeof role === 'string' ? role : role?.name) === 'Super Admin'
        );
        if (isSuperAdmin) return;

        ensureSubscription(userData);

        const hasAccess = checkPermission(userData, permission);
        if (!hasAccess) {
            throw redirect({to: '/403'});
        }
    };
};

export const requireAnyPermission = (permissions = []) => {
    return async () => {
        const {userData} = useAuthStore.getState();

        const isSuperAdmin = userData?.roles?.some(
            role => (typeof role === 'string' ? role : role?.name) === 'Super Admin'
        );
        if (isSuperAdmin) return;

        ensureSubscription(userData);

        const hasAccess = checkAnyPermission(userData, permissions);
        if (!hasAccess) {
            throw redirect({to: '/403'});
        }
    };
};

export const requireAllPermissions = (permissions = []) => {
    return async () => {
        const {userData} = useAuthStore.getState();

        const isSuperAdmin = userData?.roles?.some(
            role => (typeof role === 'string' ? role : role?.name) === 'Super Admin'
        );
        if (isSuperAdmin) return;

        ensureSubscription(userData);

        const hasAccess = checkAllPermissions(userData, permissions);
        if (!hasAccess) {
            throw redirect({to: '/403'});
        }
    };
};

export const requirePlan = (minPlanSlug) => {
    return async () => {
        const {userData} = useAuthStore.getState();

        const isSuperAdmin = userData?.roles?.some(
            role => (typeof role === 'string' ? role : role?.name) === 'Super Admin'
        );
        if (isSuperAdmin) return;

        if (!hasPlanAtLeast(userData, minPlanSlug)) {
            throw redirect({to: '/upgrade'});
        }
    };
};