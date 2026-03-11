import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
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
    columns: () => ([
        {key: 'no', label: 'No', width: '5%'},
        {key: 'name', label: 'Nama Ruangan', width: '25%'},
        {key: 'description', label: 'Deskripsi', width: '25%'},
        {key: 'actions', label: 'Action', width: '15%', align: 'right'},
    ]),
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
    deleteDepartment: async (id) => {
        try {
            await apiCall.delete(`/api/v1/departments/${id}`);
            toast.success("Data berhasil di hapus");
            set({openDeleteModal: false});
            await get().fetchDepartments({perPage: 20});
        } catch (e) {
            toast.error(e.response.data.message || "Operasi Gagal");
        }
    }
}));