import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";


export const useMedicineWarehouseStore = create((set, get) => ({
    isLoading: false,
    medicineWarehouses: [],
    search: "",
    currentPage: 1,
    medicineWarehouseValue: null,
    opeDeleteModal: false,
    setOpenDeleteModal: async (id) => {
        if (id) {
            await get().showMedicineWarehouse(id);
        }

        set({openDeleteModal: !get().openDeleteModal})
    },
    columns: () => ([
        {header: "No", className: "w-[80px]"},
        {header: "Kode"},
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
            set({isLoading: true, medicineWarehouses: null});
            const {search} = get();

            const params = {page: get().currentPage};
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get('/api/v1/pharmacy/medicine-warehouses', {params});
            set({medicineWarehouses: response.data, isLoading: false});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    createMedicineWarehouse: async (data) => {
        try {
            await apiCall.post("/api/v1/pharmacy/medicine-warehouses", data);
            toast.success("Berhasil menambahkan gudang obat baru.");
            await get().fetchMedicineWarehouses({perPage: 20});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    showMedicineWarehouse: async (id) => {
        try {
            const response = await apiCall.get(`/api/v1/pharmacy/medicine-warehouses/${id}`);
            set({openModal: false});
            set({medicineWarehouseValue: response.data});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    updateMedicineWarehouse: async (id, data) => {
        try {
            await apiCall.put(`/api/v1/pharmacy/medicine-warehouses/${id}`, data);
            toast.success("Berhasil menambahkan gudang obat baru.");
            set({openModal: false});
            await get().fetchMedicineWarehouses({perPage: 20});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    deleteMedicineWarehouse: async (id) => {
        try {
            await apiCall.delete(`/api/v1/pharmacy/medicine-warehouses/${id}`);
            toast.success("Berhasil menghapus gudang obat.");
            set({openDeleteModal: false});
            await get().fetchMedicineWarehouses({perPage: 20});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    }
}));