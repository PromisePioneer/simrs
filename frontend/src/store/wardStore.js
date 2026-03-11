import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";

export const useWardStore = create((set, get) => ({
    isLoading: false,
    currentPage: 1,
    search: "",
    wards: [],
    openModal: false,
    openDeleteModal: false,
    openRestoreModal: false,
    buildingValue: {},
    setCurrentPage: (currentPage) => {
        set({currentPage: currentPage});
    },
    setSearch: (search) => {
        set({search: search});
    },
    setOpenModal: async (id = null) => {
        if (id) {
            await get().showWard(id);
        }
        set({openModal: !get().openModal});
    },
    columns: () => ([
        {key: 'no', label: 'No', width: '5%'},
        {key: 'name', label: 'Nama', width: '25%'},
        {key: 'department', label: 'Departemen', width: '25%'},
        {key: 'rooms', label: 'Ruangan', width: '25%'},
        {key: 'actions', label: 'Action', width: '15%', align: 'right'},
    ]),
    setOpenDeleteModal: async (id = null) => {
        if (id) {
            await get().showWard(id);
        }
        set({openDeleteModal: !get().openDeleteModal});
    },
    setOpenRestoreModal: () => {
        set({openRestoreModal: !get().openRestoreModal});
    },
    fetchWards: async ({perPage = null}) => {
        try {
            set({isLoading: true});
            const {search, currentPage} = get();
            const params = {page: currentPage};

            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;

            const response = await apiCall.get(`/api/v1/facilities/wards`, {params});
            set({wards: response.data, isLoading: false});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    createWard: async (data) => {
        try {
            await apiCall.post('/api/v1/facilities/wards', data);
            toast.success("data berhasil disimpan");
            set({openModal: false});
            await get().fetchWards({perPage: 20});
        } catch (e) {
            toast.error(e.response.data.message || "Operasi Gagal");
        }
    },
    updateWard: async (data, id) => {
        try {
            await apiCall.put(`/api/v1/facilities/wards/${id}`, data);
            toast.success("data berhasil disimpan");
            set({openModal: false});
            await get().fetchWards({perPage: 20});
        } catch (e) {
            toast.error(e.response.data.message || "Operasi Gagal");
        }
    },
    showWard: async (id) => {
        try {
            const resp = await apiCall.get(`/api/v1/facilities/wards/${id}`);
            set({wardValue: resp.data})
        } catch (e) {
            console.log(e)
        }
    },
    deleteWard: async (id) => {
        try {
            await apiCall.delete(`/api/v1/facilities/wards/${id}`);
            toast.success("Data berhasil di hapus");
            set({openDeleteModal: false});
            await get().fetchWards({perPage: 20});
        } catch (e) {
            toast.error(e.response.data.message || "Operasi Gagal");
        }
    }
}));