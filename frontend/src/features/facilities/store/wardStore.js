import { create } from "zustand";
import apiCall from "@/shared/services/apiCall.js";
import { toast } from "sonner";

export const useWardStore = create((set, get) => ({
    isLoading: false,
    currentPage: 1,
    search: "",
    wards: [],
    openModal: false,
    openDeleteModal: false,
    openRestoreModal: false,
    wardValue: {},

    setCurrentPage: (page) => set({ currentPage: page }),
    setSearch: (search) => set({ search }),

    setOpenModal: async (id = null) => {
        if (id) await get().showWard(id);
        set({ openModal: !get().openModal });
    },
    setOpenDeleteModal: async (id = null) => {
        if (id) await get().showWard(id);
        set({ openDeleteModal: !get().openDeleteModal });
    },
    setOpenRestoreModal: () => set({ openRestoreModal: !get().openRestoreModal }),

    fetchWards: async ({ perPage = null } = {}) => {
        try {
            set({ isLoading: true });
            const { search, currentPage } = get();
            const params = { page: currentPage };
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get("/api/v1/facilities/wards", { params });
            set({ wards: response.data, isLoading: false });
        } catch (e) {
            set({ isLoading: false });
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    createWard: async (data) => {
        try {
            await apiCall.post("/api/v1/facilities/wards", data);
            toast.success("Data berhasil disimpan.");
            set({ openModal: false });
            await get().fetchWards({ perPage: 20 });
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    showWard: async (id) => {
        try {
            const response = await apiCall.get(`/api/v1/facilities/wards/${id}`);
            set({ wardValue: response.data });
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    updateWard: async (id, data) => {
        try {
            await apiCall.put(`/api/v1/facilities/wards/${id}`, data);
            toast.success("Data berhasil diperbarui.");
            set({ openModal: false });
            await get().fetchWards({ perPage: 20 });
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    deleteWard: async (id) => {
        try {
            await apiCall.delete(`/api/v1/facilities/wards/${id}`);
            toast.success("Data berhasil dihapus.");
            set({ openDeleteModal: false });
            await get().fetchWards({ perPage: 20 });
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
}));
