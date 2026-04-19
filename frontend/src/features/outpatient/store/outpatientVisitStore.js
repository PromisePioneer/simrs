import {create} from "zustand";
import {toast} from "sonner";
import apiCall from "@/shared/services/apiCall.js";

const makeListState = (field, emptyItem) => ({
    [`add${field}`]: () =>
        (set) => set((state) => ({[field.toLowerCase()]: [...state[field.toLowerCase()], {...emptyItem}]})),
});

export const useOutpatientVisitStore = create((set, get) => ({
    isLoading: false,
    openDeleteModal: false,
    outpatientVisits: [],
    outpatientVisitValue: {},
    currentPage: 1,
    search: "",
    success: false,

    // Anamnesis dynamic lists
    allergies: [{name: ""}],
    medicalHistory: [{condition: ""}],
    familyMedicalHistory: [{condition: ""}],
    medicationHistory: [{medication: ""}],
    psychologyConditions: [{condition: ""}],

    setAllergies: (data) => set({allergies: data}),
    setMedicalHistory: (data) => set({medicalHistory: data}),
    setFamilyMedicalHistory: (data) => set({familyMedicalHistory: data}),
    setMedicationHistory: (data) => set({medicationHistory: data}),
    setPsychologyConditions: (data) => set({psychologyConditions: data}),

    setCurrentPage: (page) => set({currentPage: page}),
    setSearch: (search) => set({search}),

    // --- Allergies ---
    addAllergy: () => set((s) => ({allergies: [...s.allergies, {name: ""}]})),
    removeAllergy: (i) => set((s) => ({allergies: s.allergies.filter((_, idx) => idx !== i)})),
    updateAllergy: (i, value) =>
        set((s) => {
            const updated = [...s.allergies];
            updated[i] = {name: value};
            return {allergies: updated};
        }),
    resetAllergies: () => set({allergies: [{name: ""}]}),

    // --- Medical history ---
    addMedicalHistory: () => set((s) => ({medicalHistory: [...s.medicalHistory, {condition: ""}]})),
    removeMedicalHistory: (i) => set((s) => ({medicalHistory: s.medicalHistory.filter((_, idx) => idx !== i)})),
    updateMedicalHistory: (i, value) =>
        set((s) => {
            const updated = [...s.medicalHistory];
            updated[i] = {condition: value};
            return {medicalHistory: updated};
        }),

    // --- Family medical history ---
    addFamilyMedicalHistory: () =>
        set((s) => ({familyMedicalHistory: [...s.familyMedicalHistory, {condition: ""}]})),
    removeFamilyMedicalHistory: (i) =>
        set((s) => ({familyMedicalHistory: s.familyMedicalHistory.filter((_, idx) => idx !== i)})),
    updateFamilyMedicalHistory: (i, value) =>
        set((s) => {
            const updated = [...s.familyMedicalHistory];
            updated[i] = {condition: value};
            return {familyMedicalHistory: updated};
        }),

    // --- Medication history ---
    addMedicationHistory: () =>
        set((s) => ({medicationHistory: [...s.medicationHistory, {medication: ""}]})),
    removeMedicationHistory: (i) =>
        set((s) => ({medicationHistory: s.medicationHistory.filter((_, idx) => idx !== i)})),
    updateMedicationHistory: (i, value) =>
        set((s) => {
            const updated = [...s.medicationHistory];
            updated[i] = {medication: value};
            return {medicationHistory: updated};
        }),

    // --- Psychology conditions ---
    addPsychologyCondition: () =>
        set((s) => ({psychologyConditions: [...s.psychologyConditions, {condition: ""}]})),
    removePsychologyCondition: (i) =>
        set((s) => ({psychologyConditions: s.psychologyConditions.filter((_, idx) => idx !== i)})),
    updatePsychologyCondition: (i, value) =>
        set((s) => {
            const updated = [...s.psychologyConditions];
            updated[i] = {condition: value};
            return {psychologyConditions: updated};
        }),

    // --- API ---
    fetchOutPatientVisit: async ({perPage = null, status = null} = {}) => {
        try {
            set({isLoading: true, outpatientVisit: null});
            const {search, currentPage} = get();
            const params = {page: currentPage};
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            if (status) params.status = status;
            const response = await apiCall.get("/api/v1/outpatient-visits", {params});
            set({outpatientVisits: response.data, isLoading: false});
        } catch (e) {
            set({isLoading: false});
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
            const response = await apiCall.get(`/api/v1/outpatient-visits/${id}`);
            set({outpatientVisitValue: response.data});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    updateOutpatientVisit: async (id, data) => {
        try {
            await apiCall.put(`/api/v1/outpatient-visits/${id}`, data);
            toast.success("Berhasil mengubah kunjungan pasien.");
            return {success: true};
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    destroyOutPatientVisit: async (id) => {
        try {
            await apiCall.delete(`/api/v1/outpatient-visits/${id}`);
            toast.success("Kunjungan berhasil dihapus.");
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
}));