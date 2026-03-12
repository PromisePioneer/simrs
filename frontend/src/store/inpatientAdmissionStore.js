import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";

export const useInpatientAdmissionStore = create((set, get) => ({
    isLoading: false,
    inpatientAdmissions: [],
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
    }
}));