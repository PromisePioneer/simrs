import { create } from "zustand";
import apiCall from "@/services/apiCall.js";
import { toast } from "sonner";

export const useInpatientDailyCareStore = create((set, get) => ({
    isLoading: false,
    dailyCares: [],
    currentPage: 1,
    search: "",

    setCurrentPage: (page) => set({ currentPage: page }),
    setSearch: (search) => set({ search }),

    fetchDailyCares: async (admissionId, { perPage = 10 } = {}) => {
        set({ isLoading: true });
        try {
            const { search, currentPage } = get();
            const params = { page: currentPage, per_page: perPage };
            if (search?.trim()) params.search = search;

            const resp = await apiCall.get(
                `/api/v1/inpatient-admissions/${admissionId}/daily-cares`,
                { params }
            );
            set({ dailyCares: resp.data, isLoading: false });
        } catch (e) {
            set({ isLoading: false });
            toast.error(e.response?.data?.message || "Gagal memuat catatan perawatan.");
        }
    },

    createDailyCare: async (admissionId, data) => {
        try {
            const resp = await apiCall.post(
                `/api/v1/inpatient-admissions/${admissionId}/daily-cares`,
                data
            );
            toast.success("Catatan perawatan berhasil ditambahkan.");
            return { success: true, data: resp.data };
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal menambahkan catatan.");
            return { success: false };
        }
    },

    updateDailyCare: async (admissionId, dailyCareId, data) => {
        try {
            const resp = await apiCall.put(
                `/api/v1/inpatient-admissions/${admissionId}/daily-cares/${dailyCareId}`,
                data
            );
            toast.success("Catatan perawatan berhasil diperbarui.");
            return { success: true, data: resp.data };
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal memperbarui catatan.");
            return { success: false };
        }
    },

    deleteDailyCare: async (admissionId, dailyCareId) => {
        try {
            await apiCall.delete(
                `/api/v1/inpatient-admissions/${admissionId}/daily-cares/${dailyCareId}`
            );
            toast.success("Catatan perawatan berhasil dihapus.");
            return { success: true };
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal menghapus catatan.");
            return { success: false };
        }
    },
}));