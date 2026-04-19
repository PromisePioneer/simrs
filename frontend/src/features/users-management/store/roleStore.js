import { create } from "zustand";
import apiCall from "@/shared/services/apiCall.js";
import { toast } from "sonner";

export const useRoleStore = create((set, get) => ({
    isLoading: false,
    permissionModalLoading: false,
    error: null,
    roleData: [],
    search: "",
    permissionsData: null,
    roleValue: null,
    openModal: false,
    openDeleteModal: false,
    currentPage: 1,
    openPermissionModal: false,
    selectedPermissions: [],
    permissionSearch: "",
    rolesByTenantId: [],

    setPermissionSearch: (search) => set({ permissionSearch: search }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setSearch: (search) => set({ search }),

    setSelectedPermissions: (permissionUuid) => {
        set((state) => ({
            selectedPermissions: state.selectedPermissions.includes(permissionUuid)
                ? state.selectedPermissions.filter((id) => id !== permissionUuid)
                : [...state.selectedPermissions, permissionUuid],
        }));
    },

    setOpenPermissionModal: async (id) => {
        if (get().openPermissionModal) {
            await get().showRole(id);
        }
        set({ openPermissionModal: !get().openPermissionModal });
    },

    setOpenModal: async (id = null) => {
        if (id) await get().showRole(id);
        set({ openModal: !get().openModal });
    },

    setOpenDeleteModal: async (id) => {
        await get().showRole(id);
        set({ openDeleteModal: !get().openDeleteModal });
    },

    fetchRoles: async ({ perPage = null } = {}) => {
        set({ isLoading: true });
        try {
            const { search, currentPage } = get();
            const params = { page: currentPage };
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get("/api/v1/roles", { params });
            set({ roleData: response.data, isLoading: false });
        } catch (e) {
            set({ isLoading: false });
            toast.error(e.response?.data?.message || "Terjadi kesalahan");
        }
    },

    fetchRolesByTenantId: async (tenantId) => {
        try {
            const response = await apiCall.get(`/api/v1/roles/tenant/${tenantId}`);
            set({ rolesByTenantId: response.data });
        } catch (e) {
            toast.error(e.response?.data?.message || "Terjadi kesalahan");
        }
    },

    fetchPermissions: async () => {
        try {
            const response = await apiCall.get("/api/v1/permissions");
            set({ permissionsData: response.data });
        } catch (e) {
            toast.error(e.response?.data?.message || "Terjadi kesalahan");
        }
    },

    showRole: async (roleUuid) => {
        set({ error: null });
        try {
            const response = await apiCall.get(`/api/v1/roles/${roleUuid}`);
            set({ roleValue: response.data, isLoading: false, error: null });
        } catch (e) {
            toast.error(e.response?.data?.message || "Terjadi kesalahan");
        }
    },

    assignPermissions: async () => {
        try {
            await apiCall.put(`/api/v1/roles/${get().roleValue.uuid}`, {
                permissions: get().selectedPermissions,
                name: get().roleValue.name,
            });
            toast.success("Permissions berhasil diassign.");
            set({ openPermissionModal: false });
        } catch (e) {
            toast.error(e.response?.data?.message || "Terjadi kesalahan");
        }
    },

    createRole: async (data) => {
        set({ isLoading: true });
        try {
            await apiCall.post("/api/v1/roles", data);
            toast.success("Data berhasil disimpan.");
            set({ openModal: false, isLoading: false });
            await get().fetchRoles({ perPage: 20 });
        } catch (e) {
            set({ isLoading: false });
            toast.error(e.response?.data?.message || "Terjadi kesalahan");
        }
    },

    updateRole: async (data) => {
        set({ isLoading: true });
        try {
            await apiCall.put(`/api/v1/roles/${get().roleValue.uuid}`, data);
            set({ isLoading: false });
            return { success: true };
        } catch (e) {
            set({ isLoading: false });
            toast.error(e.response?.data?.message || "Terjadi kesalahan");
        }
    },

    deleteRole: async (id) => {
        set({ isLoading: true });
        try {
            await apiCall.delete(`/api/v1/roles/${id}`);
            toast.success("Data berhasil dihapus.");
            set({ roleValue: null, openDeleteModal: false, isLoading: false });
        } catch (e) {
            set({ isLoading: false });
            toast.error(e.response?.data?.message || "Terjadi kesalahan");
        }
    },
}));
