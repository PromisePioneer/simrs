import {useUserStore} from "@features/users-management/index.js";
import {useEffect} from "react";
import {PERMISSIONS} from "@shared/constants/index.js";
import {usePermission} from "@shared/hooks/index.js";


export const useUserIndex = () => {
    const store = useUserStore();

    const allIds = store.userData?.data?.map((a) => a.id) ?? [];
    const allSelected = allIds.length > 0 && allIds.every((id) => store.selectedIds.includes(id));
    const {hasPermission} = usePermission();


    useEffect(() => {
        store.fetchUsers({perPage: 20});
    }, [store.search, store.currentPage]);

    const getRoleBadgeVariant = (roleName) => {
        const role = roleName?.toLowerCase();
        if (role?.includes('super admin')) return 'destructive';
        if (role?.includes('owner')) return 'default';
        return 'outline';
    };


    return {
        ...store,
        allSelected,
        safeSelectedIds: Array.isArray(store.selectedIds) ? store.selectedIds : [],
        canCreate: hasPermission(PERMISSIONS.USER.CREATE),
        canEdit: hasPermission(PERMISSIONS.USER.EDIT),
        canDelete: hasPermission(PERMISSIONS.USER.DELETE),
        toggleAll: () => store.setSelectedIds(allSelected ? [] : allIds),
        toggleOne: (id) => store.setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        ),
        getRoleBadgeVariant
    }
}