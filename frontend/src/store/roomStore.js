import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";

export const useRoomStore = create((set, get) => ({
    isLoading: false,
    rooms: null,
    roomValue: null,
    currentPage: 1,
    search: "",
    openModal: false,
    openDeleteModal: false,
    deleteLoading: false,

    columns: () => ([
        {key: 'no',       label: 'No',         width: '5%'},
        {key: 'name',     label: 'Ruangan',    width: '35%'},
        {key: 'capacity', label: 'Kapasitas',  width: '10%'},
        {key: 'status',   label: 'Status Bed', width: '30%'},
        {key: 'actions',  label: 'Aksi',       width: '10%', align: 'right'},
    ]),

    setSearch: (value) => {
        // reset ke page 1 saat search berubah
        set({search: value, currentPage: 1});
    },

    setCurrentPage: (page) => {
        set({currentPage: page});
    },

    fetchRoom: async () => {
        set({isLoading: true});
        try {
            const {search, currentPage} = get();
            const params = {page: currentPage, per_page: 20};
            if (search.trim()) params.search = search;

            const response = await apiCall.get('/api/v1/facilities/rooms', {params});
            set({rooms: response.data, isLoading: false});
        } catch (e) {
            set({isLoading: false});
            toast.error("Operasi Gagal");
        }
    },

    setOpenModal: async (id) => {
        if (id) {
            await get().showRoom(id);
        } else {
            set({roomValue: null});
        }
        set({openModal: !get().openModal});
    },

    setOpenDeleteModal: async (id) => {
        if (id) await get().showRoom(id);
        set({openDeleteModal: !get().openDeleteModal});
    },

    showRoom: async (id) => {
        try {
            const response = await apiCall.get(`/api/v1/facilities/rooms/${id}`);
            set({roomValue: response.data.room ?? response.data});
        } catch (e) {
            toast.error(e.response?.data?.message || 'Operasi Gagal');
        }
    },

    createRoom: async (data) => {
        try {
            await apiCall.post("/api/v1/facilities/rooms", data);
            toast.success("Berhasil menambahkan data.");
            set({openModal: false});
        } catch (e) {
            toast.error(e?.response?.data?.message || "Operasi Gagal");
        }
    },

    updateRoom: async (id, data) => {
        try {
            await apiCall.put(`/api/v1/facilities/rooms/${id}`, data);
            toast.success("Berhasil menyimpan perubahan.");
            set({openModal: false});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    deleteRoom: async (id) => {
        try {
            set({deleteLoading: true});
            await apiCall.delete(`/api/v1/facilities/rooms/${id}`);
            toast.success("Berhasil menghapus data.");
            set({openDeleteModal: false, deleteLoading: false});
        } catch (e) {
            set({deleteLoading: false});
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
}));