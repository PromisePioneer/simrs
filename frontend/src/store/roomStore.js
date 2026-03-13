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
    openRoomDetailModal: false,
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
    setRoomDetailModal: async (id) => {
        if (id) {
            set({openRoomDetailModal: true, roomValue: null}); // ✅ buka modal langsung
            await get().showRoom(id); // fetch di background
        } else {
            set({openRoomDetailModal: false, roomValue: null});
        }
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
            const response = await apiCall.get('/api/v1/facilities/rooms', {params});

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
            await apiCall.post("/api/v1/facilities/rooms", data);
            toast.success("Berhasil menambahkan data.");
            set({openModal: false});
        } catch (e) {
            toast.error(e?.response.data.message || "Operasi Gagal");
        }
    },
    showRoom: async (id, page = 1) => {
        try {
            const response = await apiCall.get(`/api/v1/facilities/rooms/${id}`, {
                params: {page, per_page: 3}
            });

            const room = response.data.room;
            const beds = response.data.beds;

            set({
                roomValue: {
                    ...room,
                    beds: beds.data,
                },
                bedsPagination: beds,
                roomStats: response.data.stats ?? null, // ✅ tambah ini
            });
        } catch (e) {
            toast.error(e.response?.data?.message || 'Operasi Gagal');
        }
    },
    updateRoom: async (id, data) => {
        try {
            await apiCall.put(`/api/v1/facilities/rooms/${id}`, data);
            toast.success("Berhasil menyimpan perubahan data.");
            set({openModal: false});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    deleteRoom: async (id) => {
        try {
            set({deleteLoading: true});
            await apiCall.delete(`/api/v1/facilities/rooms/${id}`);
            toast.success("Berhasil Menghapus data");
            set({openDeleteModal: false, deleteLoading: false});
        } catch (e) {
            const errorMessage = e.response?.data?.message || "Operasi Gagal";
            set({
                error: errorMessage,
            })
        }
    }
}))