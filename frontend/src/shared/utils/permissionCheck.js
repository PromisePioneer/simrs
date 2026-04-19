export const checkPermission = (userData, permissionName) => {
    const isSuperAdmin = userData?.roles?.some(
        role => (typeof role === 'string' ? role : role?.name) === 'Super Admin'
    );
    if (isSuperAdmin) return true;

    // flat array of string
    return userData?.permissions?.includes(permissionName) ?? false;
};


export const checkAnyPermission = (userData, permissions = []) => {
    return permissions.some(permission => checkPermission(userData, permission));
};


export const checkAllPermissions = (userData, permissions = []) => {
    return permissions.every(permission => checkPermission(userData, permission));
};


export const hasActiveSubscription = (userData) => {
    return userData?.subscription?.status === 'active';
};


export const getCurrentPlanSlug = (userData) => {
    return userData?.subscription?.plan?.slug ?? null;
};


const PLAN_ORDER = { free: 0, basic: 1, pro: 2 };


export const hasPlanAtLeast = (userData, minPlanSlug) => {
    const isSuperAdmin = userData?.roles?.some(
        role => (typeof role === 'string' ? role : role?.name) === 'Super Admin'
    );
    if (isSuperAdmin) return true;

    const currentSlug = getCurrentPlanSlug(userData);
    if (!currentSlug) return false;

    return (PLAN_ORDER[currentSlug] ?? -1) >= (PLAN_ORDER[minPlanSlug] ?? 999);
};