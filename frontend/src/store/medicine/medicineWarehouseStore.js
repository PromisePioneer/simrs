import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";


export const useMedicineWarehouseStore = create((set, get) => ({
    isLoading: false,
    medicineWarehouseData: null,
    search: "",
    currentPage: 1,
    medicineWarehouseValue: null,
    columns: () => ([
        {header: "No", className: "w-[80px]"},
        {header: "Nama"},
        {header: "Actions", className: "text-right"},
    ]),
    setCurrentPage: (page) => {
        set({currentPage: page});
    },
    setSearch: (searchValue) => {
        set({search: searchValue});
    },
    fetchMedicineWarehouses: async ({perPage = null} = {}) => {
        try {
            set({isLoading: true, medicineWarehouseData: null});
            const {search} = get();

            const params = {page: get().currentPage};
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get('/api/v1/medicine-warehouses', {params});
            set({medicineWarehouseData: response.data, isLoading: false});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    createMedicineWarehouse: async (data) => {
        try {
            await apiCall.post("/api/v1/medicine-warehouses", data);
            toast.success("Berhasil menambahkan gudang obat baru.");
            await get().fetchMedicineWarehouses({perPage: 20});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    showMedicineWarehouse: async (id) => {
        try {
            const response = await apiCall.get(`/api/v1/medicine-warehouses/${id}`);
            set({medicineWarehouseValue: response.data});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    updateMedicineWarehouse: async (id) => {
        try {
            const response = await apiCall.put(`/api/v1/medicine-warehouses/${id}`);
            toast.success("Berhasil menambahkan gudang obat baru.");
            await get().fetchMedicineWarehouses({perPage: 20});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    }
}));