import { useAuthStore } from "@/features/auth/store/authStore.js";

export const usePermission = () => {
    const { userData } = useAuthStore();

    const isSuperAdmin = userData?.roles?.some((role) => role.name === "Super Admin");

    const hasPermission = (permission) => {
        if (isSuperAdmin) return true;
        return userData?.permissions?.some((p) => p === permission) ?? false;
    };

    const hasAnyPermission = (permissions = []) =>
        permissions.some((permission) => hasPermission(permission));

    const hasAllPermissions = (permissions = []) =>
        permissions.every((permission) => hasPermission(permission));

    return { hasPermission, hasAnyPermission, hasAllPermissions, isSuperAdmin };
};
