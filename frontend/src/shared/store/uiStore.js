import {create} from "zustand/react";


export const useUIStore = create((set) => ({
    globalLoading: false,
    setGlobalLoading: ((v) => set({globalLoading: v})),
    globalError: null,
    setGlobalError: (msg) => set({globalError: msg})
}));