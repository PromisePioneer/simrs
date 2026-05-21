import {create} from "zustand";
import apiCall from "@/shared/services/apiCall.js";
import {toast} from "sonner";

export const useMedicineBatchesStore = create((set, get) => ({
    isLoading: false,
    error: null,
    medicineBatches: null,
    medicineBatchValue: {},
    medicineId: null,
    perPage: 20,
    currentPage: 1,
    search: "",
    openModal: false,
    openDeleteModal: false,
    isDeleting: false,
    selectedIds: [],
    setSelectedIds: (ids) => set((state) => ({
        selectedIds: typeof ids === 'function' ? ids(state.selectedIds) : ids
    })),
    setIsDeleting: () => set({isDeleting: !get().isDeleting}),

    setCurrentPage: (page) => set({currentPage: page}),
    setSearch: (search) => set({search}),

    setOpenModal: async (id = null) => {
        if (id) {
            await get().showMedicineBatch(id);
        } else {
            set({medicineBatchValue: null});
        }
        set({openModal: !get().openModal});
    },

    setOpenDeleteModal: async (id) => {
        set({openDeleteModal: !get().openDeleteModal});
        if (id) {
            await get().showMedicineBatch(id);
        }
        set({medicineBatchValue: null});
    },

    fetchMedicineBatches: async ({perPage = null, medicineId} = {}) => {
        try {
            set({isLoading: true, medicineBatches: [], medicineId: medicineId || get().medicineId});
            const {search, currentPage} = get();
            const params = {page: currentPage};
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get(
                `/api/v1/pharmacy/medicine-batches/medicine/${medicineId || get().medicineId}`,
                {params}
            );
            set({medicineBatches: response.data, isLoading: false});
        } catch (e) {
            const msg = e.response?.data?.message || "Operasi Gagal";
            set({isLoading: false, error: msg});
            toast.error(msg);
        }
    },

    showMedicineBatch: async (id) => {
        try {
            const response = await apiCall.get(`/api/v1/pharmacy/medicine-batches/${id}`);
            set({medicineBatchValue: response.data});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    createMedicineBatch: async (data) => {
        try {
            await apiCall.post("/api/v1/pharmacy/medicine-batches", data);
            toast.success("Berhasil menambahkan batch baru.");
            set({openModal: false});
            await get().fetchMedicineBatches({perPage: get().perPage, medicineId: get().medicineId});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    updateMedicineBatch: async (id, data) => {
        try {
            await apiCall.put(`/api/v1/pharmacy/medicine-batches/${id}`, data);
            toast.success("Berhasil memperbarui batch.");
            set({openModal: false});
            await get().fetchMedicineBatches({perPage: get().perPage, medicineId: get().medicineId});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    bulkDeleteMedicineBatch: async (ids) => {
        try {
            await apiCall.delete("api/v1/pharmacy/medicine-batches/bulk", {data: {ids}});
            set({selectedIds: []});
            await get().fetchMedicineBatches({perPage: 20});
            get().setOpenDeleteModal();
            toast.success("Berhasil menghapus Batch.");
        } catch (e) {
            toast.error(e.response?.data?.message || 'Operasi Gagal');
            throw e;
        }
    },
}));
