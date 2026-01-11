import {create} from "zustand";
import {toast} from "sonner";
import apiCall from "@/services/apiCall.js";


export const useTenantStore = create((set, get) => ({
    isLoading: false,
    error: null,
    tenants: [],
    search: "",
    currentPage: 1,
    tenantValue: null,
    tenantValueLoading: null,
    setSearch: (searchValue) => {
        set({search: searchValue});
    },
    setCurrentPage: (page) => {
        set({currentPage: page});
    },
    columns: () => {
        return [
            {header: "No", className: "w-[80px]"},
            {header: "Nama", className: ""},
            {header: "Kode", className: ""},
            {header: "Paket", className: ""},
            {header: "No Telepon", className: ""},
            {header: "Actions", className: "text-right"},
        ];
    },
    fetchTenants: async ({perPage = null} = {}) => {
        set({isLoading: true, error: null});
        try {
            const {search} = get();
            const params = {
                page: get().currentPage,
            };
            if (perPage) {
                params.per_page = perPage;
            }

            const response = await apiCall.get('/api/v1/tenants', {params});
            set({isLoading: false, tenants: response.data});
        } catch (e) {
            toast.error(e.data.message || "Operasi Gagal");
        }
    }
}));
