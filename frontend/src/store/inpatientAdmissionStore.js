import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";

export const useInpatientAdmissionStore = create((set, get) => ({
    isLoading: false,
    inpatientAdmissions: [],
    inpatientAdmissionValue: {},
    search: "",
    currentPage: 1,
    setCurrentPage: (page) => {
        set({currentPage: page})
    },
    setSearch: (search) => {
        set({search: search});
    },
    fetchInpatientAdmission: async ({perPage = null}) => {
        try {
            set({isLoading: true});
            const {search, currentPage} = get();
            const params = {page: currentPage};

            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;

            const response = await apiCall.get(`/api/v1/inpatient-admissions`, {params});
            set({inpatientAdmissions: response.data, isLoading: false});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    createInpatientAdmission: async (data) => {
        try {
            await apiCall.post('/api/v1/inpatient-admissions', data);
            return {success: true}
        } catch (e) {
            toast.error(e.response.data.message || "Operasi gagal!");
        }
    },
    showInpatientAdmission: async (id) => {
        try {
            const resp = await apiCall.get(`/api/v1/inpatient-admissions/${id}`);
            set({inpatientAdmissionValue: resp.data});
        } catch (e) {
            toast.error(e.response.data.message || "Operasi gagal!");
        }
    },
    updateInpatientAdmission: async (data, id) => {
        try {
            await apiCall.post(`/api/v1/inpatient-admissions/${id}`, data);
        } catch (e) {
            toast.error(e.response.data.message || "Operasi Gagal");
        }
    },
    deleteInpatientAdmission: async (id) => {
        try {
            await apiCall.delete(`/api/v1/inpatient-admissions/${id}`)
        } catch (e) {
            toast.error(e.response.data.message || "Operasi gagal");
        }
    }
}));