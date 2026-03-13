import {create} from "zustand";
import apiCall from "@/services/apiCall.js";


export const useBedStore = create((set, get) => ({
    isLoading: false,
    beds: [],
    fetchBedOptions: async (search, status = 'available') => {
        const res = await apiCall.get("/api/v1/facilities/beds", {
            params: {search, status}
        });
        const data = res.data ?? [];

        console.log(data);
        return data.map(b => ({
            value: b.id,
            label: `${b.bed_number} - ${b.room.name}`
        }));
    },
}));