import { create } from "zustand";
import apiCall from "@/shared/services/apiCall.js";
import { toast } from "sonner";

export const useMedicineWarehouseStore = create((set, get) => ({
    isLoading: false,
    medicineWarehouses: [],
    search: "",
    currentPage: 1,
    medicineWarehouseValue: null,
    openDeleteModal: false,
    openModal: false,

    setOpenDeleteModal: async (id) => {
        if (id) await get().showMedicineWarehouse(id);
        set({ openDeleteModal: !get().openDeleteModal });
    },
    setOpenModal: async (id = null) => {
        if (id) await get().showMedicineWarehouse(id);
        set({ openModal: !get().openModal });
    },
    setCurrentPage: (page) => set({ currentPage: page }),
    setSearch: (search) => set({ search }),

    fetchMedicineWarehouses: async ({ perPage = null } = {}) => {
        try {
            set({ isLoading: true, medicineWarehouses: null });
            const { search, currentPage } = get();
            const params = { page: currentPage };
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get("/api/v1/pharmacy/medicine-warehouses", { params });
            set({ medicineWarehouses: response.data, isLoading: false });
        } catch (e) {
            set({ isLoading: false });
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    createMedicineWarehouse: async (data) => {
        try {
            const response = await apiCall.post("/api/v1/pharmacy/medicine-warehouses", data);
            toast.success("Berhasil menambahkan gudang obat baru.");
            return { success: true, data: response.data };
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
            return { success: false };
        }
    },

    showMedicineWarehouse: async (id) => {
        try {
            const response = await apiCall.get(`/api/v1/pharmacy/medicine-warehouses/${id}`);
            set({ medicineWarehouseValue: response.data });
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    updateMedicineWarehouse: async (id, data) => {
        try {
            await apiCall.put(`/api/v1/pharmacy/medicine-warehouses/${id}`, data);
            toast.success("Berhasil mengubah gudang obat.");
            return { success: true };
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
            return { success: false };
        }
    },

    deleteMedicineWarehouse: async (id) => {
        try {
            await apiCall.delete(`/api/v1/pharmacy/medicine-warehouses/${id}`);
            toast.success("Berhasil menghapus gudang obat.");
            set({ openDeleteModal: false });
            await get().fetchMedicineWarehouses({ perPage: 20 });
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
}));
