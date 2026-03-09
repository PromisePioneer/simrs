// src/middleware/permissionMiddleware.js
import {redirect} from '@tanstack/react-router';
import {useAuthStore} from '@/store/authStore.js';
import {checkPermission, checkAnyPermission, checkAllPermissions} from '@/utils/permissionCheck';

export const requirePermission = (permission) => {
    return async () => {
        const {userData} = useAuthStore.getState();
        const isSuperAdmin = userData?.roles?.some(
            role => role.name === "Super Admin"
        );
        const hasAccess = checkPermission(userData, permission);
        if (!hasAccess || !isSuperAdmin) {
            throw redirect({
                to: '/403',
            });
        }
    };
};

export const requireAnyPermission = (permissions = []) => {
    return async () => {
        const {userData} = useAuthStore.getState();

        const hasAccess = checkAnyPermission(userData, permissions);

        if (!hasAccess) {
            throw redirect({
                to: '/403',
            });
        }
    };
};

export const requireAllPermissions = (permissions = []) => {
    return async () => {
        const {userData} = useAuthStore.getState();

        const hasAccess = checkAllPermissions(userData, permissions);

        if (!hasAccess) {
            throw redirect({
                to: '/403',
            });
        }
    };
};