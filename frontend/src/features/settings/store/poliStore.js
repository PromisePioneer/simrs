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
    isDeleting: false,
    selectedIds: [],
    setSelectedIds: (ids) => set((state) => ({
        selectedIds: typeof ids === 'function' ? ids(state.selectedIds) : ids
    })),
    setIsDeleting: () => set({isDeleting: !get().isDeleting}),
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

    fetchPoliOptions: async (search) => {
        const res = await apiCall.get("/api/v1/poli", {
            params: {search}
        });
        // Sesuaikan dengan struktur response API kamu
        const data = res.data?.data ?? res.data ?? [];
        return data.map(b => ({
            value: b.id,
            label: b.name,
        }));
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

    bulkDeletePoli: async (ids) => {
        try {
            await apiCall.delete("api/v1/poli/bulk", {data: {ids}});
            set({selectedIds: []});
            await get().fetchPoli({perPage: 20});
            get().setOpenDeleteModal();
            toast.success("Berhasil menghapus Poli.");
        } catch (e) {
            toast.error(e.response?.data?.message || 'Operasi Gagal');
            throw e;
        }
    },
}));
