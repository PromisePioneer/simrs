import {create} from "zustand";
import apiCall from "@/services/apiCall.js";

export const useRoleStore = create((set, get) => ({
    isLoading: false,
    error: null,
    roleData: null,
    search: "",

    setSearch: (searchValue) => {
        set({search: searchValue});
    },

    fetchRoles: async (currentPage = 1) => {
        set({isLoading: true, error: null});
        try {
            const {search} = get();

            const params = {
                page: currentPage,
                per_page: 20,
            };

            if (search && search.trim() !== "") {
                params.search = search;
            }

            const response = await apiCall.get("/api/v1/roles", {
                params: params
            });

            set({
                roleData: response.data,
                isLoading: false,
                error: null
            });
        } catch (e) {
            set({
                error: e,
                isLoading: false
            });
        }
    },

    createRole: async (roleData) => {
        set({isLoading: true, error: null});
        try {
            await apiCall.post("/api/v1/roles", roleData);
            set({isLoading: false, error: null});
            return {success: true};
        } catch (e) {
            const errorMessage = e.response?.data?.message || "Failed to create role";
            set({
                error: errorMessage,
                isLoading: false
            });
            return {success: false, message: errorMessage};
        }
    },

    updateRole: async (uuid, roleData) => {
        set({isLoading: true, error: null});
        try {
            await apiCall.put(`/api/v1/roles/${uuid}`, roleData);
            set({isLoading: false, error: null});
            return {success: true};
        } catch (e) {
            const errorMessage = e.response?.data?.message || "Failed to update role";
            set({
                error: errorMessage,
                isLoading: false
            });
            return {success: false, message: errorMessage};
        }
    },

    deleteRole: async (uuid) => {
        console.log(uuid);
        set({isLoading: true, error: null});
        try {
            await apiCall.delete(`/api/v1/roles/${uuid}`);
            set({isLoading: false, error: null});
            return {success: true};
        } catch (e) {
            const errorMessage = e.response?.data?.message
            set({
                error: errorMessage,
                isLoading: false
            });
            return {success: false, message: errorMessage};
        }
    }
}));