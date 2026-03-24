import { create } from "zustand";
import apiCall from "@/shared/services/apiCall.js";
import { toast } from "sonner";

export const useStockMovementStore = create((set, get) => ({
    isLoading: false,
    medicineMovementStocks: [],
    currentPage: 1,
    perPage: 20,
    search: "",

    setSearch: (search) => set({ search }),
    setCurrentPage: (page) => set({ currentPage: page }),

    fetchMedicineMovementStock: async ({ perPage = null } = {}) => {
        set({ isLoading: true });
        try {
            const { search, currentPage } = get();
            const params = { page: currentPage };
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get("/api/v1/pharmacy/stocks/movements", { params });
            set({ isLoading: false, medicineMovementStocks: response.data });
        } catch (e) {
            set({ isLoading: false });
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
}));
