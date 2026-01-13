// src/utils/permissionCheck.js
export const checkPermission = (userData, permissionName) => {
    const isSuperAdmin = userData?.roles?.some(
        role => role.name === "Super Admin"
    );

    if (isSuperAdmin) return true;

    if (!userData?.roles) return false;

    return userData.roles.some(role =>
        role.permissions?.some(p => p.name === permissionName)
    );
};

export const checkAnyPermission = (userData, permissions = []) => {
    return permissions.some(permission => checkPermission(userData, permission));
};

export const checkAllPermissions = (userData, permissions = []) => {
    return permissions.every(permission => checkPermission(userData, permission));
};