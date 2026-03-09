import {create} from "zustand";
import {toast} from "sonner";
import apiCall from "@/services/apiCall.js";

export const useOutpatientDashboardReportStore = create((set, get) => ({
    isLoading: false,
    patientTodayCount: {},
    currentPage: 1,
    success: false,
    todayPatientCountByStatus: {},
    fetchPatientVisitCount: async () => {
        try {
            const response = await apiCall.get('/api/v1/outpatient-dashboard-reports/today-patient-count',);
            set({patientTodayCount: response.data});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    fetchTodayPatientCountByStatus: async () => {
        try {
            const response = await apiCall.get(`/api/v1/outpatient-dashboard-reports/today-patient-count-by-status`,);
            set({todayPatientCountByStatus: response.data});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
}));