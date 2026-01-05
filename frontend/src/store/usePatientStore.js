import {create} from "zustand";
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
    patientValue: {},
    patientValueLoading: false,
    previewImage: null,
    showPatientLoading: false,
    setOpenModal: (openModal) => set({openModal}),
    setOpenDeleteModal: async (openDeleteModal, id) => {
        await get().showPatient(id);
        set({openDeleteModal});
    },
    setPreviewImage: (reader = null) => set({previewImage: reader}),
    setSearch: (search) => set({search}),
    setCurrentPage: (page) => set({currentPage: page}),

    columns: () => ([
        {header: "No", className: "w-[80px]"},
        {header: "Nama"},
        {header: "No Telepon"},
        {header: "Tgl Terakhir Konsultasi"},
        {header: "Actions", className: "text-right"},
    ]),

    fetchPatients: async ({perPage = null} = {}) => {
        set({isLoading: true, error: null});
        try {
            const {search, currentPage} = get();
            const params = {page: currentPage};

            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;

            const response = await apiCall.get("/api/v1/patients", {params});
            set({patients: response.data, isLoading: false});
        } catch (e) {
            set({isLoading: false, error: e.response?.data?.message});
            toast.error(get().error || "Operasi Gagal");
        }
    },

    createPatient: async (data) => {
        try {
            await apiCall.post("/api/v1/patients", data);
            toast.success("Berhasil menambahkan pasien baru.");
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
            throw e;
        }
    },

    showPatient: async (id) => {
        set({patientValueLoading: true})
        try {
            const response = await apiCall.get(`/api/v1/patients/${id}`);
            set({patientValue: response.data, patientValueLoading: false});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
            throw e;
        }
    },

    updatePatient: async (id, data) => {
        try {
            data.delete('medical_record_number');
            await apiCall.put(`/api/v1/patients/${id}`, data);
            toast.success("Berhasil mengubah pasien.");
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
            throw e;
        }
    },
}));
