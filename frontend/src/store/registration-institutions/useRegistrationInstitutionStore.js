import {create} from "zustand";
import apiCall from "@/services/apiCall.js";

export const useRegistrationInstitutionStore = create((set, get) => ({
    isLoading: false,
    error: null,
    institutionData: [],
    strData: [],
    sipData: [],
    search: "",
    roleValue: null,
    setSearch: (searchValue) => {
        set({search: searchValue});
    },
    fetchInstitutions: async ({page = 1, perPage = null, type = null} = {}) => {
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


            if (type) {
                params.type = type;
            }


            const response = await apiCall.get("/api/v1/registration-institutions", {
                params: params
            });


            if (type === "str") {
                set({
                    strData: response.data,
                    isLoading: false,
                    error: null
                })
            } else if (type === "sip") {
                set({
                    sipData: response.data,
                    isLoading: false,
                    error: null
                })
            } else {
                set({
                    institutionData: response.data,
                    isLoading: false,
                    error: null
                });
            }
        } catch (e) {
            set({
                error: e,
                isLoading: false
            });
        }
    }
}));