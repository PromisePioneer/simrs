import {create} from "zustand";
import apiCall from "@/shared/services/apiCall.js";
import {toast} from "sonner";

export const usePoliStore = create((set, get) => ({
    isLoading: false,
    poliData: [],
    poliValue: null,
    currentPage: 1,
    search: "",
    openModal: false,
    openDeleteModal: false,
    deleteLoading: false,

    setSearch: (search) => set({search}),
    setCurrentPage: (page) => set({currentPage: page}),

    setOpenModal: async (id = null) => {
        if (id) await get().showPoli(id);
        set({openModal: !get().openModal});
    },
    setOpenDeleteModal: async (id = null) => {
        if (id) await get().showPoli(id);
        set({openDeleteModal: !get().openDeleteModal});
    },

    fetchPoli: async ({perPage = null} = {}) => {
        try {
            const {search, currentPage} = get();
            const params = {page: currentPage};
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get("/api/v1/poli", {params});
            set({poliData: response.data});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    showPoli: async (id) => {
        try {
            const response = await apiCall.get(`/api/v1/poli/${id}`);
            set({poliValue: response.data});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    createPoli: async (data) => {
        try {
            await apiCall.post("/api/v1/poli", data);
            toast.success("Poli berhasil ditambahkan.");
            set({openModal: false});
            await get().fetchPoli({perPage: 20});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    updatePoli: async (id, data) => {
        try {
            await apiCall.put(`/api/v1/poli/${id}`, data);
            toast.success("Poli berhasil diperbarui.");
            set({openModal: false});
            await get().fetchPoli({perPage: 20});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    deletePoli: async (id) => {
        set({deleteLoading: true});
        try {
            await apiCall.delete(`/api/v1/poli/${id}`);
            toast.success("Poli berhasil dihapus.");
            set({openDeleteModal: false, deleteLoading: false});
            await get().fetchPoli({perPage: 20});
        } catch (e) {
            set({deleteLoading: false});
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
}));
