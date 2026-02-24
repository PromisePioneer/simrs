import {create} from "zustand";
import {toast} from "sonner";
import apiCall from "@/services/apiCall.js";

export const useOutpatientVisitStore = create((set, get) => ({
    isLoading: false,
    openDeleteModal: false,
    outpatientVisits: [],
    currentPage: 1,
    success: false,
    allergies: [{name: ""}],
    medicalHistory: [{condition: ""}],
    familyMedicalHistory: [{condition: ""}],
    medicationHistory: [{medication: ""}],
    psychologyConditions: [{condition: ""}],
    addMedicalHistory: () =>
        set((state) => ({
            medicalHistory: [...state.medicalHistory, {condition: ""}],
        })),

    removeMedicalHistory: (index) =>
        set((state) => ({
            medicalHistory: state.medicalHistory.filter((_, i) => i !== index),
        })),

    updateMedicalHistory: (index, value) =>
        set((state) => {
            const updated = [...state.medicalHistory];
            updated[index] = {condition: value};
            return {medicalHistory: updated};
        }),

    addFamilyMedicalHistory: () =>
        set((state) => ({
            familyMedicalHistory: [...state.familyMedicalHistory, {condition: ""}],
        })),

    removeFamilyMedicalHistory: (index) =>
        set((state) => ({
            familyMedicalHistory: state.familyMedicalHistory.filter((_, i) => i !== index),
        })),

    updateFamilyMedicalHistory: (index, value) =>
        set((state) => {
            const updated = [...state.familyMedicalHistory];
            updated[index] = {condition: value};
            return {familyMedicalHistory: updated};
        }),
    addMedicationHistory: () =>
        set((state) => ({
            medicationHistory: [...state.medicationHistory, {medication: ""}],
        })),

    removeMedicationHistory: (index) =>
        set((state) => ({
            medicationHistory: state.medicationHistory.filter((_, i) => i !== index),
        })),

    updateMedicationHistory: (index, value) =>
        set((state) => {
            const updated = [...state.medicationHistory];
            updated[index] = {medication: value};
            return {medicationHistory: updated};
        }),

    addPsychologyCondition: () =>
        set((state) => ({
            psychologyConditions: [...state.psychologyConditions, {condition: ""}],
        })),

    removePsychologyCondition: (index) =>
        set((state) => ({
            psychologyConditions: state.psychologyConditions.filter((_, i) => i !== index),
        })),

    updatePsychologyCondition: (index, value) =>
        set((state) => {
            const updated = [...state.psychologyConditions];
            updated[index] = {condition: value};
            return {psychologyConditions: updated};
        }),
    addAllergy: () =>
        set((state) => ({
            allergies: [...state.allergies, {name: ""}],
        })),
    removeAllergy: (index) =>
        set((state) => ({
            allergies: state.allergies.filter((_, i) => i !== index),
        })),
    updateAllergy: (index, value) =>
        set((state) => {
            const updated = [...state.allergies];
            updated[index] = {name: value};
            return {allergies: updated};
        }),

    resetAllergies: () =>
        set({allergies: [{name: ""}]}),
    fetchOutPatientVisit: async ({perPage = null, status = 'waiting'}) => {
        try {
            set({isLoading: true, outpatientVisit: null});
            const {search} = get();

            const params = {page: get().currentPage};
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get('/api/v1/outpatient-visits?status=waiting', {params});

            if (status === 'waiting') {
                set({outpatientVisits: response.data, isLoading: false});
            }
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    createOutpatientVisit: async (data) => {
        try {

            await apiCall.post("/api/v1/outpatient-visits", data);
            toast.success("Berhasil menambahkan kunjungan pasien baru.");
            return {success: true};
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");

        }
    },
    showOutPatientVisit: async (id) => {
        try {

        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");

        }
    },
    updateOutpatientVisit: async (id, data) => {
        try {

            await apiCall.post(`/api/v1/outpatient-visits/${id}`, data);
            toast.success("Berhasil menambahkan kunjungan pasien baru.");
            return {success: true};
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");

        }
    },
    destroyOutPatientVisit: async (id) => {
        try {

        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
}));