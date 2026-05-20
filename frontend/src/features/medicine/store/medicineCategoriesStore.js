import {create} from "zustand";
import apiCall from "@/shared/services/apiCall.js";
import {toast} from "sonner";

export const useMedicineCategoriesStore = create((set, get) => ({
    medicineCategories: [],
    medicineCategoryValue: null,
    search: "",
    currentPage: 1,
    openDeleteModal: false,
    openModal: false,
    isDeleting: false,
    selectedIds: [],
    setSelectedIds: (ids) => set((state) => ({
        selectedIds: typeof ids === 'function' ? ids(state.selectedIds) : ids
    })),
    setIsDeleting: () => set({isDeleting: !get().isDeleting}),
    setOpenModal: async (id = null) => {
        if (id) await get().showMedicineCategory(id);
        set({openModal: !get().openModal});
    },
    setOpenDeleteModal: async (id) => {
        if (id) await get().showMedicineCategory(id);
        set({openDeleteModal: !get().openDeleteModal});
    },
    setSearch: (search) => set({search}),
    setCurrentPage: (page) => set({currentPage: page}),

    fetchMedicineCategories: async ({perPage = null} = {}) => {
        try {
            const {search, currentPage} = get();
            const params = {page: currentPage};
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get("/api/v1/pharmacy/medicine-categories", {params});
            set({medicineCategories: response.data});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    createMedicineCategory: async (data) => {
        try {
            await apiCall.post("/api/v1/pharmacy/medicine-categories", data);
            toast.success("Berhasil menambahkan kategori obat baru.");
            set({openModal: false});
            await get().fetchMedicineCategories({perPage: 20});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
            throw e;
        }
    },

    updateMedicineCategory: async (id, data) => {
        try {
            await apiCall.put(`/api/v1/pharmacy/medicine-categories/${id}`, data);
            toast.success("Berhasil mengubah kategori obat.");
            set({openModal: false});
            await get().fetchMedicineCategories({perPage: 20});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    showMedicineCategory: async (id) => {
        try {
            const response = await apiCall.get(`/api/v1/pharmacy/medicine-categories/${id}`);
            set({medicineCategoryValue: response.data});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    bulkDeleteMedicineCategory: async (ids) => {
        try {
            await apiCall.delete("api/v1/pharmacy/medicine-categories/bulk", {data: {ids}});
            set({selectedIds: []});
            await get().fetchMedicineCategories({perPage: 20});
            get().setOpenDeleteModal();
            toast.success("Berhasil menghapus Kategori.");
        } catch (e) {
            toast.error(e.response?.data?.message || 'Operasi Gagal');
            throw e;
        }
    },
}));
