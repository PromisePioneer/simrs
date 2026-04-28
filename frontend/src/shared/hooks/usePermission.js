import {useAuthStore} from "@features/auth";

export const usePermission = () => {
    const {userData} = useAuthStore();


    const isSuperAdmin = userData?.roles?.some(
        role => role.name === "Super Admin"
    );

    const hasPermission = (permission) => {
        if (isSuperAdmin) return true;

        const result = userData?.permissions?.some(p => p === permission);

        console.log('CHECK PERMISSION:', {
            permission,
            result
        });

        return result;
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