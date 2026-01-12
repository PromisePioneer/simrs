import Layout from "@/pages/dashboard/layout.jsx";
import ContentHeader from "@/components/ui/content-header.jsx";
import {Button} from "@/components/ui/button.jsx";
import {ArrowLeft, Save} from "lucide-react";
import {Link, useParams} from "@tanstack/react-router";
import {useEffect} from "react";
import {useForm} from "react-hook-form";

import {useRoleStore} from "@/store/useRoleStore.js";
import {useUserCrud} from "@/hooks/useUserCrud.js";
import {useRegistrationInstitutionStore} from "@/store/registration-institutions/useRegistrationInstitutionStore.js";
import {useUserStore} from "@/store/user/useUserStore.js";

import UserGeneralInfoSection from "@/components/user/form-sections/general-info.jsx";
import UserSTRInfoSection from "@/components/user/form-sections/str-info.jsx";
import UserSIPInfoSection from "@/components/user/form-sections/sip-info.jsx";
import UserMediaSection from "@/components/user/form-sections/media.jsx";
import {useImagePreview} from "@/hooks/useImagePreview.js";
import {asset} from "@/services/apiCall.js";
import SettingPage from "@/pages/settings/index.jsx";

// Helper function to format user data for form
const formatUserDataForForm = (userData) => ({
    name: userData.name || '',
    email: userData.email || '',
    password: userData.password || '',
    phone: userData.phone || '',
    address: userData.address || '',
    str_institution_id: userData.str_institution_id || '',
    str_registration_number: userData.str_registration_number || '',
    str_active_period: userData.str_active_period ? new Date(userData.str_active_period) : null,
    sip_institution_id: userData.sip_institution_id || '',
    sip_registration_number: userData.sip_registration_number || '',
    sip_active_period: userData.sip_active_period ? new Date(userData.sip_active_period) : null,
    roles: userData.roles?.map(r => r.name) || [],
    signature: userData.signature || null,
    profile_picture: userData.profile_picture || null,
});

function UserForm(opts) {
    const {id} = useParams(opts);
    const isEditMode = !!id;

    // Store hooks
    const {showUser, userValue} = useUserStore();
    const {fetchRoles, roleData} = useRoleStore();
    const {fetchInstitutions, strData, sipData} = useRegistrationInstitutionStore();
    const {handleCreate, handleEdit} = useUserCrud();

    // Form setup
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        getValues,
        formState: {errors, isSubmitting}
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: formatUserDataForForm({})
    });

    // Custom hooks for image preview
    const {
        previewImage,
        previewSignature,
        handleFileChange,
        removeImage,
        setPreviewImage,
        setPreviewSignature
    } = useImagePreview(setValue);

    // Watch form values
    const selectedRoles = watch("roles") || [];
    const isDoctor = selectedRoles.includes("Dokter") || selectedRoles.includes("Perawat");

    // Initialize data - Fetch roles first
    useEffect(() => {
        const init = async () => {
            // Fetch roles and institutions in parallel
            await Promise.all([
                fetchRoles(),
                fetchInstitutions({type: "str"}),
                fetchInstitutions({type: "sip"})
            ]);

            // Then fetch user data if in edit mode
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

        const specialFields = ['roles'];
        Object.keys(data).forEach(key => {
            if (!specialFields.includes(key) && data[key]) {
                formData.append(key, data[key]);
            }
        });

        if (data.roles && Array.isArray(data.roles)) {
            data.roles.forEach(role => {
                formData.append('roles[]', role);
            });
        }

        if (isEditMode) {
            await handleEdit(id, formData);
        } else {
            await handleCreate(formData);
        }
    };

    const handleInstituteType = async (type) => {
        await fetchInstitutions({type});
    };

    return (
        <SettingPage>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <ContentHeader
                        title={isEditMode ? `Ubah Pengguna ` : "Tambah Pengguna Baru"}
                        description={isEditMode ? "Ubah Pengguna" : "Tambahkan pengguna baru ke sistem"}
                    />
                    <Link to="/master/user">
                        <Button variant="outline" className="gap-2">
                            <ArrowLeft className="w-4 h-4"/>
                            Back to List
                        </Button>
                    </Link>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-6">
                        <UserGeneralInfoSection
                            register={register}
                            control={control}
                            errors={errors}
                            isEditMode={isEditMode}
                            roleData={
                                Array.isArray(roleData)
                                    ? roleData
                                    : Array.isArray(roleData?.data)
                                        ? roleData.data
                                        : []
                            }
                        />

                        <UserSTRInfoSection
                            register={register}
                            control={control}
                            errors={errors}
                            isDoctor={isDoctor}
                            strData={strData || []}
                            handleInstituteType={handleInstituteType}
                        />

                        <UserSIPInfoSection
                            register={register}
                            control={control}
                            errors={errors}
                            isDoctor={isDoctor}
                            sipData={sipData || []}
                            handleInstituteType={handleInstituteType}
                        />

                        <UserMediaSection
                            previewImage={previewImage}
                            previewSignature={previewSignature}
                            handleFileChange={handleFileChange}
                            removeImage={removeImage}
                        />

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4">
                            <Link to="settings/users-management">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" className="gap-2" disabled={isSubmitting}>
                                <Save className="w-4 h-4"/>
                                {isSubmitting ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </SettingPage>
    );
}

export default UserForm;