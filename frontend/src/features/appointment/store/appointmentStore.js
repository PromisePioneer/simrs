import {create} from "zustand";
import apiCall from "@shared/services/apiCall.js";
import {toast} from "sonner";

export const useAppointmentStore = create((set, get) => ({
    appointments: null,
    search: "",
    currentPage: 1,
    statusFilter: "",
    advancedStatusFilter: "",
    isLoading: false,
    isDeleting: false,
    selectedIds: [],
    openDeleteModal: false,


    setOpenDeleteModal: () => set({openDeleteModal: !get().openDeleteModal}),
    setSelectedIds: (ids) => set((state) => ({
        selectedIds: typeof ids === 'function' ? ids(state.selectedIds) : ids
    })),
    setIsDeleting: () => set({isDeleting: !get().isDeleting}),
    setSearch: (search) => set({search, currentPage: 1}),
    setCurrentPage: (currentPage) => set({currentPage}),
    setStatusFilter: (statusFilter) => set({statusFilter, currentPage: 1}),
    setAdvancedStatusFilter: (advancedStatusFilter) => set({advancedStatusFilter, currentPage: 1}),
    fetchAppointments: async (params = {}) => {
        set({isLoading: true});
        try {
            const {search, currentPage, statusFilter, advancedStatusFilter} = get();
            const res = await apiCall.get("api/v1/appointments", {
                params: {
                    page: currentPage,
                    per_page: params.perPage ?? 20,
                    ...(search && {search}),
                    ...(statusFilter && {status: statusFilter}),
                    ...(advancedStatusFilter && {advanced_status: advancedStatusFilter}),
                    ...(params.dateFrom && {date_from: params.dateFrom}), // ← tambah ini
                    ...(params.dateTo && {date_to: params.dateTo}),       // ← tambah ini
                },
            });
            set({appointments: res.data});
        } catch (e) {
            toast.error(e.response.data.message || 'Operasi Gagal');
            throw e;
        } finally {
            set({isLoading: false});
        }
    },
    createAppointment: async (data) => {
        try {
            const res = await apiCall.post("api/v1/appointments", data);
        } catch (e) {
            toast.error(e.response.data.message || 'Operasi Gagal');
            throw e;
        }
    },
    showAppointment: async (id) => {
        try {
            const res = await apiCall.get(`api/v1/appointments/${id}`);
            set({appointmentValue: res.data});
            return res.data
        } catch (e) {
            toast.error(e.response.data.message || 'Operasi Gagal');
            throw e;
        }
    },

    updateAppointment: async (id, data) => {
        try {

            const res = await apiCall.put(`api/v1/appointments/${id}`, data);
            return res.data;
        } catch (e) {
            toast.error(e.response.data.message || 'Operasi Gagal');
            throw e;
        }
    },
    bulkDeleteAppointments: async (ids) => {
        try {
            await apiCall.delete("api/v1/appointments/bulk", {data: {ids}});
            get().fetchAppointments();

            get().setIsDeleting();
            get().setOpenDeleteModal();
        } catch (e) {
            toast.error(e.response.data.message || 'Operasi Gagal');
            throw e;
        }
    },
}));
