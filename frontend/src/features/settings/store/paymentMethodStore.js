import {create} from "zustand";
import apiCall from "@/shared/services/apiCall.js";
import {toast} from "sonner";

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
    isDeleting: false,
    selectedIds: [],

    setSelectedIds: (ids) => set((state) => ({
        selectedIds: typeof ids === 'function' ? ids(state.selectedIds) : ids
    })),
    setIsDeleting: () => set({isDeleting: !get().isDeleting}),

    setSearch: (search) => set({search}),
    setCurrentPage: (page) => set({currentPage: page}),
    setOpenModal: (id) => {
        if (id) get().showPaymentMethod(id);
        set({openModal: !get().openModal});
    },
    setOpenDeleteModal: () => {
        set({openDeleteModal: !get().openDeleteModal});
    },

    fetchPaymentMethods: async ({perPage = null} = {}) => {
        try {
            set({paymentMethodLoading: true, error: null});
            const {search, currentPage} = get();
            const params = {page: currentPage};
            if (perPage) params.per_page = perPage;
            if (search?.trim()) params.search = search;
            const response = await apiCall.get("/api/v1/payment-methods", {params});
            set({paymentMethodLoading: false, paymentMethods: response.data});
        } catch (e) {
            set({paymentMethodLoading: false});
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    fetchPaymentMethodTypeOptions: async (search) => {
        const res = await apiCall.get("/api/v1/payment-method-types", {
            params: {search}
        });
        // Sesuaikan dengan struktur response API kamu
        const data = res.data?.data ?? res.data ?? [];
        return data.map(b => ({
            value: b.id,
            label: b.name,
        }));
    },

    showPaymentMethod: async (id) => {
        set({paymentMethodValueLoading: true});
        try {
            const response = await apiCall.get(`/api/v1/payment-methods/${id}`);
            set({paymentMethodValue: response.data, paymentMethodValueLoading: false});
        } catch (e) {
            set({paymentMethodValueLoading: false});
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    createPaymentMethod: async (data) => {
        set({submitLoading: true});
        try {
            await apiCall.post("/api/v1/payment-methods", data);
            toast.success("Metode pembayaran berhasil ditambahkan.");
            set({openModal: false, submitLoading: false});
            await get().fetchPaymentMethods({perPage: 20});
        } catch (e) {
            set({submitLoading: false});
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    updatePaymentMethod: async (id, data) => {
        set({submitLoading: true});
        try {
            await apiCall.put(`/api/v1/payment-methods/${id}`, data);
            toast.success("Metode pembayaran berhasil diperbarui.");
            set({openModal: false, submitLoading: false});
            await get().fetchPaymentMethods({perPage: 20});
        } catch (e) {
            set({submitLoading: false});
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    bulkDeletePaymentMethod: async (ids) => {
        try {
            await apiCall.delete("api/v1/payment-methods/bulk", {data: {ids}});
            set({selectedIds: []});
            await get().fetchPaymentMethods({perPage: 20}); // ← await dan konsisten perPage
            get().setOpenDeleteModal();
            toast.success("Berhasil menghapus Metode Pembayaran.");
        } catch (e) {
            toast.error(e.response?.data?.message || 'Operasi Gagal');
            throw e;
        }
    },
}));
