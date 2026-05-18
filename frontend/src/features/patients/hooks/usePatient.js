import {usePatientStore} from "@features/patients/index.js";
import {useEffect} from "react";
import {usePermission} from "@shared/hooks/index.js";
import {PERMISSIONS} from "@shared/constants/index.js";


export const usePatient = () => {
    const store = usePatientStore();


    const allIds = store.patients?.data?.map((a) => a.id) ?? [];
    const allSelected = allIds.length > 0 && allIds.every((id) => store.selectedIds.includes(id));
    const {hasPermission} = usePermission();


    useEffect(() => {
        store.fetchPatients({perPage: 20});
    }, [store.currentPage, store.search]);


    return {
        ...store,
        allSelected,
        safeSelectedIds: Array.isArray(store.selectedIds) ? store.selectedIds : [],
        canCreate: hasPermission(PERMISSIONS.PATIENT.CREATE),
        canEdit: hasPermission(PERMISSIONS.PATIENT.EDIT),
        canDelete: hasPermission(PERMISSIONS.PATIENT.DELETE),
        toggleAll: () => store.setSelectedIds(allSelected ? [] : allIds),
        toggleOne: (id) => store.setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        ),
    }
}