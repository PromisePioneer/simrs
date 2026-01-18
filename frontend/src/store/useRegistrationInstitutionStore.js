import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";

export const useRegistrationInstitutionStore = create((set, get) => ({
    isLoading: false,
    error: null,
    institutionData: [],
    strData: [],
    sipData: [],
    search: "",
    openModal: false,
    openDeleteModal: false,
    institutionValue: null,
    currentPage: 1,
    setOpenModal: (openModal, id) => {

        if (id) {
            get().showInstitution(id);
        }

        set({openModal: openModal});
    },
    setOpenDeleteModal: (openDeleteModal, id) => {
        set({openDeleteModal: openDeleteModal});
    },
    columns: () => {
        return [
            {header: "No", className: "w-[60px]"},
            {header: "Nama Institusi", className: "min-w-[280px]"},
            {header: "Tipe", className: "min-w-[200px]"},
            {header: "Actions", className: "text-right w-[120px]"},
        ]
    },
    setCurrentPage: (page) => {
        set({currentPage: page});
    },
    setSearch: (searchValue) => {
        set({search: searchValue});
    },
    fetchInstitutions: async ({perPage = null, type = null} = {}) => {
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


            if (type) {
                params.type = type;
            }


            const response = await apiCall.get("/api/v1/registration-institutions", {
                params: params
            });


            if (type === "str") {
                set({
                    strData: response.data,
                    isLoading: false,
                    error: null
                })
            } else if (type === "sip") {
                set({
                    sipData: response.data,
                    isLoading: false,
                    error: null
                })
            } else {
                set({
                    institutionData: response.data,
                    isLoading: false,
                    error: null
                });
            }
        } catch (e) {
            set({
                error: e,
                isLoading: false
            });
        }
    },
    async createInstitution(data) {
        try {
            set({isLoading: true});
            await apiCall.post("/api/v1/registration-institutions", data);
            toast.success("Berhasil menambahkan.");
            await get().fetchInstitutions({perPage: 20});
            set({error: null, openModal: false});
        } catch (e) {
            const errorMessage = e.response?.data?.message || "Operasi Gagal";
            set({error: errorMessage});
            return {success: false, message: errorMessage};
        } finally {
            set({isLoading: false})
        }
    },
    async updateInstitution(id, data) {
        try {
            await apiCall.put(`/api/v1/registration-institutions/${id}`, data);
            await get().fetchInstitutions({perPage: 20});
            toast.success("Berhasil menyimpan perubahan.");
            set({error: null, openModal: false});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    showInstitution: async (id) => {
        set({error: null});
        try {
            const response = await apiCall.get(`/api/v1/registration-institutions/${id}`);
            set({
                institutionValue: response.data,
                isLoading: false,
                error: null
            });
        } catch (e) {
            set({error: e});
            toast.error("Operasi Gagal")
        }
    },
}));