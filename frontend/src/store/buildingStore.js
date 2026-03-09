import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";

export const useBuildingStore = create((set, get) => ({
    isLoading: false,
    currentPage: 1,
    search: "",
    buildings: [],
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
            await get().showBuilding(id);
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
            await get().showBuilding(id);
        }
        set({openDeleteModal: !get().openDeleteModal});
    },
    setOpenRestoreModal: () => {
        set({openRestoreModal: !get().openRestoreModal});
    },
    fetchBuildings: async ({perPage = null}) => {
        try {
            set({isLoading: true});
            const {search, currentPage} = get();
            const params = {page: currentPage};

            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;

            const response = await apiCall.get(`/api/v1/facilities/buildings`, {params});
            set({buildings: response.data, isLoading: false});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    createBuilding: async (data) => {
        try {
            await apiCall.post('/api/v1/facilities/buildings', data);
            toast.success("data berhasil disimpan");
            await get().fetchBuildings({perPage: 20});
        } catch (e) {
            toast.error(e.response.data.message || "Operasi Gagal");
        }
    },
    updateBuilding: async (data, id) => {
        try {
            await apiCall.put(`/api/v1/facilities/buildings/${id}`, data);
            toast.success("data berhasil disimpan");
            set({openModal: false});
            await get().fetchBuildings({perPage: 20});
        } catch (e) {
            toast.error(e.response.data.message || "Operasi Gagal");
        }
    },
    showBuilding: async (id) => {
        try {
            const resp = await apiCall.get(`/api/v1/facilities/buildings/${id}`);
            set({buildingValue: resp.data})
        } catch (e) {
            console.log(e)
        }
    },
    deleteBuilding: async (id) => {
        try {
            await apiCall.delete(`/api/v1/facilities/buildings/${id}`);
            toast.success("Data berhasil di hapus");
            set({openDeleteModal: false});
            await get().fetchBuildings({perPage: 20});
        } catch (e) {
            toast.error(e.response.data.message || "Operasi Gagal");
        }
    }
}));