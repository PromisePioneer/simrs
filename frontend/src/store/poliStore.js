import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";

export const usePoliStore = create((set, get) => ({
    isLoading: false,
    poliData: [],
    poliValue: null,
    currentPage: 1,
    search: "",
    openModal: false,
    openDeleteModal: false,
    deleteLoading: false,
    columns: () => ([
        {key: 'no', label: 'No', width: '5%'},
        {key: 'name', label: 'Kode', width: '15%'},
        {key: 'actions', label: 'Aksi', width: '10%', align: 'right'}
    ]),
    setSearch: (searchValue) => {
        set({search: searchValue});
    },
    setCurrentPage: (page) => {
        set({currentPage: page});
    },
    setOpenModal: async (id) => {
        if (id) {
            await get().showPoli(id);
        }
        set({openModal: !get().openModal})
    },
    setOpenDeleteModal: async (id) => {
        if (id) {
            await get().showPoli(id);
        }
        set({openDeleteModal: !get().openDeleteModal})
    },
    fetchPoli: async ({perPage = null} = {}) => {
        try {
            const {search} = get();

            const params = {
                page: get().currentPage,
            };
            if (perPage) {
                params.per_page = perPage;
            }

            if (search && search.trim() !== "") {
                params.search = search;
            }
            const response = await apiCall.get('/api/v1/poli', {params});

            set({
                isLoading: false,
                poliData: response.data
            })
        } catch (e) {
            toast.error("Operasi Gagal");
        }
    },
    createPoli: async (data) => {
        try {
            await apiCall.post("/api/v1/poli", data);
            toast.success("Berhasil menambahkan data.");
            set({openModal: false});
            await get().fetchPoli({perPage: 20});
        } catch (e) {
            toast.error(e?.response.data.message || "Operasi Gagal");
        }
    },
    showPoli: async (id) => {
        try {
            const response = await apiCall.get(`/api/v1/poli/${id}`);
            set({poliValue: response.data});
        } catch (e) {
            toast.error(e.response.data.message || 'Operasi Gagal');
        }
    },
    updatePoli: async (id, data) => {
        try {
            await apiCall.put(`/api/v1/poli/${id}`, data);
            toast.success("Berhasil menyimpan perubahan data.");
            set({openModal: false});
            await get().fetchPoli({perPage: 20})
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    deletePoli: async (id) => {
        try {
            set({deleteLoading: true});
            await apiCall.delete(`/api/v1/poli/${id}`);
            toast.success("Berhasil Menghapus data");
            set({openDeleteModal: false, deleteLoading: false});
            await get().fetchPoli({perPage: 20});
        } catch (e) {
            const errorMessage = e.response?.data?.message || "Operasi Gagal";
            set({
                error: errorMessage,
            })
        }
    }
}))