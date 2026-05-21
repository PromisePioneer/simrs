import {create} from "zustand";
import apiCall from "@/shared/services/apiCall.js";
import {toast} from "sonner";

export const useMedicineWarehouseStore = create((set, get) => ({
    isLoading: false,
    medicineWarehouses: [],
    search: "",
    currentPage: 1,
    medicineWarehouseValue: null,
    openDeleteModal: false,
    openModal: false,

    isDeleting: false,
    selectedIds: [],
    setSelectedIds: (ids) => set((state) => ({
        selectedIds: typeof ids === 'function' ? ids(state.selectedIds) : ids
    })),
    setIsDeleting: () => set({isDeleting: !get().isDeleting}),

    setOpenDeleteModal: async (id) => {
        if (id) await get().showMedicineWarehouse(id);
        set({openDeleteModal: !get().openDeleteModal});
    },
    setOpenModal: async (id = null) => {
        if (id) await get().showMedicineWarehouse(id);
        set({openModal: !get().openModal});
    },
    setCurrentPage: (page) => set({currentPage: page}),
    setSearch: (search) => set({search}),

    fetchMedicineWarehouses: async ({perPage = null} = {}) => {
        try {
            set({isLoading: true, medicineWarehouses: null});
            const {search, currentPage} = get();
            const params = {page: currentPage};
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get("/api/v1/pharmacy/medicine-warehouses", {params});
            set({medicineWarehouses: response.data, isLoading: false});
        } catch (e) {
            set({isLoading: false});
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    fetchMedicineWarehouseOptions: async (search) => {
        const res = await apiCall.get("/api/v1/pharmacy/medicine-warehouses", {params: {search}});
        const data = res.data?.data ?? res.data ?? [];
        return data.map((b) => ({value: b.id, label: b.name}));
    },

    createMedicineWarehouse: async (data) => {
        try {
            const response = await apiCall.post("/api/v1/pharmacy/medicine-warehouses", data);
            toast.success("Berhasil menambahkan gudang obat baru.");
            return {success: true, data: response.data};
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
            return {success: false};
        }
    },

    showMedicineWarehouse: async (id) => {
        try {
            const response = await apiCall.get(`/api/v1/pharmacy/medicine-warehouses/${id}`);
            set({medicineWarehouseValue: response.data});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    updateMedicineWarehouse: async (id, data) => {
        try {
            await apiCall.put(`/api/v1/pharmacy/medicine-warehouses/${id}`, data);
            toast.success("Berhasil mengubah gudang obat.");
            return {success: true};
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
            return {success: false};
        }
    },
    bulkDeleteMedicineWarehouse: async (ids) => {
        try {
            await apiCall.delete("api/v1/pharmacy/medicine-warehouses/bulk", {data: {ids}});
            set({selectedIds: []});
            await get().fetchPoli({perPage: 20});
            get().setOpenDeleteModal();
            toast.success("Berhasil menghapus Warehouse.");
        } catch (e) {
            toast.error(e.response?.data?.message || 'Operasi Gagal');
            throw e;
        }
    },
}));
