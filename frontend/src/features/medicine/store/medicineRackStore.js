import { create } from "zustand";
import apiCall from "@/shared/services/apiCall.js";
import { toast } from "sonner";

export const useMedicineRackStore = create((set, get) => ({
    isLoading: false,
    medicineRacks: null,
    unassignedRacks: null,
    racksByMedicineWarehouse: [],
    search: "",
    currentPage: 1,
    openModal: false,
    openDeleteModal: false,

    setOpenModal: (open) => set({ openModal: open }),
    setOpenDeleteModal: (open) => set({ openDeleteModal: open }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setSearch: (search) => set({ search }),

    fetchMedicineRacks: async ({ perPage = null } = {}) => {
        try {
            set({ isLoading: true, medicineRacks: null });
            const { search, currentPage } = get();
            const params = { page: currentPage };
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get("/api/v1/pharmacy/medicine-racks", { params });
            set({ medicineRacks: response.data, isLoading: false });
        } catch (e) {
            set({ isLoading: false });
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    fetchUnassignedRacks: async ({ perPage = null } = {}) => {
        try {
            set({ isLoading: true, unassignedRacks: null });
            const { search, currentPage } = get();
            const params = { page: currentPage };
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get("/api/v1/pharmacy/medicine-racks/unassigned-racks", { params });
            set({ unassignedRacks: response.data, isLoading: false });
        } catch (e) {
            set({ isLoading: false });
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    fetchByMedicineWarehouse: async (warehouseId) => {
        try {
            set({ isLoading: true, racksByMedicineWarehouse: null });
            const response = await apiCall.get(
                `/api/v1/pharmacy/medicine-racks/racks-by-warehouses/${warehouseId}`
            );
            set({ racksByMedicineWarehouse: response.data, isLoading: false });
        } catch (e) {
            set({ isLoading: false });
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    createMedicineRack: async (data) => {
        try {
            const response = await apiCall.post("/api/v1/pharmacy/medicine-racks", data);
            toast.success("Rak berhasil ditambahkan.");
            return response.data;
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal menambahkan rak");
            throw e;
        }
    },

    updateMedicineRack: async (id, data) => {
        try {
            const response = await apiCall.put(`/api/v1/pharmacy/medicine-racks/${id}`, data);
            toast.success("Rak berhasil diperbarui.");
            return response.data;
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal memperbarui rak");
            throw e;
        }
    },

    deleteMedicineRack: async (id) => {
        try {
            await apiCall.delete(`/api/v1/pharmacy/medicine-racks/${id}`);
            toast.success("Rak berhasil dihapus.");
            await get().fetchMedicineRacks();
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal menghapus rak");
            throw e;
        }
    },
}));
