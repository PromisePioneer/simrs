import {create} from "zustand/react";
import apiCall from "@/services/apiCall.js";


const usePricingStore = create((get, set) => ({
    isLoading: false,
    pricingData: null,
    error: null,
    fetchPricing: async (currentPage = 1) => {
        set({isLoading: true, error: null});
        try {
            const {search} = get();

            const params = {
                page: currentPage,
                per_page: 20,
            };

            if (search && search.trim() !== "") {
                params.search = search;
            }

            const response = await apiCall.get("/api/v1/plans", {
                params: params
            });

            set({
                pricingData: response.data,
                isLoading: false,
                error: null
            });
        } catch (e) {
            set({
                error: e,
                isLoading: false
            });
        }
    },
}))