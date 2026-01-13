import {useAuthStore} from "@/store/authStore.js";

export const usePermission = () => {
    const {userData} = useAuthStore();


    const isSuperAdmin = userData?.roles?.some(
        role => role.name === "Super Admin"
    );

    const hasPermission = (permission) => {
        if (isSuperAdmin) return true;
        if (!userData?.roles) return false;

        return userData.roles.some(role =>
            role.permissions?.some(p => p.name === permission)
        );
    };

    const hasAnyPermission = (permissions = []) => {
        return permissions.some(permission => hasPermission(permission));
    };

    const hasAllPermissions = (permissions = []) => {
        return permissions.every(permission => hasPermission(permission));
    };

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions
    };
};