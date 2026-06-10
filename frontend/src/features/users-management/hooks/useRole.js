import {useEffect, useMemo} from "react";
import {useRoleStore} from "@features/users-management/index.js";
import {useForm} from "react-hook-form";
import {PERMISSIONS} from "@shared/constants/index.js";
import {usePermission} from "@shared/hooks/index.js";


export const useRole = () => {
    const store = useRoleStore();


    const allIds = (store.roleData?.data ?? [])
        .filter(r => r.tenant_id !== null)
        .map(r => r.uuid);

    const allSelected = allIds.length > 0 && allIds.every((id) => store.selectedIds.includes(id));
    const {hasPermission} = usePermission();

    const {
        register,
        handleSubmit,
        reset,
        formState
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {
            name: ""
        }
    });


    useEffect(() => {
        if (store.roleValue) {
            reset({
                name: store.roleValue.name || ""
            });
        } else {
            reset({
                name: ""
            });
        }
    }, [store.roleValue, reset]);

    useEffect(() => {
        store.fetchRoles({perPage: 20});
        store.fetchPermissions();
    }, [store.currentPage, store.search, store.fetchRoles, store.fetchPermissions]);

    const filteredPermissions = useMemo(() => {
        if (!store.permissionsData) return [];
        return store.permissionsData.data.filter(permission =>
            permission.name.toLowerCase().includes(store.permissionSearch.toLowerCase())
        );
    }, [store.permissionsData, store.permissionSearch]);

    const onSubmit = async (data) => {
        if (!store.roleValue) {
            await store.createRole(data);
        } else {
            await store.updateRole(data);
        }
    };


    return {
        ...store,
        allSelected,
        register, handleSubmit, formState,
        safeSelectedIds: Array.isArray(store.selectedIds) ? store.selectedIds : [],
        canCreate: hasPermission(PERMISSIONS.ROLE.CREATE),
        canEdit: hasPermission(PERMISSIONS.ROLE.EDIT),
        canDelete: hasPermission(PERMISSIONS.ROLE.DELETE),
        toggleAll: (selectableIds) => {
            if (selectableIds) {
                const allAlreadySelected = selectableIds.every(id => store.selectedIds.includes(id));
                store.setSelectedIds(allAlreadySelected ? [] : selectableIds);
            } else {
                store.setSelectedIds(allSelected ? [] : allIds);
            }
        },
        toggleOne: (id) => store.setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        ),
        onSubmit,
        filteredPermissions,
    }
}