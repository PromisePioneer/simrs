import {create} from "zustand";
import apiCall from "@/services/apiCall.js";

export const useAuthStore = create((set, get) => ({
    loggedIn: false,
    loading: false,
    isLoading: true,
    error: null,
    userData: null,
    isEmailUnverified: false,

    register: async (formData) => {
        set({loading: true, error: null});
        try {
            await apiCall.get("/sanctum/csrf-cookie");
            await apiCall.post('/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
                phone: formData.phone,
                tenant_name: formData.tenant_name,
                tenant_type: formData.tenant_type
            });

            const userResponse = await apiCall.get("api/v1/me");

            set({
                loggedIn: true,
                userData: userResponse.data,
                loading: false,
                error: null,
                isEmailUnverified: userResponse.data.email_verified_at === null
            });

            return {success: true, data: userResponse.data};
        } catch (error) {
            const errorData = error.response?.data?.errors ||
                error.response?.data?.message ||
                "Pendaftaran gagal";

            set({loading: false, error: errorData, loggedIn: false});
            return {success: false, error: errorData};
        }
    },

    login: async (email, password) => {
        set({loading: true, error: null});
        try {
            await apiCall.get("/sanctum/csrf-cookie");
            await apiCall.post('/login', {email, password});
            const userResponse = await apiCall.get("api/v1/me");

            set({
                loggedIn: true,
                userData: userResponse.data,
                loading: false,
                error: null,
                isEmailUnverified: userResponse.data.email_verified_at === null
            });

            return {success: true, data: userResponse.data};
        } catch (error) {
            const errorData = error.response?.data?.errors ||
                error.response?.data?.message ||
                "Login gagal";

            set({loading: false, error: errorData, loggedIn: false});
            return {success: false, error: errorData};
        }
    },

    checkAuth: async () => {
        set({isLoading: true});
        try {
            const response = await apiCall.get("api/v1/me");

            set({
                loggedIn: true,
                userData: response.data,
                isLoading: false,
                isEmailUnverified: response.data.email_verified_at === null
            });

            return true;
        } catch (error) {
            set({
                loggedIn: false,
                userData: null,
                isLoading: false,
                isEmailUnverified: false
            });

            return false;
        }
    },

    logout: async () => {
        try {
            await apiCall.post('/logout');
            set({loggedIn: false, userData: null, error: null, isEmailUnverified: false});
        } catch (error) {
            console.error('Error logout:', error);
        }
    },

    clearError: () => set({error: null}),
}));