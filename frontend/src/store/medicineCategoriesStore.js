import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";

export const useMedicineCategoriesStore = create((set, get) => ({
    medicineCategories: [],
    medicineCategoryValue: null,
    search: "",
    currentPage: 1,
    openDeleteModal: false,
    openModal: false,
    setOpenModal: async (id = null) => {
        if (id) {
            await get().showMedicineCategory(id);
        }
        set({openModal: !get().openModal})
    },
    setOpenDeleteModal: async (id) => {
        if (id) {
            await get().showMedicineCategory(id);
        }
        set({openDeleteModal: !get().openDeleteModal});
    },
    columns: () => ([
        {key: 'no', label: 'No', width: '5%'},
        {key: 'name', label: 'Pasien', width: '25%'},
        {key: 'type', label: 'type', width: '15%'},
        {key: 'actions', label: 'Action', width: '15%', align: 'right'},
    ]),
    setSearch: (searchValue) => {
        set({search: searchValue});
    },
    setCurrentPage: (page) => {
        set({currentPage: page});
    },
    fetchMedicineCategories: async ({perPage = null} = {}) => {
        try {
            const {search, currentPage} = get();
            const params = {page: currentPage};

            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;

            const response = await apiCall.get("/api/v1/pharmacy/medicine-categories", {params});
            set({medicineCategories: response.data});
        } catch (e) {
            set({error: e.response?.data?.message});
            toast.error(get().error || "Operasi Gagal");
        }
    },
    createMedicineCategory: async (data) => {
        try {
            await apiCall.post("/api/v1/pharmacy/medicine-categories", data);
            toast.success("Berhasil menambahkan kategori obat baru.");
            set({openModal: false});
            await get().fetchMedicineCategories({perPage: 20});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
            throw e;
        }
    },
    updateMedicineCategory: async (id, data) => {
        try {
            await apiCall.put(`/api/v1/pharmacy/medicine-categories/${id}`, data);
            toast.success("Berhasil mengubah kategori obat.");
            set({openModal: false});
            await get().fetchMedicineCategories({perPage: 20});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    showMedicineCategory: async (id) => {
        try {
            const response = await apiCall.get(`/api/v1/pharmacy/medicine-categories/${id}`);
            set({medicineCategoryValue: response.data});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    deleteMedicineCategory: async (id) => {
        try {
            await apiCall.delete(`/api/v1/pharmacy/medicine-categories/${id}`);
            toast.success("Berhasil menghapus kategori obat.");
            set({openDeleteModal: false});
            await get().fetchMedicineCategories({perPage: 20});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    }
}));