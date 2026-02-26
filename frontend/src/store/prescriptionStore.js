import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";


export const usePrescriptionStore = create((set, get) => ({
    isLoading: false,
    prescriptions: [],
    degreeValue: null,
    error: null,
    currentPage: 1,
    search: "",
    fetchPrescriptions: async ({perPage = null}) => {
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
            const response = await apiCall.get('/api/v1/prescriptions', {params});

            set({
                isLoading: false,
                degrees: response.data
            })
        } catch (e) {
            set({isLoading: false});
            toast.error(e.data.message);
        }
    }
}));