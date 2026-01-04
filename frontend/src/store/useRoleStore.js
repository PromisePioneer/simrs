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
                {header: "Type", className: "w-[120px]"},
                {header: "Guard", className: "w-[120px]"},
                {header: "Created At", className: "w-[150px]"},
                {header: "Actions", className: "w-[180px] text-right"},
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

                set((state) => ({
                    ...state,
                    roleData: response.data,
                    error: null
                }));

            } catch (e) {
                toast.error(e?.response?.data?.message || e.message || "Error fetching users");
            } finally {
                set({isLoading: false});
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
                set({
                    error: e,
                });
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
        createRole: async (data) => {
            set({isLoading: true});
            try {
                await apiCall.post("/api/v1/roles", data);
                toast.success("Data berhasil disimpan");
                set({openModal: false});
                await get().fetchRoles({perPage: 20})
            } catch (e) {
                toast.error("Terjadi kesalahan");
            }
        },

        updateRole: async (data) => {
            set({isLoading: true});
            try {
                await apiCall.put(`/api/v1/roles/${get().roleValue.uuid}`, data);
                set({isLoading: false});
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

        deleteRole: async (id) => {
            set({isLoading: true});
            try {
                await apiCall.delete(`/api/v1/roles/${id}`);
                toast.success("Data berhasil dihapus");
                set({roleValue: null, openDeleteModal: false, isLoading: false});
            } catch (e) {
                const errorMessage = e.response?.data?.message
                set({
                    error: errorMessage,
                    isLoading: false
                });
                return {success: false, message: errorMessage};
            }
        }
    }))
;