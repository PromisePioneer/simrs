import { create } from "zustand";
import apiCall from "@shared/services/apiCall.js";

export const useAppointmentStore = create((set, get) => ({
    appointments: null,
    search: "",
    currentPage: 1,
    statusFilter: "",
    advancedStatusFilter: "",
    isLoading: false,

    setSearch: (search) => set({ search, currentPage: 1 }),
    setCurrentPage: (currentPage) => set({ currentPage }),
    setStatusFilter: (statusFilter) => set({ statusFilter, currentPage: 1 }),
    setAdvancedStatusFilter: (advancedStatusFilter) => set({ advancedStatusFilter, currentPage: 1 }),

    fetchAppointments: async (params = {}) => {
        set({ isLoading: true });
        try {
            const { search, currentPage, statusFilter, advancedStatusFilter } = get();
            const res = await apiCall.get("api/v1/appointments", {
                params: {
                    page: currentPage,
                    per_page: params.perPage ?? 20,
                    ...(search && { search }),
                    ...(statusFilter && { status: statusFilter }),
                    ...(advancedStatusFilter && { advanced_status: advancedStatusFilter }),
                },
            });
            set({ appointments: res.data });
        } catch (e) {
            console.error(e);
        } finally {
            set({ isLoading: false });
        }
    },

    createAppointment: async (data) => {
        const res = await apiCall.post("api/v1/appointments", data);
        return res.data;
    },

    updateAppointment: async (id, data) => {
        const res = await apiCall.put(`api/v1/appointments/${id}`, data);
        return res.data;
    },

    deleteAppointment: async (id) => {
        await apiCall.delete(`/appointments/${id}`);
        get().fetchAppointments();
    },
}));
