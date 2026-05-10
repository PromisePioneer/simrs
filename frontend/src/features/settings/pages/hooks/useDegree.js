import {usePermission} from "@shared/hooks/index.js";
import {PERMISSIONS} from "@shared/constants/index.js";
import {useForm} from "react-hook-form";
import {useEffect} from "react";
import {useDegreeStore} from "@features/settings/index.js";

export function useDegree() {

    const store = useDegreeStore();

    const allIds = store.degrees?.data?.map((a) => a.id) ?? [];
    const allSelected = allIds.length > 0 && allIds.every((id) => store.selectedIds.includes(id));
    const {hasPermission} = usePermission();
    const {
        register,
        reset,
        control,
        handleSubmit,
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
        store.fetchDegrees({perPage: 20});
    }, [store.fetchDegrees, store.search, store.currentPage]);

    useEffect(() => {
        if (store.degreeValue && !store.openDeleteModal) {
            reset({
                name: store.degreeValue.name || "",
                type: store.degreeValue.type || ""
            })
        } else {
            reset({name: "", type: ""});
        }
    }, [store.degreeValue, store.openDeleteModal]);

    useEffect(() => {
        if (!store.openModal) {
            reset({name: "", type: ""});
            if (store.setDegreeValue) store.setDegreeValue(null);
        }
    }, [store.openModal, store.setDegreeValue]);

    const onSubmitDegree = async (data) => {
        if (store.degreeValue) {
            await store.updateDegree(store.degreeValue.id, data);
        } else {
            await store.createDegree(data);
        }
    };


    console.log('register type:', typeof register);
    console.log('store.register type:', typeof store.register);
    console.log('store keys:', Object.keys(store));


    return {
        ...store,
        allSelected,
        register, control, handleSubmit, formState,
        safeSelectedIds: Array.isArray(store.selectedIds) ? store.selectedIds : [],
        canCreate: hasPermission(PERMISSIONS.DEGREE.CREATE),
        canEdit: hasPermission(PERMISSIONS.DEGREE.EDIT),
        canDelete: hasPermission(PERMISSIONS.DEGREE.DELETE),
        toggleAll: () => store.setSelectedIds(allSelected ? [] : allIds),
        toggleOne: (id) => store.setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        ),
        onSubmitDegree,
    }
}