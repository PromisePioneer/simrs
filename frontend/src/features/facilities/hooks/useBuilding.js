import {useBuildingStore} from "@features/facilities/index.js";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {usePermission} from "@shared/hooks/index.js";
import {PERMISSIONS} from "@shared/constants/index.js";


export const useBuilding = () => {
    const store = useBuildingStore();
    const allIds = store.buildings?.data?.map((a) => a.id) ?? [];
    const allSelected = allIds.length > 0 && allIds.every((id) => store.selectedIds.includes(id));
    const {hasPermission} = usePermission();
    const [expandedRows, setExpandedRows] = useState(new Set());

    const toggleExpand = (id) => {
        setExpandedRows(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const {
        register,
        handleSubmit,
        reset,
        formState
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {name: "", description: ""},
    });

    useEffect(() => {
        store.fetchBuildings({perPage: 20});
    }, [store.fetchBuildings, store.search, store.currentPage]);

    useEffect(() => {
        if (store.buildingValue && !store.openDeleteModal) {
            reset({name: store.buildingValue.name || "", description: store.buildingValue.description || ""});
        } else {
            reset({name: "", description: ""});
        }
    }, [store.buildingValue, store.openDeleteModal]);

    useEffect(() => {
        if (!store.openModal) {
            reset({name: "", description: ""});
            if (store.setBuildingValue) store.setBuildingValue(null);
        }
    }, [store.openModal, store.setBuildingValue]);

    const onSubmit = async (data) => {
        if (store.buildingValue) await store.updateBuilding(store.buildingValue.id, data);
        else await store.createBuilding(data);
    };


    return {
        ...store,
        allSelected,
        register, handleSubmit, formState,
        safeSelectedIds: Array.isArray(store.selectedIds) ? store.selectedIds : [],
        canCreate: hasPermission(PERMISSIONS.BUILDING.CREATE),
        canEdit: hasPermission(PERMISSIONS.BUILDING.EDIT),
        canDelete: hasPermission(PERMISSIONS.BUILDING.DELETE),
        toggleAll: () => store.setSelectedIds(allSelected ? [] : allIds),
        toggleOne: (id) => store.setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        ),
        onSubmit,
        expandedRows,
        setExpandedRows,
        toggleExpand
    }
}