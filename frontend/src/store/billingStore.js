import { create } from "zustand";
import apiCall from "@/services/apiCall.js";
import { toast } from "sonner";

export const useBillingStore = create((set, get) => ({
    // ── Outpatient Bills ───────────────────────────────────────────────────
    outpatientBills: [],
    outpatientBillValue: null,
    outpatientLoading: false,
    outpatientCurrentPage: 1,
    outpatientSearch: "",
    outpatientFilters: { status: "", date_from: "", date_to: "" },
    openPayOutpatientModal: false,

    setOutpatientCurrentPage: (p) => set({ outpatientCurrentPage: p }),
    setOutpatientSearch: (s) => set({ outpatientSearch: s }),
    setOutpatientFilters: (f) => set({ outpatientFilters: { ...get().outpatientFilters, ...f } }),
    setOpenPayOutpatientModal: async (bill = null) => {
        set({ outpatientBillValue: bill, openPayOutpatientModal: !get().openPayOutpatientModal });
    },

    fetchOutpatientBills: async ({ perPage = 20 } = {}) => {
        set({ outpatientLoading: true });
        try {
            const { outpatientSearch, outpatientCurrentPage, outpatientFilters } = get();
            const params = { page: outpatientCurrentPage, per_page: perPage, ...outpatientFilters };
            if (outpatientSearch?.trim()) params.search = outpatientSearch;
            const res = await apiCall.get("/api/v1/billing/outpatient", { params });
            set({ outpatientBills: res.data, outpatientLoading: false });
        } catch (e) {
            set({ outpatientLoading: false });
            toast.error(e.response?.data?.message || "Gagal memuat tagihan.");
        }
    },

    showOutpatientBill: async (id) => {
        set({ outpatientLoading: true });
        try {
            const res = await apiCall.get(`/api/v1/billing/outpatient/${id}`);
            set({ outpatientBillValue: res.data, outpatientLoading: false });
        } catch (e) {
            set({ outpatientLoading: false });
            toast.error(e.response?.data?.message || "Gagal memuat tagihan.");
        }
    },

    createOutpatientBillFromVisit: async (visitId) => {
        try {
            const res = await apiCall.post(`/api/v1/billing/outpatient/from-visit/${visitId}`);
            toast.success("Draft tagihan berhasil dibuat.");
            return res.data;
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal membuat tagihan.");
        }
    },

    updateOutpatientItems: async (billId, items) => {
        try {
            const res = await apiCall.put(`/api/v1/billing/outpatient/${billId}/items`, { items });
            toast.success("Item tagihan diperbarui.");
            set({ outpatientBillValue: res.data });
            return res.data;
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal memperbarui item.");
        }
    },

    payOutpatientBill: async (billId, data) => {
        try {
            const res = await apiCall.post(`/api/v1/billing/outpatient/${billId}/pay`, data);
            toast.success("Pembayaran rawat jalan berhasil dicatat.");
            set({ openPayOutpatientModal: false });
            await get().fetchOutpatientBills();
            return res.data;
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal memproses pembayaran.");
        }
    },

    cancelOutpatientBill: async (billId) => {
        try {
            await apiCall.post(`/api/v1/billing/outpatient/${billId}/cancel`);
            toast.success("Tagihan dibatalkan.");
            await get().fetchOutpatientBills();
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal membatalkan tagihan.");
        }
    },

    // ── Inpatient Bills ────────────────────────────────────────────────────
    inpatientBills: [],
    inpatientBillValue: null,
    inpatientLoading: false,
    inpatientCurrentPage: 1,
    inpatientSearch: "",
    inpatientFilters: { status: "", date_from: "", date_to: "" },
    openPayInpatientModal: false,

    setInpatientCurrentPage: (p) => set({ inpatientCurrentPage: p }),
    setInpatientSearch: (s) => set({ inpatientSearch: s }),
    setInpatientFilters: (f) => set({ inpatientFilters: { ...get().inpatientFilters, ...f } }),
    setOpenPayInpatientModal: async (bill = null) => {
        set({ inpatientBillValue: bill, openPayInpatientModal: !get().openPayInpatientModal });
    },

    fetchInpatientBills: async ({ perPage = 20 } = {}) => {
        set({ inpatientLoading: true });
        try {
            const { inpatientSearch, inpatientCurrentPage, inpatientFilters } = get();
            const params = { page: inpatientCurrentPage, per_page: perPage, ...inpatientFilters };
            if (inpatientSearch?.trim()) params.search = inpatientSearch;
            const res = await apiCall.get("/api/v1/billing/inpatient", { params });
            set({ inpatientBills: res.data, inpatientLoading: false });
        } catch (e) {
            set({ inpatientLoading: false });
            toast.error(e.response?.data?.message || "Gagal memuat tagihan.");
        }
    },

    showInpatientBill: async (id) => {
        set({ inpatientLoading: true });
        try {
            const res = await apiCall.get(`/api/v1/billing/inpatient/${id}`);
            set({ inpatientBillValue: res.data, inpatientLoading: false });
        } catch (e) {
            set({ inpatientLoading: false });
            toast.error(e.response?.data?.message || "Gagal memuat tagihan.");
        }
    },

    createInpatientBillFromAdmission: async (admissionId) => {
        try {
            const res = await apiCall.post(`/api/v1/billing/inpatient/from-admission/${admissionId}`);
            toast.success("Draft tagihan rawat inap berhasil dibuat.");
            return res.data;
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal membuat tagihan.");
        }
    },

    updateInpatientItems: async (billId, items) => {
        try {
            const res = await apiCall.put(`/api/v1/billing/inpatient/${billId}/items`, { items });
            toast.success("Item tagihan diperbarui.");
            set({ inpatientBillValue: res.data });
            return res.data;
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal memperbarui item.");
        }
    },

    payInpatientBill: async (billId, data) => {
        try {
            const res = await apiCall.post(`/api/v1/billing/inpatient/${billId}/pay`, data);
            toast.success("Pembayaran rawat inap berhasil dicatat.");
            set({ openPayInpatientModal: false });
            await get().fetchInpatientBills();
            return res.data;
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal memproses pembayaran.");
        }
    },

    cancelInpatientBill: async (billId) => {
        try {
            await apiCall.post(`/api/v1/billing/inpatient/${billId}/cancel`);
            toast.success("Tagihan dibatalkan.");
            await get().fetchInpatientBills();
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal membatalkan tagihan.");
        }
    },
}));
