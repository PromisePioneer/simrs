import {create} from "zustand";
import apiCall from "@/shared/services/apiCall.js";
import {toast} from "sonner";

export const useDegreeStore = create((set, get) => ({
    isLoading: false,
    degrees: [],
    degreeValue: null,
    error: null,
    currentPage: 1,
    search: "",
    openModal: false,
    openDeleteModal: false,
    degreeValueLoading: false,
    statusFilter: "",
    advancedStatusFilter: "",
    isDeleting: false,
    selectedIds: [],

    setSelectedIds: (ids) => set((state) => ({
        selectedIds: typeof ids === 'function' ? ids(state.selectedIds) : ids
    })),
    setIsDeleting: () => set({isDeleting: !get().isDeleting}),
    setSearch: (search) => set({search}),
    setCurrentPage: (page) => set({currentPage: page}),
    setOpenModal: (id) => {
        if (id) get().showDegree(id);
        set({openModal: !get().openModal});
    },
    setOpenDeleteModal: () => set({openDeleteModal: !get().openDeleteModal}),

    fetchDegrees: async ({perPage = null} = {}) => {
        set({isLoading: true, error: null});
        try {
            const {search, currentPage} = get();
            const params = {page: currentPage};
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get("/api/v1/degrees", {params});
            set({isLoading: false, degrees: response.data});
        } catch (e) {
            const msg = e.response?.data?.message || "Operasi Gagal";
            set({isLoading: false, error: msg});
            toast.error(msg);
        }
    },

    createDegree: async (data) => {
        try {
            await apiCall.post("/api/v1/degrees", data);
            toast.success("Berhasil menambahkan.");
            set({openModal: false, error: null});
            await get().fetchDegrees({perPage: 20});
        } catch (e) {
            const msg = e.response?.data?.message || "Operasi Gagal";
            set({error: msg});
            toast.error(msg);
        }
    },

    showDegree: async (id) => {
        set({degreeValueLoading: true, error: null});
        try {
            const response = await apiCall.get(`/api/v1/degrees/${id}`);
            set({degreeValue: response.data, degreeValueLoading: false});
        } catch (e) {
            const msg = e.response?.data?.message || "Operasi Gagal";
            set({degreeValueLoading: false, error: msg});
            toast.error(msg);
        }
    },

    updateDegree: async (id, data) => {
        try {
            await apiCall.put(`/api/v1/degrees/${id}`, data);
            toast.success("Berhasil menyimpan perubahan.");
            set({openModal: false, error: null});
            await get().fetchDegrees({perPage: 20});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    bulkDeleteDegrees: async (ids) => {
        try {
            await apiCall.delete("api/v1/degrees/bulk", {data: {ids}});
            set({selectedIds: []}); // ← tambah ini
            await get().fetchDegrees({perPage: 20}); // ← await dan konsisten perPage
            get().setOpenDeleteModal();
            toast.success("Berhasil menghapus gelar.");
        } catch (e) {
            toast.error(e.response?.data?.message || 'Operasi Gagal');
            throw e;
        }
    },
}));
