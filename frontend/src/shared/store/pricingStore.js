// src/store/usePricing.js
import {create} from 'zustand';
import apiCall from '@shared/services/apiCall.js';
import {toast} from 'sonner';

export const usePricingStore = create((set, get) => ({
    isLoading: false,
    pricingData: null,
    activeSubscription: null,
    error: null,

    fetchPlans: async () => {
        if (get().pricingData) return;
        set({isLoading: true, error: null});
        try {
            // Tanpa per_page → backend return Collection (array langsung)
            // Dengan per_page → backend return paginated {data: [...]}
            // Pakai tanpa per_page supaya dapat semua plan sekaligus
            const response = await apiCall.get('/api/v1/subscriptions/plans');
            const raw = response.data;

            // Normalize: bisa array langsung atau paginated {data: [...]}
            const data = Array.isArray(raw) ? raw : (raw?.data ?? []);
            set({pricingData: {data}, isLoading: false});
        } catch (e) {
            set({error: e, isLoading: false});
        }
    },

    fetchActiveSubscription: async () => {
        try {
            const response = await apiCall.get('/api/v1/subscriptions/active');
            set({activeSubscription: response.data?.data ?? null});
            return response.data?.data ?? null;
        } catch {
            set({activeSubscription: null});
            return null;
        }
    },
}));