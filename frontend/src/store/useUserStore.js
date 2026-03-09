import {create} from "zustand/react";
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";


export const useUserStore = create((set, get) => ({
    isLoading: false,
    userData: [],
    search: "",
    userValue: null,
    currentPage: 1,
    openDeleteModal: false,
    openDeleteModalLoading: false,
    columns: () => {
        return [
            {header: "No", className: "w-[60px]"},
            {header: "User", className: "min-w-[280px]"},
            {header: "Role", className: "w-[140px]"},
            {header: "Telepon", className: "min-w-[200px]"},
            {header: "Alamat", className: "min-w-[200px]"},
            {header: "Actions", className: "text-right w-[120px]"},
        ];
    },
    setOpenDeleteModal: async (id) => {
        if (!get().openDeleteModal) {
            await get().showUser(id);
        }
        set({openDeleteModal: !get().openDeleteModal})
    },
    setCurrentPage: (page) => {
        set({currentPage: page});
    },
    setSearch: (searchValue) => {
        set({search: searchValue});
    },
    fetchUsers: async ({perPage = null} = {}) => {
        set({isLoading: true});
        try {

            const params = {
                page: get().currentPage,
            };

            if (perPage) {
                params.per_page = perPage;
            }

            const {search} = get();
            if (search.trim() !== "") {
                params.search = search.trim();
            }

            const response = await apiCall.get(`/api/v1/users`, {params});

            set((state) => ({
                ...state,
                userData: response.data
            }));

        } catch (e) {
            toast.error(e?.response?.data?.message || e.message || "Terjadi kesalahan");
        } finally {
            set({isLoading: false});
        }
    },
    fetchDoctors: async () => {
        set({isLoading: true});
        try {
            const response = await apiCall.get(`/api/v1/users?role=Dokter`);

            set({userData: response.data, isLoading: false})
        } catch (e) {
            toast.error(e?.response?.data?.message || e.message || "Terjadi kesalahan");
        } finally {
            set({isLoading: false});
        }
    },
    createUser: async (userData) => {
        set({isLoading: true});
        try {
            await apiCall.post("/api/v1/users", userData);
            set({isLoading: false});
            return {success: true};
        } catch (e) {
            toast.error(e?.response?.data?.message || e.message || "Terjadi kesalahan");
        }
    },
    updateUser: async (uuid, data) => {
        set({isLoading: true});
        try {
            await apiCall.put(`/api/v1/users/${uuid}`, data);
            set({isLoading: false});
            return {success: true};
        } catch (e) {
            toast.error(e?.response?.data?.message || e.message || "Terjadi kesalahan");
        }
    },
    deleteUser: async () => {
        set({openDeleteModalLoading: true});
        try {
            await apiCall.delete(`/api/v1/users/${get().userValue.id}`);
            toast.success("Data berhasil dihapus.");
            await get().fetchUsers({perPage: 20});
            set({openDeleteModal: false, openDeleteModalLoading: false});
        } catch (e) {
            toast.error(e.response.data.message || "Terjadi kesalahan.");
            set({openDeleteModalLoading: false});
        }
    },
    showUser: async (id) => {
        try {
            const response = await apiCall.get(`/api/v1/users/${id}`);
            set({
                userValue: response.data,
                isLoading: false
            });
        } catch (e) {
            toast.error(e.response.data.message || "Terjadi kesalahan.");
        }
    }
}))