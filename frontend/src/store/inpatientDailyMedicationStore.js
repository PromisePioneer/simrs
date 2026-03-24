import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";

export const useInpatientDailyMedicationStore = create((set, get) => ({
    isLoading: false,
    medications: [],
    currentPage: 1,
    search: "",
    statusFilter: "",
    givenDateFilter: "",
    setCurrentPage: (page) => set({currentPage: page}),
    setSearch: (search) => set({search}),
    setStatusFilter: (status) => set({statusFilter: status}),
    setGivenDateFilter: (date) => set({givenDateFilter: date}),

    fetchMedications: async (admissionId, {perPage = 15} = {}) => {
        set({isLoading: true});
        try {
            const {search, currentPage, statusFilter, givenDateFilter} = get();
            const params = {page: currentPage, per_page: perPage};
            if (search?.trim()) params.search = search;
            if (statusFilter) params.status = statusFilter;
            if (givenDateFilter) params.given_date = givenDateFilter;

            const resp = await apiCall.get(
                `/api/v1/inpatient-admissions/${admissionId}/daily-medications`,
                {params}
            );
            set({medications: resp.data, isLoading: false});
        } catch (e) {
            set({isLoading: false});
            toast.error(e.response?.data?.message || "Gagal memuat data obat.");
        }
    },

    createMedication: async (admissionId, data) => {
        try {
            const resp = await apiCall.post(
                `/api/v1/inpatient-admissions/${admissionId}/daily-medications`,
                data
            );
            toast.success("Resep obat berhasil ditambahkan.");
            return {success: true, data: resp.data};
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal menambahkan resep.");
            return {success: false};
        }
    },

    updateMedication: async (admissionId, medicationId, data) => {
        try {
            const resp = await apiCall.put(
                `/api/v1/inpatient-admissions/${admissionId}/daily-medications/${medicationId}`,
                data
            );
            toast.success("Resep obat berhasil diperbarui.");
            return {success: true, data: resp.data};
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal memperbarui resep.");
            return {success: false};
        }
    },
    dispenseMedication: async (admissionId, medicationId) => {
        try {
            const resp = await apiCall.post(
                `/api/v1/inpatient-admissions/${admissionId}/daily-medications/${medicationId}/dispense`
            );
            toast.success("Obat berhasil diberikan.");
            return {success: true, data: resp.data};
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal melakukan dispensing.");
            return {success: false};
        }
    },

    cancelMedication: async (admissionId, medicationId) => {
        try {
            const resp = await apiCall.post(
                `/api/v1/inpatient-admissions/${admissionId}/daily-medications/${medicationId}/cancel`
            );
            toast.success("Resep obat berhasil dibatalkan.");
            return {success: true, data: resp.data};
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal membatalkan resep.");
            return {success: false};
        }
    },

    deleteMedication: async (admissionId, medicationId) => {
        try {
            await apiCall.delete(
                `/api/v1/inpatient-admissions/${admissionId}/daily-medications/${medicationId}`
            );
            toast.success("Resep obat berhasil dihapus.");
            return {success: true};
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal menghapus resep.");
            return {success: false};
        }
    },
}));