import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";

export const useBedStore = create((set, get) => ({
    isLoading: false,
    deleteLoading: false,
    beds: [],
    bedValue: null,
    openModal: false,
    openDeleteModal: false,

    setOpenModal: async (id) => {
        if (id) {
            await get().showBed(id);
        } else {
            set({bedValue: null});
        }
        set({openModal: !get().openModal});
    },

    setOpenDeleteModal: async (id) => {
        if (id) {
            await get().showBed(id);
        }
        set({openDeleteModal: !get().openDeleteModal});
    },

    showBed: async (id) => {
        try {
            const resp = await apiCall.get(`/api/v1/facilities/beds/${id}`);
            set({bedValue: resp.data});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    createBed: async (data) => {
        try {
            await apiCall.post("/api/v1/facilities/beds", data);
            toast.success("Berhasil menambahkan tempat tidur.");
            set({openModal: false});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    updateBed: async (id, data) => {
        try {
            await apiCall.put(`/api/v1/facilities/beds/${id}`, data);
            toast.success("Berhasil menyimpan perubahan.");
            set({openModal: false});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    deleteBed: async (id) => {
        try {
            set({deleteLoading: true});
            await apiCall.delete(`/api/v1/facilities/beds/${id}`);
            toast.success("Berhasil menghapus tempat tidur.");
            set({openDeleteModal: false, deleteLoading: false});
        } catch (e) {
            set({deleteLoading: false});
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    fetchBedOptions: async (search, status = "available") => {
        const res = await apiCall.get("/api/v1/facilities/beds", {
            params: {search, status}
        });
        const data = res.data ?? [];
        return data.map(b => ({
            value: b.id,
            label: `${b.bed_number} - ${b.room.name}`
        }));
    },
}));