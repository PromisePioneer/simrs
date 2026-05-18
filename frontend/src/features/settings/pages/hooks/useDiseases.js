import {DISEASE_DEFAULT_VALUES} from "@features/settings/pages/constants/index.js";
import {useDiseaseStore} from "@features/settings/store/diseaseStore.js";
import {useForm} from "react-hook-form";
import {useEffect} from "react";
import {PERMISSIONS} from "@shared/constants/index.js";
import {usePermission} from "@shared/hooks/index.js";


export const useDiseases = () => {
    const store = useDiseaseStore();


    const allIds = store.diseases?.data?.map((a) => a.id) ?? [];
    const allSelected = allIds.length > 0 && allIds.every((id) => store.selectedIds.includes(id));
    const {hasPermission} = usePermission();

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: DISEASE_DEFAULT_VALUES
    });


    useEffect(() => {
        store.fetchDiseases({perPage: 20});
    }, [store.fetchDiseases, store.search, store.currentPage]);

    useEffect(() => {
        if (store.diseaseValue && !store.openDeleteModal) {
            reset({
                code: store.diseaseValue.code || "",
                name: store.diseaseValue.name || "",
                symptoms: store.diseaseValue.symptoms || "",
                description: store.diseaseValue.description || "",
                status: store.diseaseValue.status || "not_contagious",
                valid_code: store.diseaseValue.valid_code || "1",
                accpdx: store.diseaseValue.accpdx || "Y",
                asterisk: store.diseaseValue.asterisk || "0",
                im: store.diseaseValue.im || "0",
            });
        } else {
            reset(DISEASE_DEFAULT_VALUES);
        }
    }, [store.diseaseValue, store.openDeleteModal]);

    useEffect(() => {
        if (!store.openModal) {
            reset(DISEASE_DEFAULT_VALUES);
            if (store.setDiseaseValue) store.setDiseaseValue(null);
        }
    }, [store.openModal, store.setDiseaseValue]);

    const onSubmit = async (data) => {
        if (store.diseaseValue) {
            await store.updateDisease(store.diseaseValue.id, data);
        } else {
            await store.createDisease(data);
        }
    };


    return {
        ...store,
        allSelected,
        register, handleSubmit, control, formState,
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