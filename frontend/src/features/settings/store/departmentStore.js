import {create} from "zustand";
import apiCall from "@shared/services/apiCall.js";
import {toast} from "sonner";

export const useDepartmentStore = create((set, get) => ({
    isLoading: false,
    currentPage: 1,
    search: "",
    departments: [],
    openModal: false,
    openDeleteModal: false,
    openRestoreModal: false,
    departmentValue: {},
    isDeleting: false,
    selectedIds: [],
    setSelectedIds: (ids) => set((state) => ({
        selectedIds: typeof ids === 'function' ? ids(state.selectedIds) : ids
    })),
    setIsDeleting: () => set({isDeleting: !get().isDeleting}),
    setCurrentPage: (currentPage) => {
        set({currentPage: currentPage});
    },
    setSearch: (search) => {
        set({search: search});
    },
    setOpenModal: async (id = null) => {
        if (id) {
            await get().showDepartment(id);
        }
        set({openModal: !get().openModal});
    },
    setOpenDeleteModal: async (id = null) => {
        if (id) {
            await get().showDepartment(id);
        }
        set({openDeleteModal: !get().openDeleteModal});
    },
    setOpenRestoreModal: () => {
        set({openRestoreModal: !get().openRestoreModal});
    },
    fetchDepartments: async ({perPage = null}) => {
        try {
            set({isLoading: true});
            const {search, currentPage} = get();
            const params = {page: currentPage};

            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;

            const response = await apiCall.get(`/api/v1/departments`, {params});
            set({departments: response.data, isLoading: false});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    fetchDepartmentOptions: async (search) => {
        const res = await apiCall.get("/api/v1/departments", {
            params: {search}
        });
        // Sesuaikan dengan struktur response API kamu
        const data = res.data?.data ?? res.data ?? [];
        return data.map(b => ({
            value: b.id,
            label: b.name,
        }));
    },
    createDepartment: async (data) => {
        try {
            await apiCall.post('/api/v1/departments', data);
            toast.success("data berhasil disimpan");
            await get().fetchDepartments({perPage: 20});
        } catch (e) {
            toast.error(e.response.data.message || "Operasi Gagal");
        }
    },
    updateDepartment: async (data, id) => {
        try {
            await apiCall.put(`/api/v1/departments/${id}`, data);
            toast.success("data berhasil disimpan");
            set({openModal: false});
            await get().fetchDepartments({perPage: 20});
        } catch (e) {
            toast.error(e.response.data.message || "Operasi Gagal");
        }
    },
    showDepartment: async (id) => {
        try {
            const resp = await apiCall.get(`/api/v1/departments/${id}`);
            set({departmentValue: resp.data})
        } catch (e) {
            console.log(e)
        }
    },
    bulkDeleteDepartment: async (ids) => {
        try {
            await apiCall.delete("api/v1/departments/bulk", {data: {ids}});
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