import {useMedicineStore} from "@features/medicine/index.js";
import {useEffect} from "react";
import {usePermission} from "@shared/hooks/index.js";
import {PERMISSIONS} from "@shared/constants/index.js";


export const useMedicineIndex = () => {
    const store = useMedicineStore();

    const allIds = store.medicines?.data?.map((a) => a.id) ?? [];
    const allSelected = allIds.length > 0 && allIds.every((id) => store.selectedIds.includes(id));
    const {hasPermission} = usePermission();

    useEffect(() => {
        store.fetchMedicines({perPage: 20});
    }, [store.currentPage, store.search]);


    return {
        ...store,
        allSelected,
        safeSelectedIds: Array.isArray(store.selectedIds) ? store.selectedIds : [],
        canCreate: hasPermission(PERMISSIONS.MEDICINE.CREATE),
        canEdit: hasPermission(PERMISSIONS.MEDICINE.EDIT),
        canDelete: hasPermission(PERMISSIONS.MEDICINE.DELETE),
        toggleAll: () => store.setSelectedIds(allSelected ? [] : allIds),
        toggleOne: (id) => store.setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        ),
    }
}