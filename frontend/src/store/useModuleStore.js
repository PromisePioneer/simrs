import {create} from "zustand";
import apiCall from "@/services/apiCall.js";

export const useModuleStore = create((set, get) => ({
    isLoading: false,
    error: null,
    moduleData: null,
    search: "",

    setSearch: (searchValue) => {
        set({search: searchValue});
    },

    fetchModules: async ({page = 1, perPage = null} = {}) => {
        set({isLoading: true, error: null});
        try {
            const {search} = get();

            const params = {
                page: page,
            };

            if (perPage) {
                params.per_page = perPage;
            }

            if (search && search.trim() !== "") {
                params.search = search;
            }

            const response = await apiCall.get("/api/v1/modules", {
                params: params
            });

            set({
                moduleData: response.data,
                isLoading: false,
                error: null
            });
        } catch (e) {
            set({
                error: e,
                isLoading: false
            });
        }
    },

    updateModules: async (updatedModules) => {
        set({isLoading: true, error: null});
        try {
            const response = await apiCall.put("/api/v1/modules/updated-module", {
                modules: updatedModules
            });

            set({
                moduleData: response.data,
                isLoading: false,
                error: null
            });

            return response.data;
        } catch (e) {
            set({
                error: e,
                isLoading: false
            });
            throw e;
        }
    },
}));