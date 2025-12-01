import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";

export const useRoleStore = create((set, get) => ({
    isLoading: false,
    error: null,
    roleData: null,
    search: "",
    permissionsData: null,
    roleValue: null,
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
    showRole: async (roleUuid) => {
        set({isLoading: true, error: null});
        try {
            const response = await apiCall.get(`/api/v1/roles/${roleUuid}`);
            set({
                roleValue: response.data,
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
    assignPermissions: async (selectedRole, permissionUuids) => {
        set({isLoading: true});
        try {
            const response = await apiCall.put(`/api/v1/roles/${selectedRole.uuid}`, {
                permissions: permissionUuids,
                name: selectedRole.name,
            });
            toast.success("Permissions assigned successfully");
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to assign permissions");
            throw error;
        } finally {
            set({isLoading: false});
        }
    },
    fetchPermissions: async () => {
        try {
            const response = await apiCall.get("/api/v1/permissions");
            set({
                permissionsData: response.data,
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

            console.log(e);
            const errorMessage = e.response?.data?.message || "Failed to update role";
            set({
                error: errorMessage,
                isLoading: false
            });
            return {success: false, message: errorMessage};
        }
    },

    deleteRole: async (uuid) => {
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