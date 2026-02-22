import {create} from "zustand";
import {toast} from "sonner";
import apiCall from "@/services/apiCall.js";

export const usePatientQueueStore = create((set, get) => ({
    isLoading: false,
    openDeleteModal: false,
    patientQueues: [],
    currentPage: 1,
    success: false,
    fetchPatientQueues: async ({perPage = null, status = 'waiting'}) => {
        try {
            set({isLoading: true, patientQueues: null});
            const {search} = get();

            const params = {page: get().currentPage};
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get('/api/v1/queues', {params});

            if (status === 'waiting') {
                set({patientQueues: response.data, isLoading: false});
            }
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    }
}));