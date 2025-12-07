// store/useUserCreateStore.js
import { create } from "zustand";

export const useUserCreateStore = create((set, get) => ({
    // Form data
    formData: {
        name: '',
        email: '',
        password: '',
        str_institution_id: '',
        str_registration_number: '',
        str_active_period: null,
        sip_institution_id: '',
        sip_registration_number: '',
        sip_active_period: null,
        phone: '',
        address: '',
        signature: null,
        profile_picture: null,
        email_verified_at: null,
        role_id: '',
    },

    // Preview states
    previewImage: null,
    previewSignature: null,

    // Actions
    setField: (name, value) => set((state) => ({
        formData: {
            ...state.formData,
            [name]: value,
        }
    })),

    setMultipleFields: (fields) => set((state) => ({
        formData: {
            ...state.formData,
            ...fields,
        }
    })),

    setPreviewImage: (image) => set({ previewImage: image }),
    setPreviewSignature: (signature) => set({ previewSignature: signature }),

    handleFileChange: (file, type) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            if (type === "profile_picture") {
                set({ previewImage: reader.result });
            } else if (type === "signature") {
                set({ previewSignature: reader.result });
            }

            get().setField(type, file);
        };

        reader.readAsDataURL(file);
    },

    removeImage: (type) => {
        get().setField(type, null);

        if (type === "profile_picture") {
            set({ previewImage: null });
        } else if (type === "signature") {
            set({ previewSignature: null });
        }
    },

    resetForm: () => set({
        formData: {
            name: '',
            email: '',
            password: '',
            str_institution_id: '',
            str_registration_number: '',
            str_active_period: null,
            sip_institution_id: '',
            sip_registration_number: '',
            sip_active_period: null,
            phone: '',
            address: '',
            signature: null,
            profile_picture: null,
            email_verified_at: null,
            role_id: '',
        },
        previewImage: null,
        previewSignature: null,
    }),
}));