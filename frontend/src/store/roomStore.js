import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";

export const useRoomStore = create((set, get) => ({
    isLoading: false,
    rooms: [],
    roomValue: null,
    currentPage: 1,
    search: "",
    openModal: false,
    openDeleteModal: false,
    deleteLoading: false,
    columns: () => ([
        {key: 'no', label: 'No', width: '5%'},
        {key: 'room_number', label: 'Nomor', width: '15%'},
        {key: 'name', label: 'Nama', width: '15%'},
        {key: 'capacity', label: 'Capacity', width: '15%'},
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
            await get().showRoom(id);
        }
        set({openModal: !get().openModal})
    },
    setOpenDeleteModal: async (id) => {
        if (id) {
            await get().showRoom(id);
        }
        set({openDeleteModal: !get().openDeleteModal})
    },
    fetchRoom: async ({perPage = null} = {}) => {
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
            const response = await apiCall.get('/api/v1/rooms', {params});

            set({
                isLoading: false,
                rooms: response.data
            })
        } catch (e) {
            toast.error("Operasi Gagal");
        }
    },
    createRoom: async (data) => {
        try {
            await apiCall.post("/api/v1/rooms", data);
            toast.success("Berhasil menambahkan data.");
            set({openModal: false});
            await get().fetchRoom({perPage: 20});
        } catch (e) {
            toast.error(e?.response.data.message || "Operasi Gagal");
        }
    },
    showRoom: async (id) => {
        try {
            const response = await apiCall.get(`/api/v1/rooms/${id}`);
            set({roomValue: response.data});
        } catch (e) {
            toast.error(e.response.data.message || 'Operasi Gagal');
        }
    },
    updateRoom: async (id, data) => {
        try {
            await apiCall.put(`/api/v1/rooms/${id}`, data);
            toast.success("Berhasil menyimpan perubahan data.");
            set({openModal: false});
            await get().fetchRoom({perPage: 20})
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    deleteRoom: async (id) => {
        try {
            set({deleteLoading: true});
            await apiCall.delete(`/api/v1/rooms/${id}`);
            toast.success("Berhasil Menghapus data");
            set({openDeleteModal: false, deleteLoading: false});
            await get().fetchRoom({perPage: 20});
        } catch (e) {
            const errorMessage = e.response?.data?.message || "Operasi Gagal";
            set({
                error: errorMessage,
            })
        }
    }
}))