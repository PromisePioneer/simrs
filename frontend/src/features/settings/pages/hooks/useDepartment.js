import {useDepartmentStore} from "@features/settings/index.js";
import {useForm} from "react-hook-form";
import {useEffect} from "react";
import {PERMISSIONS} from "@shared/constants/index.js";
import {usePermission} from "@shared/hooks/index.js";


export const useDepartment = () => {
    const store = useDepartmentStore();

    const allIds = store.departments?.data?.map((a) => a.id) ?? [];
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
            name: "",
            description: ""
        }
    });


    useEffect(() => {
        store.fetchDepartments({perPage: 20});
    }, [store.fetchDepartments, store.search, store.currentPage]);

    useEffect(() => {
        if (store.departmentValue && !store.openDeleteModal) {
            reset({
                name: store.departmentValue.name || "",
                description: store.departmentValue.description || ""
            })
        } else {
            reset({name: "", description: ""});
        }
    }, [store.departmentValue, store.openDeleteModal]);

    useEffect(() => {
        if (!store.openModal) {
            reset({name: "", description: ""});
            if (store.setDepartmentValue) store.setDepartmentValue(null);
        }
    }, [store.openModal, store.setDepartmentValue]);

    const onSubmit = async (data) => {
        if (store.departmentValue) {
            await store.updateDepartment(store.departmentValue.id, data);
        } else {
            await store.createDepartment(data);
        }
    };


    return {
        ...store,
        allSelected,
        register, handleSubmit, formState,
        safeSelectedIds: Array.isArray(store.selectedIds) ? store.selectedIds : [],
        canCreate: hasPermission(PERMISSIONS.DEPARTMENT.CREATE),
        canEdit: hasPermission(PERMISSIONS.DEPARTMENT.EDIT),
        canDelete: hasPermission(PERMISSIONS.DEPARTMENT.DELETE),
        toggleAll: () => store.setSelectedIds(allSelected ? [] : allIds),
        toggleOne: (id) => store.setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        ),
        onSubmit
    }
}