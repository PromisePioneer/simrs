import ContentHeader from "@shared/components/ui/content-header.jsx";
import {Button} from "@shared/components/ui/button.jsx";
import {ArrowLeft, Save} from "lucide-react";
import {Link} from "@tanstack/react-router";
import UserGeneralInfoSection from "@features/users-management/pages/users/components/form/general-info.jsx";
import UserSTRInfoSection from "@features/users-management/pages/users/components/form/str-info.jsx";
import UserSIPInfoSection from "@features/users-management/pages/users/components/form/sip-info.jsx";
import UserMediaSection from "@features/users-management/pages/users/components/form/media.jsx";
import SettingPage from "@features/settings/pages/index.jsx";
import UserDoctorScheduleSection from "@features/users-management/pages/users/components/form/doctor-schedule.jsx";
import {useUserForm} from "@features/users-management/hooks/user/useUserForm.js";

function UserForm(opts) {
    const form = useUserForm(opts);

    return (
        <SettingPage>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <ContentHeader
                        title={form.isEditMode ? `Ubah Pengguna ` : "Tambah Pengguna Baru"}
                        description={form.isEditMode ? "Ubah Pengguna" : "Tambahkan pengguna baru ke sistem"}
                    />
                    <Link to="/settings/users-management">
                        <Button variant="outline" className="gap-2">
                            <ArrowLeft className="w-4 h-4"/>
                            Back to List
                        </Button>
                    </Link>
                </div>

                {/* Form */}
                <form onSubmit={form.handleSubmit(form.onSubmit)}>
                    <div className="grid gap-6">
                        <UserGeneralInfoSection
                            register={form.register}
                            control={form.control}
                            errors={form.errors}
                            isEditMode={form.isEditMode}
                            roleData={
                                Array.isArray(form.roleData)
                                    ? form.roleData
                                    : Array.isArray(form.roleData?.data)
                                        ? form.roleData.data
                                        : []
                            }
                        />


                        <UserDoctorScheduleSection
                            control={form.control}
                            register={form.register}
                            setValue={form.setValue}
                            errors={form.errors}
                            isDoctor={form.isDoctor}
                        />

                        <UserSTRInfoSection
                            register={form.register}
                            control={form.control}
                            errors={form.errors}
                            isDoctor={form.isDoctor}
                            userValue={form.userValue}
                            fetchStrOptions={form.fetchStrOptions}
                            handleInstituteType={form.handleInstituteType}
                        />

                        <UserSIPInfoSection
                            register={form.register}
                            control={form.control}
                            errors={form.errors}
                            isDoctor={form.isDoctor}
                            userValue={form.userValue}
                            fetchSipOptions={form.fetchSipOptions}
                            handleInstituteType={form.handleInstituteType}
                        />

                        <UserMediaSection
                            previewImage={form.previewImage}
                            previewSignature={form.previewSignature}
                            handleFileChange={form.handleFileChange}
                            removeImage={form.removeImage}
                        />

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4">
                            <Link to="/settings/users-management">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" className="gap-2" disabled={form.isSubmitting}>
                                <Save className="w-4 h-4"/>
                                {form.isSubmitting ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </SettingPage>
    );
}

export default UserForm;