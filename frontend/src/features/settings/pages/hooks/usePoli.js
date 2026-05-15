import {usePoliStore} from "@features/settings/index.js";
import {useForm} from "react-hook-form";
import {useEffect} from "react";
import {usePermission} from "@shared/hooks/index.js";
import {PERMISSIONS} from "@shared/constants/index.js";


export const usePoli = () => {
    const store = usePoliStore();

    const allIds = store.poliData?.data?.map((a) => a.id) ?? [];
    const allSelected = allIds.length > 0 && allIds.every((id) => store.selectedIds.includes(id));
    const {hasPermission} = usePermission();


    const {
        register,
        reset,
        handleSubmit,
        formState
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {
            name: "",
            consultation_fee: "",
            type: ""
        }
    });


    useEffect(() => {
        store.fetchPoli({perPage: 20});
    }, [store.fetchPoli, store.search, store.currentPage]);

    useEffect(() => {
        if (store.poliValue && !store.openDeleteModal) {
            reset({
                name: store.poliValue.name || "",
                consultation_fee: store.poliValue.consultation_fee || "",
            })
        } else {
            reset({name: "", consultation_fee: ""});
        }
    }, [store.poliValue, store.openDeleteModal]);

    useEffect(() => {
        if (!store.openModal) {
            reset({name: "", consultation_fee: ""});
            if (store.setPoliValue) store.setPoliValue(null);
        }
    }, [store.openModal, store.setPoliValue]);

    const onSubmit = async (data) => {
        if (store.poliValue) {
            await store.updatePoli(store.poliValue.id, data);
        } else {
            await store.createPoli(data);
        }
    };


    return {
        ...store,
        allSelected,
        register, handleSubmit, formState,
        safeSelectedIds: Array.isArray(store.selectedIds) ? store.selectedIds : [],
        canCreate: hasPermission(PERMISSIONS.POLI.CREATE),
        canEdit: hasPermission(PERMISSIONS.POLI.EDIT),
        canDelete: hasPermission(PERMISSIONS.POLI.DELETE),
        toggleAll: () => store.setSelectedIds(allSelected ? [] : allIds),
        toggleOne: (id) => store.setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        ),
        onSubmit
    }
}