import { create } from "zustand";
import apiCall from "@/shared/services/apiCall.js";
import { toast } from "sonner";

export const usePaymentMethodStore = create((set, get) => ({
    paymentMethodLoading: false,
    paymentMethodTypeLoading: false,
    paymentMethods: [],
    paymentMethodTypes: [],
    paymentMethodValue: null,
    paymentMethodValueLoading: false,
    error: null,
    search: "",
    submitLoading: false,
    openModal: false,
    openDeleteModal: false,
    currentPage: 1,

    setSearch: (search) => set({ search }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setOpenModal: (open, id) => {
        if (id) get().showPaymentMethod(id);
        set({ openModal: open });
    },
    setOpenDeleteModal: (open, id) => {
        get().showPaymentMethod(id);
        set({ openDeleteModal: open });
    },

    fetchPaymentMethods: async ({ perPage = null } = {}) => {
        try {
            set({ paymentMethodLoading: true, error: null });
            const { search, currentPage } = get();
            const params = { page: currentPage };
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get("/api/v1/payment-methods", { params });
            set({ paymentMethodLoading: false, paymentMethods: response.data });
        } catch (e) {
            set({ paymentMethodLoading: false });
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    fetchPaymentMethodTypes: async () => {
        try {
            set({ paymentMethodTypeLoading: true });
            const response = await apiCall.get("/api/v1/payment-methods/types");
            set({ paymentMethodTypes: response.data, paymentMethodTypeLoading: false });
        } catch (e) {
            set({ paymentMethodTypeLoading: false });
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    showPaymentMethod: async (id) => {
        set({ paymentMethodValueLoading: true });
        try {
            const response = await apiCall.get(`/api/v1/payment-methods/${id}`);
            set({ paymentMethodValue: response.data, paymentMethodValueLoading: false });
        } catch (e) {
            set({ paymentMethodValueLoading: false });
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    createPaymentMethod: async (data) => {
        set({ submitLoading: true });
        try {
            await apiCall.post("/api/v1/payment-methods", data);
            toast.success("Metode pembayaran berhasil ditambahkan.");
            set({ openModal: false, submitLoading: false });
            await get().fetchPaymentMethods({ perPage: 20 });
        } catch (e) {
            set({ submitLoading: false });
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    updatePaymentMethod: async (id, data) => {
        set({ submitLoading: true });
        try {
            await apiCall.put(`/api/v1/payment-methods/${id}`, data);
            toast.success("Metode pembayaran berhasil diperbarui.");
            set({ openModal: false, submitLoading: false });
            await get().fetchPaymentMethods({ perPage: 20 });
        } catch (e) {
            set({ submitLoading: false });
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    deletePaymentMethod: async (id) => {
        try {
            await apiCall.delete(`/api/v1/payment-methods/${id}`);
            toast.success("Metode pembayaran berhasil dihapus.");
            set({ openDeleteModal: false });
            await get().fetchPaymentMethods({ perPage: 20 });
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
}));
