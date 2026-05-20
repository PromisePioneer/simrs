import {useMedicineCategoriesStore} from "@features/medicine/index.js";
import {useForm} from "react-hook-form";
import {useEffect} from "react";
import {usePermission} from "@shared/hooks/index.js";
import {PERMISSIONS} from "@shared/constants/index.js";


export const useMedicineCategory = () => {
    const store = useMedicineCategoriesStore();

    const allIds = store.medicineCategories?.data?.map((a) => a.id) ?? [];
    const allSelected = allIds.length > 0 && allIds.every((id) => store.selectedIds.includes(id));
    const {hasPermission} = usePermission();


    const {
        register,
        handleSubmit,
        reset,
        formState,
        control
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {
            code: "",
            name: "",
            type: ""
        }
    });


    useEffect(() => {
        store.fetchMedicineCategories({perPage: 20});
    }, [store.fetchMedicineCategories, store.search, store.currentPage]);
    //
    useEffect(() => {
        if (store.medicineCategoryValue && !store.openDeleteModal) {
            reset({
                name: store.medicineCategoryValue.name || "",
                type: store.medicineCategoryValue.type || ""
            })
        } else {
            reset({name: "", type: ""});
        }
    }, [store.medicineCategoryValue, store.openDeleteModal]);

    useEffect(() => {
        if (!store.openModal) {
            reset({name: "", type: ""});
            if (store.setMedicineCategoryValue) store.setMedicineCategoryValue(null);
        }
    }, [store.openModal, store.setMedicineCategoryValue]);

    const onSubmit = async (data) => {
        if (store.medicineCategoryValue) {
            await store.updateMedicineCategory(store.medicineCategoryValue.id, data);
        } else {
            await store.createMedicineCategory(data);
        }
    };

    return {
        ...store,
        allSelected,
        register, handleSubmit, control, formState,
        safeSelectedIds: Array.isArray(store.selectedIds) ? store.selectedIds : [],
        canCreate: hasPermission(PERMISSIONS.MEDICINE_CATEGORY.CREATE),
        canEdit: hasPermission(PERMISSIONS.MEDICINE_CATEGORY.EDIT),
        canDelete: hasPermission(PERMISSIONS.MEDICINE_CATEGORY.DELETE),
        toggleAll: () => store.setSelectedIds(allSelected ? [] : allIds),
        toggleOne: (id) => store.setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        ),
        onSubmit
    }
}