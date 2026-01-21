import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";


export const useMedicineRackStore = create((set, get) => ({
    isLoading: false,
    medicineRacks: null,
    search: "",
    currentPage: 1,
    openModal: false,
    openDeleteModal: false,
    unassignedRacks: null,
    racksByMedicineWarehouse: null,
    setOpenModal: (openModal) => set({openModal}),
    setOpenDeleteModal: (openDeleteModal) => set({openDeleteModal}),
    setCurrentPage: (page) => set({currentPage: page}),
    columns: () => ([
        {header: "No", className: "w-[80px]"},
        {header: "Nama"},
        {header: "Gudang"},
        {header: "Actions", className: "text-right"},
    ]),
    fetchMedicineRacks: async ({perPage = null} = {}) => {
        try {
            set({isLoading: true, medicineRacks: null});
            const {search} = get();

            const params = {page: get().currentPage};
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get('/api/v1/pharmacy/medicine-racks', {params});
            set({medicineRacks: response.data, isLoading: false});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
            set({isLoading: false});
        }
    },
    fetchUnassignedRacks: async ({perPage = null} = {}) => {
        try {
            set({isLoading: true, unassignedRacks: null});
            const {search} = get();

            const params = {page: get().currentPage};
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get('/api/v1/pharmacy/medicine-racks/unassigned-racks', {params});
            set({unassignedRacks: response.data, isLoading: false});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
            set({isLoading: false});
        }
    },
    createMedicineRack: async (data) => {
        try {
            const response = await apiCall.post('/api/v1/pharmacy/medicine-racks', data);
            toast.success("Rak berhasil ditambahkan");
            return response.data;
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal menambahkan rak");
            throw e;
        }
    },
    updateMedicineRack: async (id, data) => {
        try {
            const response = await apiCall.put(`/api/v1/pharmacy/medicine-racks/${id}`, data);
            toast.success("Rak berhasil diperbarui");
            return response.data;
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal memperbarui rak");
            throw e;
        }
    },
    deleteMedicineRack: async (id) => {
        try {
            await apiCall.delete(`/api/v1/pharmacy/medicine-racks/${id}`);
            toast.success("Rak berhasil dihapus");
            await get().fetchMedicineRacks();
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal menghapus rak");
            throw e;
        }
    },
    fetchByMedicineWarehouse: async (warehouseId) => {
        try {
            set({isLoading: true, racksByMedicineWarehouse: null});
            const response = await apiCall.get(`/api/v1/pharmacy/medicine-racks/racks-by-warehouses/${warehouseId}`);
            set({racksByMedicineWarehouse: response.data, isLoading: false});
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal menghapus rak");
        }
    }
}))