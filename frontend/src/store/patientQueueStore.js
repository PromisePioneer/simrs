import {create} from "zustand";
import {toast} from "sonner";
import apiCall from "@/services/apiCall.js";

export const usePatientQueueStore = create((set, get) => ({
    isLoading: false,
    openDeleteModal: false,
    patientQueues: [],
    currentPage: 1,
    search: "",
    setSearch: (search) => set({search}),
    success: false,
    fetchPatientQueues: async ({perPage = null, status = null}) => {
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

            if (status) {
                params.status = status;
            }

            const response = await apiCall.get('/api/v1/queues', {params});

            set({
                isLoading: false,
                patientQueues: response.data,
            });
        } catch (e) {
            toast.error("Operasi Gagal");
        }
    },

    startDiagnose: async (id) => {
        try {
            await apiCall.post(`/api/v1/queues/${id}/start`);
            toast.success("Berhasil memulai diagnosa.");
        } catch (e) {
        }
    }
}));