import {useForm} from "react-hook-form";
import {useNavigate, useParams} from "@tanstack/react-router";
import {useRoleStore, useUserStore} from "@features/users-management/index.js";
import {useRegistrationInstitutionStore} from "@features/settings/index.js";
import {formatUserDataForForm} from "@shared/utils/index.js";
import {useImagePreview} from "@shared/hooks/index.js";
import {useEffect} from "react";

export const useUserForm = (opts) => {
    const {id} = useParams(opts);
    const isEditMode = !!id;

    const {showUser, userValue, updateUser, createUser} = useUserStore();
    const {fetchRoles, roleData} = useRoleStore();
    const {
        fetchInstitutions,
        fetchStrOptions,
        fetchSipOptions
    } = useRegistrationInstitutionStore();

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: {errors, isSubmitting}
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: formatUserDataForForm({})
    });

    const navigate = useNavigate();

    const {
        previewImage,
        previewSignature,
        handleFileChange,
        removeImage,
        setPreviewImage,
        setPreviewSignature
    } = useImagePreview(setValue);

    const selectedRoles = watch("roles") || [];
    const isDoctor = selectedRoles.includes("Dokter") || selectedRoles.includes("Perawat");

    useEffect(() => {
        const init = async () => {
            await Promise.all([
                fetchRoles(),
                fetchInstitutions({type: "str"}),
                fetchInstitutions({type: "sip"})
            ]);

            if (isEditMode) {
                await showUser(id);
            }
        };

        init();
    }, [id, isEditMode, fetchRoles, fetchInstitutions, showUser]);

    // Update form when user data is loaded
    useEffect(() => {
        if (isEditMode && userValue) {
            reset(formatUserDataForForm(userValue));

            if (userValue.profile_picture) {
                setPreviewImage(asset(userValue.profile_picture));
            }
            if (userValue.signature) {
                setPreviewSignature(userValue.signature);
            }
        }
    }, [userValue, isEditMode, reset, setPreviewImage, setPreviewSignature]);

    // Form submission
    const onSubmit = async (data) => {
        let formData = new FormData();

        const specialFields = ['roles', 'doctor_schedule', 'str_active_period', 'sip_active_period'];

        Object.keys(data).forEach(key => {
            if (!specialFields.includes(key) && data[key] !== null && data[key] !== undefined && data[key] !== '') {
                formData.append(key, data[key]);
            }
        });

        if (data.roles && Array.isArray(data.roles)) {
            data.roles.forEach(role => {
                formData.append('roles[]', role);
            });
        }

        if (data.doctor_schedule?.length) {
            data.doctor_schedule.forEach((s, i) => {
                formData.append(`doctor_schedule[${i}][day_of_week]`, s.day_of_week);
                formData.append(`doctor_schedule[${i}][start_time]`, s.start_time ?? '');
                formData.append(`doctor_schedule[${i}][end_time]`, s.end_time ?? '');
            });
        }

        if (data.str_active_period) {
            formData.append('str_active_period', format(data.str_active_period, "yyyy-MM-dd"));
        }

        if (data.sip_active_period) {
            formData.append('sip_active_period', format(data.sip_active_period, 'yyyy-MM-dd'));
        }

        let result;
        if (isEditMode) {
            result = await updateUser(id, formData);
        } else {
            result = await createUser(formData);
        }

        if (result?.success) {
            await navigate({to: "/settings/users-management"});
        }
    };
    const handleInstituteType = async (type) => {
        await fetchInstitutions({type});
    };


    return {
        //form
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        errors,
        isSubmitting,

        isEditMode,
        isDoctor,

        // Data
        userValue,
        roleData,

        // Image preview
        previewImage,
        previewSignature,
        handleFileChange,
        removeImage,

        // Actions
        onSubmit,
        handleInstituteType,

        // Navigation
        navigate,
    }
}