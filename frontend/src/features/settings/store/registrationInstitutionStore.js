import {create} from "zustand";
import apiCall from "@/shared/services/apiCall.js";
import {toast} from "sonner";

export const useRegistrationInstitutionStore = create((set, get) => ({
    isLoading: false,
    institutionData: [],
    strData: [],
    sipData: [],
    search: "",
    openModal: false,
    openDeleteModal: false,
    institutionValue: null,
    currentPage: 1,
    isDeleting: false,
    selectedIds: [],
    setSelectedIds: (ids) => set((state) => ({
        selectedIds: typeof ids === 'function' ? ids(state.selectedIds) : ids
    })),
    setIsDeleting: () => set({isDeleting: !get().isDeleting}),
    setSearch: (search) => set({search}),
    setCurrentPage: (page) => set({currentPage: page}),
    setOpenModal: (id) => {
        if (id) get().showInstitution(id);
        set({openModal: !get().openModal});
    },
    setOpenDeleteModal: async () => {
        set({openDeleteModal: !get().openDeleteModal});
    },
    fetchInstitutions: async ({perPage = null, type = null} = {}) => {
        set({isLoading: true});
        try {
            const {search, currentPage} = get();
            const params = {page: currentPage};
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            if (type) params.type = type;
            const response = await apiCall.get("/api/v1/registration-institutions", {params});
            set({institutionData: response.data, isLoading: false});
        } catch (e) {
            set({isLoading: false});
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    showInstitution: async (id) => {
        try {
            const response = await apiCall.get(`/api/v1/registration-institutions/${id}`);
            set({institutionValue: response.data});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    createInstitution: async (data) => {
        try {
            await apiCall.post("/api/v1/registration-institutions", data);
            toast.success("Institusi berhasil ditambahkan.");
            set({openModal: !get().openModal});
            await get().fetchInstitutions({perPage: 20});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
            throw e;
        }
    },

    updateInstitution: async (id, data) => {
        try {
            await apiCall.put(`/api/v1/registration-institutions/${id}`, data);
            toast.success("Institusi berhasil diperbarui.");
            set({openModal: !get().openModal});
            await get().fetchInstitutions({perPage: 20});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
            throw e;
        }
    },
    bulkDeleteInstitutions: async (ids) => {
        try {
            await apiCall.delete("api/v1/registration-institutions/bulk", {data: {ids}});
            set({selectedIds: []});
            await get().fetchInstitutions({perPage: 20});
            get().setOpenDeleteModal();
            toast.success("Berhasil menghapus Institusi" +
                ".");
        } catch (e) {
            toast.error(e.response?.data?.message || 'Operasi Gagal');
            throw e;
        }
    },
}));
