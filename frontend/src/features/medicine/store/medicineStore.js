import { create } from "zustand";
import apiCall from "@/shared/services/apiCall.js";
import { toast } from "sonner";

export const useMedicineStore = create((set, get) => ({
    isLoading: false,
    medicines: [],
    medicineValue: {},
    search: "",
    currentPage: 1,
    openDeleteModal: false,
    isDeleteLoading: false,
    success: false,
    readyStockMedicines: [],

    setOpenDeleteModal: async (id) => {
        if (id) await get().showMedicine(id);
        set({ openDeleteModal: !get().openDeleteModal });
    },
    setCurrentPage: (page) => set({ currentPage: page }),
    setSearch: (searchValue) => set({ search: searchValue }),

    fetchMedicines: async ({ perPage = null } = {}) => {
        try {
            set({ isLoading: true, medicines: null });
            const { search, currentPage } = get();
            const params = { page: currentPage };
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get("/api/v1/pharmacy/medicines", { params });
            set({ medicines: response.data, isLoading: false });
        } catch (e) {
            set({ isLoading: false });
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    fetchReadyStockMedicine: async () => {
        try {
            const response = await apiCall.get("/api/v1/pharmacy/medicines/ready-stocks");
            set({ readyStockMedicines: response.data });
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi gagal");
        }
    },

    createMedicine: async (data) => {
        try {
            const response = await apiCall.post("/api/v1/pharmacy/medicines", data);
            toast.success("Berhasil menambahkan obat baru.");
            return set({ success: true, data: response.data });
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    updateMedicine: async (data, id) => {
        try {
            const response = await apiCall.put(`/api/v1/pharmacy/medicines/${id}`, data);
            toast.success("Berhasil mengubah obat.");
            return { success: true, data: response.data };
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    showMedicine: async (id) => {
        try {
            const response = await apiCall.get(`/api/v1/pharmacy/medicines/${id}`);
            set({ medicineValue: response.data });
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    deleteMedicine: async (id) => {
        set({ isDeleteLoading: true });
        try {
            await apiCall.delete(`/api/v1/pharmacy/medicines/${id}`);
            toast.success("Berhasil menghapus obat.");
            set({ openDeleteModal: false, isDeleteLoading: false });
            await get().fetchMedicines({ perPage: 20 });
        } catch (e) {
            set({ isDeleteLoading: false });
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
}));
