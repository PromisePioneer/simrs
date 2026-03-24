import { create } from "zustand";

export const useUIStore = create((set) => ({
    globalLoading: false,
    setGlobalLoading: (v) => set({ globalLoading: v }),
    globalError: null,
    setGlobalError: (msg) => set({ globalError: msg }),
}));

export const useLoadingStore = create((set) => ({
    loading: false,
    setLoading: (value) => set({ loading: value }),
}));
