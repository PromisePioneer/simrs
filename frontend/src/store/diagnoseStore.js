import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";


export const useDiagnoseStore = create((set, get) => ({
    isLoading: false,
    error: null,
    medicineBatches: null,
    createDiagnose: async (data, visitId) => {
        try {
            await apiCall.post(`/api/v1/diagnoses/${visitId}`, data);
            toast.success("Berhasil menambahkan batch baru.");
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
        }
    },
}));