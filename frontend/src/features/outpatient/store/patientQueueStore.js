import { create } from "zustand";
import { toast } from "sonner";
import apiCall from "@/shared/services/apiCall.js";

export const usePatientQueueStore = create((set, get) => ({
    isLoading: false,
    queues: [],
    queueValue: null,
    currentPage: 1,
    search: "",

    setSearch: (search) => set({ search }),
    setCurrentPage: (page) => set({ currentPage: page }),

    fetchQueues: async ({ perPage = null } = {}) => {
        set({ isLoading: true });
        try {
            const { search, currentPage } = get();
            const params = { page: currentPage };
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get("/api/v1/queues", { params });
            set({ queues: response.data, isLoading: false });
        } catch (e) {
            set({ isLoading: false });
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    updateQueueStatus: async (id, status) => {
        try {
            await apiCall.patch(`/api/v1/queues/${id}`, { status });
            toast.success("Status antrian diperbarui.");
            await get().fetchQueues({ perPage: 20 });
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
}));
