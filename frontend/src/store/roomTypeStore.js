import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";

export const useRoomTypeStore = create((set, get) => ({
    isLoading: false,
    roomTypes: [],
    roomTypeValue: null,
    error: null,
    currentPage: 1,
    search: "",
    openModal: false,
    openDeleteModal: false,
    columns: () => ([
        {key: 'no', label: 'No', width: '5%'},
        {key: 'code', label: 'Kode', width: '15%'},
        {key: 'name', label: 'Nama', width: '15%'},
        {key: 'capacity', label: 'Kapasitas', width: '15%'},
        {key: 'actions', label: 'Aksi', width: '10%', align: 'right'}
    ]),
    setSearch: (search) => {
        set({search: search});
    },
    setOpenModal: (id) => {
        set({openModal: !get().openModal});
    },
    setOpenDeleteModal: (id) => {
        set({openDeleteModal: !get().openDeleteModal});
    },
    fetchRoomTypes: async ({perPage = null}) => {
        set({isLoading: true, error: null});
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
            const response = await apiCall.get('/api/v1/room-types', {params});

            set({
                isLoading: false,
                roomTypes: response.data
            })
        } catch (e) {
            set({isLoading: false});
            toast.error(e.data.message || 'Operasi Gagal');
        }
    },
    fetchRoomTypeOptions: async (search) => {
        const res = await apiCall.get("/api/v1/room-types", {params: {search}});
        const data = res.data?.data ?? res.data ?? [];
        return data.map(b => ({
            value: b.id,
            label: b.name,
            capacity: b.default_capacity, // ✅ simpan data extra di sini
        }));
    },
    createRoomType: async (data) => {
        try {
            await apiCall.post("/api/v1/room-types", data);
            toast.success("Berhasil menambahkan data.");
            set({openModal: false});
            await get().fetchRoomTypes({perPage: 20});
        } catch (e) {
            toast.error(e?.response.data.message || "Operasi Gagal");
        }
    },
    showRoomType: async (id) => {
        try {
            const response = await apiCall.get(`/api/v1/room-types/${id}`);
            set({roomTypeValue: response.data});
        } catch (e) {
            toast.error(e.response.data.message || 'Operasi Gagal');
        }
    },
    updateRoomType: async (id, data) => {
        try {
            await apiCall.put(`/api/v1/room-types/${id}`, data);
            toast.success("Berhasil menyimpan perubahan data.");
            set({openModal: false});
            await get().fetchRoomTypes({perPage: 20})
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    deleteRoomType: async (id) => {
        try {
            set({deleteLoading: true});
            await apiCall.delete(`/api/v1/room-types/${id}`);
            toast.success("Berhasil Menghapus data");
            set({openDeleteModal: false, deleteLoading: false});
            await get().fetchRoomTypes({perPage: 20});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal")
        }
    }
}));