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
import {getDefaultFormValues} from "@/utils/user/formUtils.js";
import {useImagePreview} from "@/hooks/useImagePreview.js";
import {useUserFormDataSync} from "@/hooks/user/useUserFormDataSync.js";

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
        formState: {errors, isSubmitting}
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: getDefaultFormValues()
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

    // Initialize data
    useEffect(() => {
        const init = async () => {
            await Promise.all([
                fetchInstitutions({type: "str"}),
                fetchInstitutions({type: "sip"}),
                fetchRoles()
            ]);
            if (isEditMode) {
                await showUser(id);
            }
        };
        init();
    }, [id]);

    useUserFormDataSync(userValue, reset, setPreviewImage, setPreviewSignature);

    // Form submission
    const onSubmit = async (data) => {
        if (isEditMode) {
            await handleEdit(id, data);
        } else {
            await handleCreate(data);
        }
    };

    const handleInstituteType = async (type) => {
        await fetchInstitutions({type});
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <ContentHeader
                        title={isEditMode ? "Ubah Pengguna" : "Tambah Pengguna Baru"}
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
                            roleData={roleData}
                        />

                        <UserSTRInfoSection
                            register={register}
                            control={control}
                            errors={errors}
                            isDoctor={isDoctor}
                            strData={strData}
                            handleInstituteType={handleInstituteType}
                        />

                        <UserSIPInfoSection
                            register={register}
                            control={control}
                            errors={errors}
                            isDoctor={isDoctor}
                            sipData={sipData}
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
                            <Link to="/master/user">
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
        </Layout>
    );
}

export default UserForm;
