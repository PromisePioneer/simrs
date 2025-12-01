import {create} from "zustand";
import apiCall from "@/services/apiCall.js";

export const useAuthStore = create((set, get) => ({
    loggedIn: !!sessionStorage.getItem("loggedIn"),
    loading: false,
    isLoading: false,
    error: null,
    userData: null,
    authError: null,
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

            // Fetch user data after successful registration
            const userResponse = await apiCall.get("api/v1/me");
            sessionStorage.setItem("loggedIn", "true");

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

            set({
                loading: false,
                error: errorData,
                loggedIn: false,
                isEmailUnverified: false
            });

            return {success: false, error: errorData};
        }
    },

    login: async (email, password) => {
        set({loading: true, error: null});
        try {
            await apiCall.get("/sanctum/csrf-cookie");
            await apiCall.post('/login', {email, password});
            const userResponse = await apiCall.get("api/v1/me");
            sessionStorage.setItem("loggedIn", "true");

            set({
                loggedIn: true,
                userData: userResponse.data,
                loading: false,
                error: null,
                isEmailUnverified: userResponse.data.email_verified_at === null
            });

            return {success: true, data: userResponse.data};
        } catch (error) {
            const errorData = error.response?.data?.errors || error.response?.data?.message || "Login gagal";

            set({
                loading: false, error: errorData, loggedIn: false, isEmailUnverified: false
            });
            return {success: false, error: errorData};
        }
    },

    fetchUser: async () => {
        set({isLoading: true});
        try {
            const response = await apiCall.get('api/v1/me');
            set({
                userData: response.data,
                isLoading: false,
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            if (error.response?.status === 409) {
                console.log('Email unverified detected');
                set({
                    userData: null, isLoading: false, isEmailUnverified: true
                });
                return null;
            }

            set({
                userData: null, isLoading: false, isEmailUnverified: false
            });
            return null;
        }
    },

    checkAuth: async () => {
        const isLoggedIn = !!sessionStorage.getItem("loggedIn");
        set({loggedIn: isLoggedIn});

        if (isLoggedIn) {
            await get().fetchUser();
        }

        return isLoggedIn;
    },

    logout: async () => {
        try {
            await apiCall.post('/logout');
            sessionStorage.removeItem("loggedIn");
            set({
                loggedIn: false, userData: null, error: null, isEmailUnverified: false
            });
        } catch (error) {
            console.error('Error logout:', error);
        }
    },

    clearError: () => set({error: null}),
}));