import {usePaymentMethodStore} from "@features/settings/index.js";
import {useForm} from "react-hook-form";
import {useEffect} from "react";
import {PERMISSIONS} from "@shared/constants/index.js";
import {usePermission} from "@shared/hooks/index.js";


export const UsePaymentMethod = () => {
    const store = usePaymentMethodStore();
    const {hasPermission} = usePermission();
    const allIds = store.paymentMethods?.data?.map((a) => a.id) ?? [];
    const allSelected = allIds.length > 0 && allIds.every((id) => store.selectedIds.includes(id));

    const {
        register,
        control,
        reset,
        handleSubmit,
        formState
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {
            name: "",
            payment_method_type_id: ""
        }
    });


    // --- EFFECTS FOR PAYMENT METHOD ---
    useEffect(() => {
        store.fetchPaymentMethods({perPage: 20, search: store.search});
    }, [store.currentPage, store.search, store.fetchPaymentMethods]);

    useEffect(() => {
        if (store.paymentMethodValue && !store.openDeleteModal) {
            reset({
                name: store.paymentMethodValue.name || "",
                payment_method_type_id: store.paymentMethodValue.type?.id || store.paymentMethodValue.payment_method_type_id || ""
            })
        } else {
            reset({name: "", payment_method_type_id: ""});
        }
    }, [store.paymentMethodValue, store.openDeleteModal]);

    useEffect(() => {
        if (!store.openModal) {
            reset({name: "", payment_method_type_id: ""});
            if (store.setPaymentMethodValue) {
                store.setPaymentMethodValue(null);
            }
        }
    }, [store.openModal, store.setPaymentMethodValue]);


    const onSubmitPayment = async (data) => {
        if (store.paymentMethodValue) {
            await store.updatePaymentMethod(store.paymentMethodValue.id, data);
        } else {
            await store.createPaymentMethod(data);
        }
    };



    return {
        ...store,
        register, control, handleSubmit, formState,
        allSelected,
        safeSelectedIds: Array.isArray(store.selectedIds) ? store.selectedIds : [],
        canCreate: hasPermission(PERMISSIONS.PAYMENT_METHOD.CREATE),
        canEdit: hasPermission(PERMISSIONS.PAYMENT_METHOD.EDIT),
        canDelete: hasPermission(PERMISSIONS.PAYMENT_METHOD.DELETE),
        toggleAll: () => store.setSelectedIds(allSelected ? [] : allIds),
        toggleOne: (id) => store.setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        ),
        onSubmitPayment,
    }


}