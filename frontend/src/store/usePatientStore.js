import {create} from "zustand/react";
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";

export const usePatientStore = create((set, get) => ({
    isLoading: false,
    error: null,
    patients: null,
    search: "",
    currentPage: 1,
    openModal: false,
    openDeleteModal: false,
    patientValue: null,
    patientValueLoading: false,
    setOpenModal: (openModal, id) => {
        set({openModal: openModal})
    },
    setOpenDeleteModal: (openDeleteModal, id) => {
        set({openDeleteModal: openDeleteModal})
    },
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
            {header: "No Telepon", className: ""},
            {header: "Actions", className: "text-right"},
        ];
    },
    fetchPatients: async ({perPage = null} = {}) => {
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
            const response = await apiCall.get('/api/v1/patients', {params});
            set({
                isLoading: false,
                patients: response.data
            })

        } catch (e) {
            set({
                error: e.data.message
            });
            toast.error(get().error || "Operasi Gagal");
        }
    },
    createPatient: async (data) => {
        try {
            await apiCall.post('/api/v1/patients', data);
            toast.success("Berhasil menambahkan pasien baru.");
            await get().fetchPatients({perPage: 20});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    showPatient: async (id) => {
        set({patientValueLoading: true, error: null})
        try {
            const response = await apiCall.get(`/api/v1/patients/${id}`);
            set({patientValue: response.data, patientValueLoading: false, error: null});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    updatePatient: async (id, data) => {
        try {
            await apiCall.post(`/api/v1/patients/${id}`, data);
            toast.success("Berhasil mengubah pasien.");
            await get().fetchPatients({perPage: 20});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    }
}));