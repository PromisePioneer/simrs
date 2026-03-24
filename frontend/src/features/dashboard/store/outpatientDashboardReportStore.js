import { create } from "zustand";
import { toast } from "sonner";
import apiCall from "@/shared/services/apiCall.js";

export const useOutpatientDashboardReportStore = create((set) => ({
    isLoading: false,
    patientTodayCount: {},
    todayPatientCountByStatus: {},

    fetchPatientVisitCount: async () => {
        try {
            const response = await apiCall.get(
                "/api/v1/outpatient-dashboard-reports/today-patient-count"
            );
            set({ patientTodayCount: response.data });
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },

    fetchTodayPatientCountByStatus: async () => {
        try {
            const response = await apiCall.get(
                "/api/v1/outpatient-dashboard-reports/today-patient-count-by-status"
            );
            set({ todayPatientCountByStatus: response.data });
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
}));
