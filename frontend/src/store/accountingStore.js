import { create } from "zustand";
import apiCall from "@/services/apiCall.js";
import { toast } from "sonner";

export const useAccountingStore = create((set, get) => ({
    // ── Account Categories ─────────────────────────────────────────────────
    isLoading: false,
    accountCategories: [],
    accountCategoryValue: null,
    openCategoryModal: false,
    openCategoryDeleteModal: false,

    setOpenCategoryModal: async (id = null) => {
        if (id) await get().showAccountCategory(id);
        else set({ accountCategoryValue: null });
        set({ openCategoryModal: !get().openCategoryModal });
    },
    setOpenCategoryDeleteModal: async (id = null) => {
        if (id) await get().showAccountCategory(id);
        set({ openCategoryDeleteModal: !get().openCategoryDeleteModal });
    },

    fetchAccountCategories: async () => {
        set({ isLoading: true });
        try {
            const res = await apiCall.get("/api/v1/accounting/account-categories", {
                params: { per_page: 100 },
            });
            set({ accountCategories: res.data?.data ?? res.data, isLoading: false });
        } catch (e) {
            set({ isLoading: false });
            toast.error(e.response?.data?.message || "Gagal memuat kategori akun.");
        }
    },

    showAccountCategory: async (id) => {
        try {
            const res = await apiCall.get(`/api/v1/accounting/account-categories/${id}`);
            set({ accountCategoryValue: res.data });
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal memuat data.");
        }
    },

    createAccountCategory: async (data) => {
        try {
            await apiCall.post("/api/v1/accounting/account-categories", data);
            toast.success("Kategori akun berhasil ditambahkan.");
            set({ openCategoryModal: false });
            await get().fetchAccountCategories();
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal menyimpan.");
            throw e;
        }
    },

    updateAccountCategory: async (id, data) => {
        try {
            await apiCall.put(`/api/v1/accounting/account-categories/${id}`, data);
            toast.success("Kategori akun berhasil diperbarui.");
            set({ openCategoryModal: false });
            await get().fetchAccountCategories();
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal menyimpan.");
            throw e;
        }
    },

    deleteAccountCategory: async (id) => {
        try {
            await apiCall.delete(`/api/v1/accounting/account-categories/${id}`);
            toast.success("Kategori akun berhasil dihapus.");
            set({ openCategoryDeleteModal: false });
            await get().fetchAccountCategories();
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal menghapus.");
        }
    },

    // ── Accounts (CoA) ─────────────────────────────────────────────────────
    accounts: [],
    accountValue: null,
    openAccountModal: false,
    openAccountDeleteModal: false,
    accountSearch: "",
    accountCurrentPage: 1,

    setAccountSearch: (s) => set({ accountSearch: s }),
    setAccountCurrentPage: (p) => set({ accountCurrentPage: p }),

    setOpenAccountModal: async (id = null) => {
        if (id) await get().showAccount(id);
        else set({ accountValue: null });
        set({ openAccountModal: !get().openAccountModal });
    },
    setOpenAccountDeleteModal: async (id = null) => {
        if (id) await get().showAccount(id);
        set({ openAccountDeleteModal: !get().openAccountDeleteModal });
    },

    fetchAccounts: async ({ perPage = 20 } = {}) => {
        set({ isLoading: true });
        try {
            const { accountSearch, accountCurrentPage } = get();
            const params = { page: accountCurrentPage, per_page: perPage };
            if (accountSearch?.trim()) params.search = accountSearch;
            const res = await apiCall.get("/api/v1/accounting/accounts", { params });
            set({ accounts: res.data, isLoading: false });
        } catch (e) {
            set({ isLoading: false });
            toast.error(e.response?.data?.message || "Gagal memuat akun.");
        }
    },

    showAccount: async (id) => {
        try {
            const res = await apiCall.get(`/api/v1/accounting/accounts/${id}`);
            set({ accountValue: res.data });
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal memuat data.");
        }
    },

    createAccount: async (data) => {
        try {
            await apiCall.post("/api/v1/accounting/accounts", data);
            toast.success("Akun berhasil ditambahkan.");
            set({ openAccountModal: false });
            await get().fetchAccounts();
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal menyimpan.");
            throw e;
        }
    },

    updateAccount: async (id, data) => {
        try {
            await apiCall.put(`/api/v1/accounting/accounts/${id}`, data);
            toast.success("Akun berhasil diperbarui.");
            set({ openAccountModal: false });
            await get().fetchAccounts();
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal menyimpan.");
            throw e;
        }
    },

    deleteAccount: async (id) => {
        try {
            await apiCall.delete(`/api/v1/accounting/accounts/${id}`);
            toast.success("Akun berhasil dihapus.");
            set({ openAccountDeleteModal: false });
            await get().fetchAccounts();
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal menghapus.");
        }
    },

    // ── Journal Entries ────────────────────────────────────────────────────
    journalEntries: [],
    journalLoading: false,
    journalFilters: { date_from: "", date_to: "", account_id: "", type: "" },
    journalCurrentPage: 1,

    setJournalFilters: (filters) => set({ journalFilters: { ...get().journalFilters, ...filters } }),
    setJournalCurrentPage: (p) => set({ journalCurrentPage: p }),

    fetchJournalEntries: async ({ perPage = 20 } = {}) => {
        set({ journalLoading: true });
        try {
            const { journalFilters, journalCurrentPage } = get();
            const params = { page: journalCurrentPage, per_page: perPage, ...journalFilters };
            const res = await apiCall.get("/api/v1/accounting/journal", { params });
            set({ journalEntries: res.data, journalLoading: false });
        } catch (e) {
            set({ journalLoading: false });
            toast.error(e.response?.data?.message || "Gagal memuat jurnal.");
        }
    },

    createJournalEntry: async (data) => {
        try {
            await apiCall.post("/api/v1/accounting/journal", data);
            toast.success("Jurnal berhasil disimpan.");
            await get().fetchJournalEntries();
            return true;
        } catch (e) {
            toast.error(e.response?.data?.message || "Gagal menyimpan jurnal.");
            return false;
        }
    },

    // ── Reports ────────────────────────────────────────────────────────────
    reportLoading:    false,
    reportFilters:    { date_from: "", date_to: "" },
    incomeStatement:  null,
    trialBalance:     null,
    balanceSheet:     null,
    cashFlow:         null,
    ledger:           null,

    setReportFilters: (f) => set({ reportFilters: { ...get().reportFilters, ...f } }),

    fetchIncomeStatement: async (params = {}) => {
        set({ reportLoading: true });
        try {
            const res = await apiCall.get("/api/v1/accounting/reports/income-statement", {
                params: { ...get().reportFilters, ...params },
            });
            set({ incomeStatement: res.data?.data, reportLoading: false });
        } catch (e) {
            set({ reportLoading: false });
            toast.error(e.response?.data?.message || "Gagal memuat laporan laba rugi.");
        }
    },

    fetchTrialBalance: async (params = {}) => {
        set({ reportLoading: true });
        try {
            const res = await apiCall.get("/api/v1/accounting/reports/trial-balance", {
                params: { ...get().reportFilters, ...params },
            });
            set({ trialBalance: res.data?.data, reportLoading: false });
        } catch (e) {
            set({ reportLoading: false });
            toast.error(e.response?.data?.message || "Gagal memuat neraca saldo.");
        }
    },

    fetchBalanceSheet: async (params = {}) => {
        set({ reportLoading: true });
        try {
            const res = await apiCall.get("/api/v1/accounting/reports/balance-sheet", {
                params: { ...get().reportFilters, ...params },
            });
            set({ balanceSheet: res.data?.data, reportLoading: false });
        } catch (e) {
            set({ reportLoading: false });
            toast.error(e.response?.data?.message || "Gagal memuat neraca.");
        }
    },

    fetchCashFlow: async (params = {}) => {
        set({ reportLoading: true });
        try {
            const res = await apiCall.get("/api/v1/accounting/reports/cash-flow", {
                params: { ...get().reportFilters, ...params },
            });
            set({ cashFlow: res.data?.data, reportLoading: false });
        } catch (e) {
            set({ reportLoading: false });
            toast.error(e.response?.data?.message || "Gagal memuat arus kas.");
        }
    },

    fetchLedger: async (params = {}) => {
        set({ reportLoading: true });
        try {
            const res = await apiCall.get("/api/v1/accounting/reports/ledger", {
                params: { ...get().reportFilters, ...params },
            });
            set({ ledger: res.data?.data, reportLoading: false });
        } catch (e) {
            set({ reportLoading: false });
            toast.error(e.response?.data?.message || "Gagal memuat buku besar.");
        }
    },
}));