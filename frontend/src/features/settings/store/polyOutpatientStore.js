import {create} from "zustand/react";

export const usePolyOutPatientStore = create((set, get) => ({
    isLoading: false,
    error: null,
    polyOutPatientData: null,
    search: "",
    currentPage: 1,
}));