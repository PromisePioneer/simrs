import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import axios from "axios";


export const usePaymentMethodStore = create((set, get) => ({
    paymentMethodLoading: false,
    paymentMethodTypeLoading: false,
    paymentMethods: [],
    paymentMethodTypes: [],
    paymentMethodValueLoading: false,
    paymentMethodValue: null,
    error: null,
    search: '',
    submitLoading: false,
    setSearch: (searchValue) => {
        set({search: searchValue});
    },
    async fetchPaymentMethods({page = 1, perPage = null} = {}) {
        try {
            set({paymentMethodLoading: true, error: null});
            const {search} = get();

            const params = {
                page: page,
            };
            if (perPage) {
                params.per_page = perPage;
            }

            if (search && search.trim() !== "") {
                params.search = search;
            }
            const response = await apiCall.get('/api/v1/payment-methods', {params});

            set({
                paymentMethodLoading: false,
                paymentMethods: response.data
            })

        } catch (e) {
            set({
                error: e.data.message
            })
        }
    },
    async fetchPaymentMethodType({page = 1, perPage = null} = {}) {
        try {
            set({paymentMethodTypeLoading: true});
            const {search} = get();
            const params = {page: page};

            if (perPage) {
                params.per_page = perPage;
            }

            if (search && search.trim() !== "") {
                params.search = search;
            }

            const response = await apiCall.get("/api/v1/payment-method-types", {params})

            set({
                paymentMethodTypeLoading: false,
                paymentMethodTypes: response.data
            })
        } catch (e) {
            console.log(e);
        }
    },
    async createPaymentMethod(data) {
        set({isLoading: true, error: null});
        try {
            await apiCall.post("/api/v1/payment-methods", data);
            set({isLoading: false, error: null});
            return {success: true};
        } catch (e) {
            const errorMessage = e.response?.data?.message || "Failed to create role";
            set({
                error: errorMessage,
                isLoading: false
            });
            return {success: false, message: errorMessage};
        }
    }
}))