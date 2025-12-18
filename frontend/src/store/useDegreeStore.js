import {create} from "zustand";
import {toast} from "sonner";
import apiCall from "@/services/apiCall.js";

export const useDegreeStore = create((set, get) => ({
    isLoading: false,
    degrees: [],
    degreeValue: null,
    error: null,
    currentPage: 1,
    search: "",
    openModal: false,
    openDeleteModal: false,
    degreeValueLoading: false,
    columns: () => {
        return [
            {header: "No", className: "w-[80px]"},
            {header: "Nama", className: ""},
            {header: "Tipe", className: ""},
            {header: "Actions", className: "text-right"},
        ];
    },
    setSearch: (searchValue) => {
        set({search: searchValue});
    },
    setCurrentPage: (currentPage) => {
        set({currentPage: currentPage});
    },
    setOpenModal: (openModal, id) => {
        if (id) {
            get().showDegree(id);
        }
        set({openModal: openModal})
    },
    setOpenDeleteModal: (openDeleteModal, id) => {
        get().showDegree(id);
        set({openDeleteModal: openDeleteModal})
    },
    fetchDegrees: async ({perPage = null} = {}) => {
        set({isLoading: true, error: null});
        try {
            const {search} = get();

            const params = {
                page: get().currentPage,
            };
            if (perPage) {
                params.per_page = perPage;
            }

            if (search && search.trim() !== "") {
                params.search = search;
            }
            const response = await apiCall.get('/api/v1/degrees', {params});

            set({
                isLoading: false,
                degrees: response.data
            })
        } catch (e) {
            set({
                isLoading: false,
                error: e.data.message || "Operasi Gagal"
            });
            toast.error(get.error());
        }
    },
    async createDegree(data) {
        try {
            await apiCall.post("/api/v1/degrees", data);
            toast.success("Berhasil menambahkan.");
            await get().fetchDegrees({perPage: 20});
            set({error: null, openModal: false});
        } catch (e) {
            const errorMessage = e.response?.data?.message || "Operasi Gagal";
            set({error: errorMessage});
        }
    },
    showDegree: async (id) => {
        set({degreeValueLoading: true, error: null})
        try {
            const response = await apiCall.get(`/api/v1/degrees/${id}`);
            set({degreeValue: response.data, degreeValueLoading: false, error: null});
        } catch (e) {
            set({error: e.data.message || 'Operasi Gagal', degreeValueLoading: false});
            toast.error(get.error());
        }
    },
    async updateDegree(id, data) {
        try {
            await apiCall.put(`/api/v1/degrees/${id}`, data);
            toast.success("Berhasil menyimpan perubahan.");
            await get().fetchDegrees({perPage: 20})
            set({error: null, openModal: false});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    async deleteDegree() {
        try {
            await apiCall.delete(`/api/v1/degrees/${get().degreeValue.id}`);
            toast.success("Berhasil Menghapus");
            set({
                openDeleteModal: false,
            })
            await get().fetchDegrees({perPage: 20});
        } catch (e) {
            const errorMessage = e.response?.data?.message || "Operasi Gagal";
            set({
                error: errorMessage,
            })
        }
    }
}))