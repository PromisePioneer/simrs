import {create} from "zustand/react";
import apiCall from "@/services/apiCall.js";


export const useUserStore = create((set, get) => ({
    isLoading: false,
    error: null,
    userData: null,
    search: "",
    userValue: null,
    setSearch: (searchValue) => {
        set({search: searchValue});
    },
    fetchUsers: async (currentPage = 1) => {
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

            const response = await apiCall.get(`/api/v1/users`, {
                params: params
            });


            set({
                userData: response.data,
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
    createUser: async (userData) => {
        set({isLoading: true, error: null});
        try {
            await apiCall.post("/api/v1/users", userData);
            set({isLoading: false, error: null});
            return {success: true};
        } catch (e) {
            const errorMessage = e.response?.data?.message || "Failed to create user";
            set({
                error: errorMessage,
                isLoading: false
            });
            return {success: false, message: errorMessage};
        }
    },
    updateUser: async (uuid, roleData) => {
        set({isLoading: true, error: null});
        try {
            await apiCall.put(`/api/v1/users/${uuid}`, roleData);
            set({isLoading: false, error: null});
            return {success: true};
        } catch (e) {
            const errorMessage = e.response?.data?.message || "Failed to update user";
            set({
                error: errorMessage,
                isLoading: false
            });
            return {success: false, message: errorMessage};
        }
    },
    deleteUser: async (uuid) => {
        console.log(uuid);
        set({isLoading: true, error: null});
        try {
            await apiCall.delete(`/api/v1/users/${uuid}`);
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
    },
    showUser: async (id) => {
        set({isLoading: true, error: null});

        try {

            const response = await apiCall.get(`/api/v1/users/${id}`);

            set({
                userValue: response.data,
                isLoading: false,
                error: null
            });
        } catch (e) {
            set({
                error: e,
                isLoading: false
            });
        }
    }
}))