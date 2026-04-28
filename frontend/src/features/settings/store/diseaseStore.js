import {create} from "zustand";
import apiCall from "@shared/services/apiCall.js";
import {toast} from "sonner";

export const useDiseaseStore = create((set, get) => ({
    isLoading: false,
    currentPage: 1,
    search: "",
    diseases: [],
    openModal: false,
    openDeleteModal: false,
    openRestoreModal: false,
    diseaseValue: null,
    setCurrentPage: (currentPage) => {
        set({currentPage: currentPage});
    },
    setSearch: (search) => {
        set({search: search});
    },
    setOpenModal: async (id = null) => {
        if (id) {
            await get().showDisease(id);
        }
        set({openModal: !get().openModal});
    },
    setOpenDeleteModal: async (id = null) => {
        if (id) {
            await get().showDisease(id);
        }
        set({openDeleteModal: !get().openDeleteModal});
    },
    setOpenRestoreModal: () => {
        set({openRestoreModal: !get().openRestoreModal});
    },
    fetchDiseases: async ({perPage = null}) => {
        try {
            set({isLoading: true});
            const {search, currentPage} = get();
            const params = {page: currentPage};

            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;

            const response = await apiCall.get(`/api/v1/diseases`, {params});
            set({diseases: response.data, isLoading: false});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    fetchDiseaseOptions: async (search) => {
        const res = await apiCall.get("/api/v1/diseases", {
            params: {search}
        });
        // Sesuaikan dengan struktur response API kamu
        const data = res.data?.data ?? res.data ?? [];
        return data.map(b => ({
            value: b.id,
            label: b.name,
        }));
    },
    createDisease: async (data) => {
        try {
            await apiCall.post('/api/v1/diseases', data);
            toast.success("data berhasil disimpan");
            set({openModal: false});
            await get().fetchDiseases({perPage: 20});
        } catch (e) {
            toast.error(e.response.data.message || "Operasi Gagal");
        }
    },
    updateDisease: async (id, data) => {
        try {
            await apiCall.put(`/api/v1/diseases/${id}`, data);
            toast.success("data berhasil disimpan");
            set({openModal: false});
            await get().fetchDiseases({perPage: 20});
        } catch (e) {
            toast.error(e.response.data.message || "Operasi Gagal");
        }
    },
    showDisease: async (id) => {
        try {
            const resp = await apiCall.get(`/api/v1/diseases/${id}`);
            set({diseaseValue: resp.data})
        } catch (e) {
            console.log(e)
        }
    },
    deleteDisease: async (id) => {
        try {
            await apiCall.delete(`/api/v1/diseases/${id}`);
            toast.success("Data berhasil di hapus");
            set({openDeleteModal: false});
            await get().fetchDiseases({perPage: 20});
        } catch (e) {
            toast.error(e.response.data.msessage || "Operasi Gagal");
        }
    }
}));