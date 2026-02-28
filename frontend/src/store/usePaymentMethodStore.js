import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import axios from "axios";
import {toast} from "sonner";


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
    openModal: false,
    currentPage: 1,
    openDeleteModal: false,
    columns: () => {
        return [
            {header: "No", className: "w-[80px]"},
            {header: "Nama", className: ""},
            {header: "Tipe", className: ""},
            {header: "Actions", className: "text-right"},
        ];
    },
    setOpenDeleteModal: (openDeleteModal, id) => {
        get().showPaymentMethod(id);
        set({openDeleteModal: openDeleteModal});
    },
    setCurrentPage: (page) => {
        set({currentPage: page});
    },
    setOpenModal: (openModal, id) => {
        if (id) {
            get().showPaymentMethod(id);
        }

        set({openModal: openModal});
    },
    setSearch: (searchValue) => {
        set({search: searchValue});
    },
    async fetchPaymentMethods({perPage = null} = {}) {
        try {
            set({paymentMethodLoading: true, error: null});
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
            const response = await apiCall.get('/api/v1/cashier-methods', {params});

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

            const response = await apiCall.get("/api/v1/cashier-method-types", {params})

            set({
                paymentMethodTypeLoading: false,
                paymentMethodTypes: response.data
            })
        } catch (e) {
            set({
                error: e.data.message || "Operasi Gagal"
            })
        }
    },
    async createPaymentMethod(data) {
        try {
            set({isLoading: true});
            await apiCall.post("/api/v1/cashier-methods", data);
            toast.success("Berhasil menambahkan.");
            await get().fetchPaymentMethods({perPage: 20});
            set({error: null, openModal: false});
        } catch (e) {
            const errorMessage = e.response?.data?.message || "Operasi Gagal";
            set({error: errorMessage});
            return {success: false, message: errorMessage};
        } finally {
            set({isLoading: false})
        }
    },
    async showPaymentMethod(id) {
        set({paymentMethodValueLoading: true, error: null});
        try {
            const response = await apiCall.get(`/api/v1/cashier-methods/${id}`);
            set({
                paymentMethodValue: response.data,
                paymentMethodValueLoading: false,
                error: null
            });
        } catch (e) {
            set({
                error: e.data.message,
                paymentMethodValueLoading: false
            });
        }
    },
    async updatePaymentMethod(id, data) {
        try {
            await apiCall.put(`/api/v1/cashier-methods/${id}`, data);
            toast.success("Berhasil menyimpan perubahan.");
            await get().fetchPaymentMethods({perPage: 20});
            set({error: null, openModal: false});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    async deletePaymentMethod() {
        try {
            await apiCall.delete(`/api/v1/cashier-methods/${get().paymentMethodValue.id}`);
            toast.success("Berhasil Menghapus");
            set({
                openDeleteModal: false,
            })
            await get().fetchPaymentMethods({perPage: 20});
        } catch (e) {
            const errorMessage = e.response?.data?.message || "Operasi Gagal";
            set({
                error: errorMessage,
            })
        }
    }
}))