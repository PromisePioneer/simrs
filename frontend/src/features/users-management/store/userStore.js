import { create } from "zustand";
import apiCall from "@/shared/services/apiCall.js";
import { toast } from "sonner";

export const useUserStore = create((set, get) => ({
    isLoading: false,
    userData: [],
    search: "",
    userValue: null,
    currentPage: 1,
    openDeleteModal: false,
    openDeleteModalLoading: false,

    setSearch: (search) => set({ search }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setOpenDeleteModal: async (id) => {
        if (!get().openDeleteModal) {
            await get().showUser(id);
        }
        set({ openDeleteModal: !get().openDeleteModal });
    },

    fetchUsers: async ({ perPage = null } = {}) => {
        set({ isLoading: true });
        try {
            const { search, currentPage } = get();
            const params = { page: currentPage };
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get("/api/v1/users", { params });
            set({ userData: response.data, isLoading: false });
        } catch (e) {
            set({ isLoading: false });
            toast.error(e?.response?.data?.message || e.message || "Terjadi kesalahan");
        }
    },

    fetchDoctors: async () => {
        set({ isLoading: true });
        try {
            const response = await apiCall.get("/api/v1/users?role=Dokter");
            set({ userData: response.data, isLoading: false });
        } catch (e) {
            set({ isLoading: false });
            toast.error(e?.response?.data?.message || e.message || "Terjadi kesalahan");
        }
    },

    // Dipakai fitur lain (outpatient, inpatient) via async-select
    fetchDoctorOptions: async (search) => {
        const res = await apiCall.get("/api/v1/users?role=Dokter", { params: { search } });
        const data = res.data?.data ?? res.data ?? [];
        return data.map((b) => ({ value: b.id, label: b.name }));
    },

    createUser: async (userData) => {
        set({ isLoading: true });
        try {
            await apiCall.post("/api/v1/users", userData);
            set({ isLoading: false });
            toast.success("User berhasil ditambahkan.");
            return { success: true };
        } catch (e) {
            set({ isLoading: false });
            toast.error(e?.response?.data?.message || e.message || "Terjadi kesalahan");
        }
    },

    updateUser: async (uuid, data) => {
        set({ isLoading: true });
        try {
            await apiCall.put(`/api/v1/users/${uuid}`, data);
            set({ isLoading: false });
            toast.success("User berhasil diperbarui.");
            return { success: true };
        } catch (e) {
            set({ isLoading: false });
            toast.error(e?.response?.data?.message || e.message || "Terjadi kesalahan");
        }
    },

    showUser: async (id) => {
        try {
            const response = await apiCall.get(`/api/v1/users/${id}`);
            set({ userValue: response.data });
        } catch (e) {
            toast.error(e.response?.data?.message || "Terjadi kesalahan.");
        }
    },

    deleteUser: async () => {
        set({ openDeleteModalLoading: true });
        try {
            await apiCall.delete(`/api/v1/users/${get().userValue.id}`);
            toast.success("Data berhasil dihapus.");
            set({ openDeleteModal: false, openDeleteModalLoading: false });
            await get().fetchUsers({ perPage: 20 });
        } catch (e) {
            set({ openDeleteModalLoading: false });
            toast.error(e.response?.data?.message || "Terjadi kesalahan.");
        }
    },
}));
