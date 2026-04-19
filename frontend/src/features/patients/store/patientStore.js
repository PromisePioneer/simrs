import { create } from "zustand";
import apiCall from "@/shared/services/apiCall.js";
import { toast } from "sonner";

export const usePatientStore = create((set, get) => ({
    isLoading: false,
    error: null,
    patients: [],
    search: "",
    currentPage: 1,
    openModal: false,
    openDeleteModal: false,
    patientValue: {},
    patientValueLoading: false,
    previewImage: null,
    patientsWhereHasEmr: [],

    setOpenModal: (openModal) => set({ openModal }),
    setOpenDeleteModal: async (id) => {
        await get().showPatient(id);
        set({ openDeleteModal: !get().openDeleteModal });
    },
    setPreviewImage: (reader = null) => set({ previewImage: reader }),
    setSearch: (search) => set({ search }),
    setCurrentPage: (page) => set({ currentPage: page }),

    fetchPatients: async ({ perPage = null } = {}) => {
        set({ isLoading: true, error: null });
        try {
            const { search, currentPage } = get();
            const params = { page: currentPage };
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get("/api/v1/patients", { params });
            set({ patients: response.data, isLoading: false });
        } catch (e) {
            const msg = e.response?.data?.message || "Operasi Gagal";
            set({ isLoading: false, error: msg });
            toast.error(msg);
        }
    },

    fetchPatientWhereHasEmr: async ({ perPage = null } = {}) => {
        set({ isLoading: true, error: null });
        try {
            const { search, currentPage } = get();
            const params = { page: currentPage };
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get("/api/v1/patients/emr", { params });
            set({ patientsWhereHasEmr: response.data, isLoading: false });
        } catch (e) {
            const msg = e.response?.data?.message || "Operasi Gagal";
            set({ isLoading: false, error: msg });
            toast.error(msg);
        }
    },

    // Dipakai oleh fitur lain (outpatient, inpatient) via async-select
    fetchPatientOptions: async (search) => {
        const res = await apiCall.get("/api/v1/patients", { params: { search } });
        const data = res.data?.data ?? res.data ?? [];
        return data.map((b) => ({ value: b.id, label: b.full_name }));
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
        set({ patientValueLoading: true });
        try {
            const response = await apiCall.get(`/api/v1/patients/${id}`);
            set({ patientValue: response.data, patientValueLoading: false });
        } catch (e) {
            set({ patientValueLoading: false });
            toast.error(e.response?.data?.message || "Operasi Gagal");
            throw e;
        }
    },

    updatePatient: async (id, data) => {
        try {
            data.delete("medical_record_number");
            await apiCall.put(`/api/v1/patients/${id}`, data);
            toast.success("Berhasil mengubah pasien.");
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
            throw e;
        }
    },
}));
