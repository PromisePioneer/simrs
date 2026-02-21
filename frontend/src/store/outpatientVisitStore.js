import {create} from "zustand";
import {toast} from "sonner";
import apiCall from "@/services/apiCall.js";

export const useOutpatientVisitStore = create((set, get) => ({
    isLoading: false,
    openDeleteModal: false,
    waitingPatients: [],
    currentPage: 1,
    success: false,
    fetchOutPatientVisit: async ({perPage = null, status = 'waiting'}) => {
        try {
            set({isLoading: true, outpatientVisit: null});
            const {search} = get();

            const params = {page: get().currentPage};
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get('/api/v1/outpatient-visits?status=waiting', {params});

            if (status === 'waiting') {
                set({waitingPatients: response.data, isLoading: false});
            }
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    createOutpatientVisit: async (data) => {
        try {

            await apiCall.post("/api/v1/outpatient-visits", data);
            toast.success("Berhasil menambahkan kunjungan pasien baru.");
            return {success: true};
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");

        }
    },
    showOutPatientVisit: async (id) => {
        try {

        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");

        }
    },
    updateOutpatientVisit: async (id, data) => {
        try {

            await apiCall.post(`/api/v1/outpatient-visits/${id}`, data);
            toast.success("Berhasil menambahkan kunjungan pasien baru.");
            return {success: true};
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");

        }
    },
    destroyOutPatientVisit: async (id) => {
        try {

        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    }
}));