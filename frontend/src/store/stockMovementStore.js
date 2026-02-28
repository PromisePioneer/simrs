import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";


export const useStockMovementStore = create((set, get) => ({
    isLoading: false,
    medicineMovementStocks: [],
    currentPage: 1,
    search: "",
    setSearch: (search) => {
        set({search: search});
    },
    setCurrentPage: (perPage) => {
        set({perPage: perPage});
    },
    fetchMedicineMovementStock: async ({perPage = null} = {}) => {
        set({isLoading: true, error: null});
        try {
            const {search} = get();

            const params = {
                page: get().currentPage,
            };
            if (perPage) {
                params.per_page = perPage;
            }

            if (search && search.trim() !== "") {
                params.search = search;
            }
            const response = await apiCall.get('/api/v1/pharmacy/stocks/movements', {params});

            set({
                isLoading: false,
                degrees: response.data
            })
        } catch (e) {
            set({
                isLoading: false,
            });
            toast.error(e.data.message || "Operasi Gagal");
        }
    },
}));