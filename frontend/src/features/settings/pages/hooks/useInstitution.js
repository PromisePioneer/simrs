import {useRegistrationInstitutionStore} from "@features/settings/index.js";
import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {PERMISSIONS} from "@shared/constants/index.js";
import {usePermission} from "@shared/hooks/index.js";

export const useInstitution = () => {
    const store = useRegistrationInstitutionStore();

    const allIds = store.institutionData?.data?.map((a) => a.id) ?? [];
    const allSelected = allIds.length > 0 && allIds.every((id) => store.selectedIds.includes(id));
    const {hasPermission} = usePermission();

    useEffect(() => {
        store.fetchInstitutions({perPage: 20})
    }, [store.currentPage, store.search]);


    // form
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {
            name: "",
            type: ""
        }
    });

    useEffect(() => {
        if (store.institutionValue && !store.openDeleteModal) {
            reset({
                name: store.institutionValue.name || "",
                type: store.institutionValue.type || ""
            })
        } else {
            reset({
                name: "",
                type: ""
            });
        }
    }, [store.institutionValue, reset, store.openDeleteModal])


    useEffect(() => {
        if (!store.openModal) {
            reset({
                name: "",
                type: ""
            });
            if (store.setInstitutionValue) {
                store.setInstitutionValue(null);
            }
        }
    }, [store.openModal, reset]);

    const onSubmit = async (data) => {
        if (store.institutionValue) {
            await store.updateInstitution(store.institutionValue.id, data);
        } else {
            await store.createInstitution(data);
        }
    }


    return {
        ...store,
        allSelected,
        register, control, handleSubmit, formState,
        safeSelectedIds: Array.isArray(store.selectedIds) ? store.selectedIds : [],
        canCreate: hasPermission(PERMISSIONS.INSTITUTION.CREATE),
        canEdit: hasPermission(PERMISSIONS.INSTITUTION.EDIT),
        canDelete: hasPermission(PERMISSIONS.INSTITUTION.DELETE),
        toggleAll: () => store.setSelectedIds(allSelected ? [] : allIds),
        toggleOne: (id) => store.setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        ),
        onSubmit,
    }
}