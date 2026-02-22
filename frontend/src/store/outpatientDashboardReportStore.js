import {create} from "zustand";
import {toast} from "sonner";
import apiCall from "@/services/apiCall.js";

export const useOutpatientDashboardReportStore = create((set, get) => ({
    isLoading: false,
    openDeleteModal: false,
    patientTodayCount: 0,
    currentPage: 1,
    success: false,
    patientWaitingCount: 0,
    patientInProgressCount: 0,
    patientCompletedCount: 0,
    fetchPatientVisitCount: async () => {
        try {
            const response = await apiCall.get('/api/v1/outpatient-visit-dashboard-reports/today-patient-count',);
            set({patientTodayCount: response.data});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
    fetchTodayPatientCountByStatus: async ({status = 'waiting'}) => {
        try {
            const response = await apiCall.get(`/api/v1/outpatient-visit-dashboard-reports/today-patient-count?status=${status}`,);


            if (status === 'waiting') set({
                patientWaitingCount: response.data,
            })
            set({TodayPatientCountByStatus: response.data});
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
}));