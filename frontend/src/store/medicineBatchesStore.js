import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";


export const useMedicineBatchesStore = create((set, get) => ({
    isLoading: false,
    error: null,
    medicineBatches: null,
    perPage: 20,
    currentPage: 1,
    search: "",
    openModal: false,
    openDeleteModal: false,
    setOpenDeleteModal: async (id) => {
        set({openDeleteModal: !get().openDeleteModal});
        if (get().openDeleteModal !== false) {
            await get().showMedicineBatch(id);
        } else {
            set({medicineBatchValue: null});
        }
    },
    setOpenModal: async (id) => {
        if (id) {
            await get().showMedicineBatch(id);
        }else{
            set({medicineBatchValue: null});
        }
        set({openModal: !get().openModal});
    },
    medicineBatchValue: null,
    medicineId: null,
    setCurrentPage: (page) => {
        set({currentPage: page});
    },
    setSearch: (searchValue) => {
        set({search: searchValue});
    },
    columns: () => ([
        {key: 'no', label: 'No', width: '5%'},
        {key: 'batch_number', label: 'Nomor Batch', width: '25%'},
        {key: 'rack_id', label: 'Rak', width: '15%'},
        {key: 'warehouse_id', label: 'Gudang', width: '15%'},
        {key: 'expired_date', label: 'Tgl. Kadaluwarsa', width: '15%'},
        {key: 'stock_amount', label: 'Total Stok', width: '15%'},
        {key: 'actions', label: 'Action', width: '15%', align: 'right'},
    ]),
    fetchMedicineBatches: async ({perPage = null, medicineId}) => {
        try {
            set({isLoading: true, medicineBatches: [], medicineId: medicineId || get().medicineId});
            const {search, currentPage} = get();
            const params = {page: currentPage};

            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;

            const response = await apiCall.get(`/api/v1/pharmacy/medicine-batches/medicine/${medicineId}`, {params});

            set({medicineBatches: response.data, isLoading: false});
        } catch (e) {
            set({isLoading: false, error: e.response?.data?.message});
            toast.error(get().error || "Operasi Gagal");
        }
    },
    showMedicineBatch: async (id) => {
        try {
            const response = await apiCall.get(`/api/v1/pharmacy/medicine-batches/${id}`);
            set({medicineBatchValue: response.data});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    createMedicineBatch: async (data) => {
        try {
            await apiCall.post("/api/v1/pharmacy/medicine-batches", data);
            toast.success("Berhasil menambahkan batch baru.");
            await get().fetchMedicineBatches({perPage: get().perPage, medicineId: get().medicineId});
            set({openModal: false});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    updateMedicineBatch: async (id, data) => {
        try {
            await apiCall.put(`/api/v1/pharmacy/medicine-batches/${id}`, data);
            toast.success("Berhasil menambahkan batch baru.");
            await get().fetchMedicineBatches({perPage: get().perPage, medicineId: get().medicineId});
            set({openModal: false});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    deleteMedicineBatch: async (id) => {
        try {
            await apiCall.delete(`/api/v1/pharmacy/medicine-batches/${id}`);
            toast.success("Berhasil menghapus batch.");
            await get().fetchMedicineBatches({perPage: get().perPage, medicineId: get().medicineId});
            set({openDeleteModal: false, medicineBatchValue: null});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    }
}));