import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";

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
        setPermissionSearch: (searchValue) => set({permissionSearch: searchValue}),
        setSelectedPermissions: (permissionUuid) => {
            set((state) => ({
                selectedPermissions: state.selectedPermissions.includes(permissionUuid)
                    ? state.selectedPermissions.filter(id => id !== permissionUuid)
                    : [...state.selectedPermissions, permissionUuid]
            }));
        },
        setOpenPermissionModal: async (id) => {
            if (get().openPermissionModal) {
                await get().showRole(id);
            }
            set({openPermissionModal: !get().openPermissionModal})
        },
        setCurrentPage: (page) => set({currentPage: page}),
        setOpenModal: async (id) => {
            if (id) {
                await get().showRole(id);
            }
            set(
                (state) => ({
                    openModal: !state.openModal
                })
            )
        },
        setOpenDeleteModal: async (id) => {
            await get().showRole(id);
            set({openDeleteModal: !get().openDeleteModal})
        },
        setSearch: (searchValue) => {
            set({search: searchValue});
        },
        columns: () => {
            return [
                {header: "No", className: "w-[80px]"},
                {header: "Nama", className: "min-w-[200px]"},
                {header: "Tipe", className: "w-[120px]"},
                {header: "Created At", className: "w-[150px]"},
                {header: "Aksi", className: "w-[180px] text-right"},
            ];
        },
        fetchRoles: async ({perPage = null} = {}) => {
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

                const response = await apiCall.get(`/api/v1/roles`, {params});

                set({roleData: response.data});
            } catch (e) {
                toast.error(e?.response?.data?.message || "Terjadi kesalahan");
            } finally {
                set({isLoading: false});
            }
        },
        fetchRolesByTenantId: async (tenantId) => {
            try {
                const response = await apiCall.get(`/api/v1/roles/tenant/${tenantId}`);
                set({rolesByTenantId: response.data});
            } catch (e) {
                toast.error(e.response.data.message || "Terjadi kesalahan.")
            }
        },
        showRole: async (roleUuid) => {
            set({error: null});
            try {
                const response = await apiCall.get(`/api/v1/roles/${roleUuid}`);
                set({
                    roleValue: response.data,
                    isLoading: false,
                    error: null
                });
            } catch (e) {
                toast.error(e.response.data.message || "Terjadi kesalahan.")
            }
        },
        assignPermissions: async () => {
            try {
                await apiCall.put(`/api/v1/roles/${get().roleValue.uuid}`, {
                    permissions: get().selectedPermissions,
                    name: get().roleValue.name,
                });
                toast.success("Permissions assigned successfully");
                set({openPermissionModal: false});
            } catch (error) {
                console.log(error);
                toast.error(error.response?.data?.message);
            }
        },
        fetchPermissions: async () => {
            try {
                const response = await apiCall.get("/api/v1/permissions");
                set({permissionsData: response.data});
            } catch (e) {
                toast.error(e.response.data.message || "Terjadi kesalahan")
            }
        },
        createRole: async (data) => {
            set({isLoading: true});
            try {
                await apiCall.post("/api/v1/roles", data);
                toast.success("Data berhasil disimpan");
                set({openModal: false});
                await get().fetchRoles({perPage: 20})
            } catch (e) {
                toast.error(e.response.data.message || "Terjadi kesalahan")
            }
        },

        updateRole: async (data) => {
            set({isLoading: true});
            try {
                await apiCall.put(`/api/v1/roles/${get().roleValue.uuid}`, data);
                set({isLoading: false});
                return {success: true};
            } catch (e) {
                toast.error(e.response.data.message || "Terjadi kesalahan")
            }
        },
        deleteRole: async (id) => {
            set({isLoading: true});
            try {
                await apiCall.delete(`/api/v1/roles/${id}`);
                toast.success("Data berhasil dihapus");
                set({roleValue: null, openDeleteModal: false, isLoading: false});
            } catch (e) {
                toast.error(e.response.data.message || "Terjadi kesalahan")
            }
        }
    }))
;