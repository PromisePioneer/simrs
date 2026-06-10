import {create} from "zustand";
import apiCall from "@/shared/services/apiCall.js";
import {toast} from "sonner";

export const useRoleStore = create((set, get) => ({
    isLoading: false,
    permissionModalLoading: false,
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
    isDeleting: false,
    selectedIds: [],
    setSelectedIds: (ids) => set((state) => ({
        selectedIds: typeof ids === 'function' ? ids(state.selectedIds) : ids
    })),
    setIsDeleting: () => set({isDeleting: !get().isDeleting}),
    setPermissionSearch: (search) => set({permissionSearch: search}),
    setCurrentPage: (page) => set({currentPage: page}),
    setSearch: (search) => set({search}),

    setSelectedPermissions: (permissionUuid) => {
        // Handle both single UUID (toggle) and array of UUIDs (set)
        if (Array.isArray(permissionUuid)) {
            set({selectedPermissions: permissionUuid});
        } else {
            set((state) => ({
                selectedPermissions: state.selectedPermissions.includes(permissionUuid)
                    ? state.selectedPermissions.filter((id) => id !== permissionUuid)
                    : [...state.selectedPermissions, permissionUuid],
            }));
        }
    },

    setOpenPermissionModal: async (id) => {
        if (id) {
            await get().showRole(id);
            // Load current permissions after role is loaded
            setTimeout(() => {
                const role = get().roleValue;
                if (role?.permissions) {
                    const permissionUuids = role.permissions.map(p => p.uuid);
                    set({selectedPermissions: permissionUuids});
                }
            }, 0);
        } else {
            // Reset permissions when closing modal
            set({selectedPermissions: []});
        }
        set({openPermissionModal: !get().openPermissionModal});
    },
    setOpenModal: async (id = null) => {
        if (id) {
            await get().showRole(id);
        } else {
            set({roleValue: null}); // ← reset roleValue saat tambah baru
        }
        set({openModal: !get().openModal});
    },
    setOpenDeleteModal: async () => {
        set({openDeleteModal: !get().openDeleteModal});
    },
    fetchRoles: async ({perPage = null} = {}) => {
        set({isLoading: true});
        try {
            const {search, currentPage} = get();
            const params = {page: currentPage};
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get("/api/v1/roles", {params});
            set({roleData: response.data, isLoading: false});
        } catch (e) {
            set({isLoading: false});
            toast.error(e.response?.data?.message || "Terjadi kesalahan");
        }
    },

    fetchRolesByTenantId: async (tenantId) => {
        try {
            const response = await apiCall.get(`/api/v1/roles/tenant/${tenantId}`);
            set({rolesByTenantId: response.data});
        } catch (e) {
            toast.error(e.response?.data?.message || "Terjadi kesalahan");
        }
    },
    fetchPermissions: async () => {
        try {
            const response = await apiCall.get("/api/v1/permissions");
            set({permissionsData: response.data});
        } catch (e) {
            toast.error(e.response?.data?.message || "Terjadi kesalahan");
        }
    },
    showRole: async (roleUuid) => {
        try {
            const response = await apiCall.get(`/api/v1/roles/${roleUuid}`);
            set({roleValue: response.data, isLoading: false});
        } catch (e) {
            toast.error(e.response?.data?.message || "Terjadi kesalahan");
        }
    },
    assignPermissions: async () => {
        set({isLoading: true});
        try {
            const response = await apiCall.put(`/api/v1/roles/${get().roleValue.uuid}`, {
                permissions: get().selectedPermissions,
                name: get().roleValue.name,
            });
            toast.success("Permissions berhasil diassign.");
            // Update roleValue with the fresh response that includes updated permissions
            set({roleValue: response.data, openPermissionModal: false, isLoading: false});
            await get().fetchRoles({perPage: 20});
        } catch (e) {
            set({isLoading: false});
            toast.error(e.response?.data?.message || "Terjadi kesalahan");
        }
    },
    createRole: async (data) => {
        set({isLoading: true});
        try {
            await apiCall.post("/api/v1/roles", data);
            toast.success("Data berhasil disimpan.");
            set({openModal: false, isLoading: false});
            await get().fetchRoles({perPage: 20});
        } catch (e) {
            set({isLoading: false});
            toast.error(e.response?.data?.message || "Terjadi kesalahan");
        }
    },
    updateRole: async (data) => {
        set({isLoading: true});
        try {
            await apiCall.put(`/api/v1/roles/${get().roleValue.uuid}`, data);
            set({isLoading: false});
            return {success: true};
        } catch (e) {
            set({isLoading: false});
            toast.error(e.response?.data?.message || "Terjadi kesalahan");
        }
    },
    deleteRole: async (id) => {
        set({isLoading: true});
        try {
            await apiCall.delete(`/api/v1/roles/${id}`);
            toast.success("Data berhasil dihapus.");
            set({roleValue: null, openDeleteModal: false, isLoading: false});
        } catch (e) {
            set({isLoading: false});
            toast.error(e.response?.data?.message || "Terjadi kesalahan");
        }
    },
}));
