import { create } from "zustand";
import apiCall from "@/shared/services/apiCall.js";
import { toast } from "sonner";

export const useDiagnoseStore = create(() => ({
    isLoading: false,
    error: null,

    createDiagnose: async (data, visitId) => {
        try {
            await apiCall.post(`/api/v1/diagnoses/${visitId}`, data);
            toast.success("Data berhasil disimpan.");
            return true;
        } catch (e) {
            toast.error(e.response?.data?.message || "Operasi Gagal");
            return false;
        }
    },
}));
