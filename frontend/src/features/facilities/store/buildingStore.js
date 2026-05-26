import {create} from "zustand";
import apiCall from "@shared/services/apiCall.js";
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
            await get().showBuilding(id);
        }
        set({openModal: !get().openModal});
    },
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
    fetchBuildingOptions: async (search) => {
        const res = await apiCall.get("/api/v1/facilities/buildings", {
            params: {search}
        });
        // Sesuaikan dengan struktur response API kamu
        const data = res.data?.data ?? res.data ?? [];
        return data.map(b => ({
            value: b.id,
            label: b.name,
        }));
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
    deleteBuilding: async (ids) => {
        try {
            await apiCall.delete(`api/v1/facilities/buildings/bulk-destroy`, {data: {ids}});
            set({selectedIds: []});
            await get().fetchBuildings({perPage: 20});
            get().setOpenDeleteModal();
            toast.success("Berhasil menghapus Gedung.");
        } catch (e) {
            toast.error(e.response?.data?.message || 'Operasi Gagal');
            throw e;
        }
    },
}));