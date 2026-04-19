import { create } from "zustand";
import apiCall from "@/shared/services/apiCall.js";
import { toast } from "sonner";

export const usePrescriptionStore = create((set, get) => ({
    isLoading: false,
    prescriptions: [],
    error: null,
    currentPage: 1,
    search: "",

    setSearch: (search) => set({ search }),
    setCurrentPage: (page) => set({ currentPage: page }),

    fetchPrescriptions: async ({ perPage = null } = {}) => {
        set({ isLoading: true, error: null });
        try {
            const { search, currentPage } = get();
            const params = { page: currentPage };
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get("/api/v1/prescriptions", { params });
            set({ isLoading: false, prescriptions: response.data });
        } catch (e) {
            set({ isLoading: false });
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    updatePrescriptionStatus: async (id, status) => {
        try {
            await apiCall.post(`/api/v1/prescriptions/medication-dispensing/${id}`, { status });
            toast.success("Berhasil!");
            await get().fetchPrescriptions({ perPage: 20 });
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
}));
