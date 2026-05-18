import {useRoomTypeStore} from "@features/facilities/index.js";
import {useForm} from "react-hook-form";
import {useEffect} from "react";
import {usePermission} from "@shared/hooks/index.js";
import {PERMISSIONS} from "@shared/constants/index.js";

export const useRoomType = () => {
    const store = useRoomTypeStore();


    const allIds = store.roomTypes?.data?.map((a) => a.id) ?? [];
    const allSelected = allIds.length > 0 && allIds.every((id) => store.selectedIds.includes(id));
    const {hasPermission} = usePermission();


    const {
        reset,
        register,
        handleSubmit,
        formState,
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {
            code: "",
            name: "",
            default_capacity: "",
            rate_per_night: "",
            description: "",
        },
    });

    useEffect(() => {
        store.fetchRoomTypes({perPage: 20});
    }, [store.fetchRoomTypes, store.search, store.currentPage]);

    // Populate form when editing
    useEffect(() => {
        if (store.roomTypeValue && !store.openDeleteModal) {
            reset({
                code: store.roomTypeValue.code || "",
                name: store.roomTypeValue.name || "",
                default_capacity: store.roomTypeValue.default_capacity || "",
                rate_per_night: store.roomTypeValue.rate_per_night || "",
                description: store.roomTypeValue.description || "",
            });
        } else if (!store.openDeleteModal) {
            reset({code: "", name: "", default_capacity: "", rate_per_night: "", description: ""});
        }
    }, [store.roomTypeValue, store.openDeleteModal, reset]);

    // Reset form when modal closes
    useEffect(() => {
        if (!store.openModal) {
            reset({code: "", name: "", default_capacity: "", rate_per_night: "", description: ""});
            if (store.setRoomTypeValue) store.setRoomTypeValue(null);
        }
    }, [store.openModal, store.setRoomTypeValue, reset]);

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            rate_per_night: parseInt(data.rate_per_night, 10) || 0,
            default_capacity: parseInt(data.default_capacity, 10) || 0,
        };
        if (store.roomTypeValue) {
            await store.updateRoomType(store.roomTypeValue.id, payload);
        } else {
            await store.createRoomType(payload);
        }
    };


    return {
        ...store,
        allSelected,
        register, handleSubmit, formState,
        safeSelectedIds: Array.isArray(store.selectedIds) ? store.selectedIds : [],
        canCreate: hasPermission(PERMISSIONS.ROOM_TYPE.CREATE),
        canEdit: hasPermission(PERMISSIONS.ROOM_TYPE.EDIT),
        canDelete: hasPermission(PERMISSIONS.ROOM_TYPE.DELETE),
        toggleAll: () => store.setSelectedIds(allSelected ? [] : allIds),
        toggleOne: (id) => store.setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        ),
        onSubmit
    }
}