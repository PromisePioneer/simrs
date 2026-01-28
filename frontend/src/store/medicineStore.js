import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";


export const useMedicineStore = create((set, get) => ({
    isLoading: false,
    medicines: [],
    medicineValue: null,
    search: "",
    currentPage: 1,
    openDeleteModal: false,
    isDeleteLoading: false,
    setOpenDeleteModal: async (id) => {
        if (id) {
            await get().showMedicine(id);
        }
        set({openDeleteModal: !get().openDeleteModal})
    },
    columns: () => ([
        {key: 'no', label: 'No', width: '5%'},
        {key: 'sku', label: 'SKU'},
        {key: 'name', label: 'Nama'},
        {key: "warehouse", label: "Gudang", width: "15%"},
        {key: 'type', label: 'tipe'},
        {key: 'stock_amount', label: 'Stok'},
        {key: 'actions', label: 'Aksi', width: '10%', align: 'right'}
    ]),
    setCurrentPage: (page) => {
        set({currentPage: page});
    },
    setSearch: (searchValue) => {
        set({search: searchValue});
    },
    fetchMedicines: async ({perPage = null} = {}) => {
        try {
            set({isLoading: true, medicines: null});
            const {search} = get();

            const params = {page: get().currentPage};
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get('/api/v1/pharmacy/medicines', {params});
            set({medicines: response.data, isLoading: false});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    createMedicine: async (data) => {
        try {
            await apiCall.post('/api/v1/pharmacy/medicines', data);
            toast.success("Berhasil menambahkan obat baru.");
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    showMedicine: async (id) => {
        try {
            const response = await apiCall.get(`/api/v1/pharmacy/medicines/${id}`);
            set({medicineValue: response.data});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    deleteMedicine: async (id) => {
        set({isDeleteLoading: true});
        try {
            await apiCall.delete(`/api/v1/pharmacy/medicines/${id}`);
            toast.success("Berhasil menghapus obat.");
            set({openDeleteModal: false, isDeleteLoading: false});
            await get().fetchMedicines({perPage: 20});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    }
}));