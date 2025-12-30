import Layout from "@/pages/dashboard/layout.jsx";
import ContentHeader from "@/components/ui/content-header.jsx";
import {Button} from "@/components/ui/button.jsx";
import {ArrowLeft, Save, User} from "lucide-react";
import {Link, useNavigate, useParams} from "@tanstack/react-router";
import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {usePatientStore} from "@/store/usePatientStore.js";
import {useTenantStore} from "@/store/useTenantStore.js";
import {useAuthStore} from "@/store/authStore.js";
import PatientGeneralInfoSection from "@/components/patient/form-sections/general-info.jsx";
import PatientAddressInfo from "@/components/patient/form-sections/address-info.jsx";
import PatientPaymentMethod from "@/components/patient/form-sections/payment-method.jsx";
import {format} from "date-fns";
import {usePaymentMethodStore} from "@/store/usePaymentMethodStore.js";
import SettingPage from "@/pages/settings/index.jsx";
import {useImagePreview} from "@/hooks/useImagePreview.js";
import {asset} from "@/services/apiCall.js";

const formatPatientDataForForm = (patientData) => ({
    tenant_id: patientData.tenant_id || '',
    full_name: patientData.full_name || '',
    medical_record_number: patientData.medical_record_number || '',
    city_of_birth: patientData.city_of_birth || '',
    date_of_birth: patientData.date_of_birth ? new Date(patientData.date_of_birth) : null,
    id_card_number: patientData.id_card_number || '',
    gender: patientData.gender || '',
    religion: patientData.religion || '',
    blood_type: patientData.blood_type || '',
    job: patientData.job || '',
    kis_number: patientData.kis_number || '',
    phone: patientData.phone || '',
    email: patientData.email || '',
    date_of_consultation: patientData.date_of_consultation ? new Date(patientData.date_of_consultation) : null,
    profile_picture: patientData.profile_picture || null,
    payment_methods: patientData.payment_methods?.length > 0 ? patientData.payment_methods : [{
        payment_method_type_id: '',
        bpjs_number: ''
    }],
    addresses: patientData.addresses?.length > 0 ? patientData.addresses : [{
        address: '',
        province: '',
        city: '',
        subdistrict: '',
        ward: '',
        postal_code: ''
    }]
});

function PatientForm(opts) {
    const {id} = useParams(opts);
    const isEditMode = !!id;
    const navigate = useNavigate();


    const {
        createPatient,
        updatePatient,
        showPatient,
        patientValue,
    } = usePatientStore();
    const {fetchTenants, tenants} = useTenantStore();
    const {userData} = useAuthStore();
    const {fetchPaymentMethodType, paymentMethodTypes} = usePaymentMethodStore();

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
        defaultValues: {
            tenant_id: '',
            full_name: '',
            medical_record_number: '',
            city_of_birth: '',
            date_of_birth: null,
            id_card_number: '',
            gender: '',
            religion: '',
            blood_type: '',
            job: '',
            kis_number: '',
            phone: '',
            email: '',
            date_of_consultation: null,
            profile_picture: null,
            payment_methods: [{
                payment_method_type_id: '',
                bpjs_number: ''
            }],
            addresses: [{
                address: '',
                province: '',
                city: '',
                subdistrict: '',
                ward: '',
                postal_code: ''
            }]
        }
    });

    const {
        previewImage,
        handleFileChange,
        removeImage,
        setPreviewImage,
    } = useImagePreview(setValue);

    useEffect(() => {
        const init = async () => {
            await Promise.all([
                fetchTenants(),
                fetchPaymentMethodType()
            ]);

            if (isEditMode && patientValue) {
                await showPatient(id);
                if (patientValue.profile_picture) {
                    setPreviewImage(asset(patientValue.profile_picture));
                }
            } else {
                const generateMedicalRecordNumber = () => {
                    const timestamp = Date.now();
                    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                    return `RM-${timestamp}${random}`;
                };
                setValue('medical_record_number', generateMedicalRecordNumber());
            }
        };
        init();
    }, [id, isEditMode, fetchTenants, fetchPaymentMethodType, showPatient, setValue]);

    useEffect(() => {
        return () => {
            if (!isEditMode) {
                setPreviewImage(null);
            }
        };
    }, [isEditMode, setPreviewImage]);


    const onSubmit = async (data) => {
        const formData = new FormData();
        const specialFields = [
            'profile_picture',
            'payment_methods',
            'addresses',
            'date_of_birth',
            'date_of_consultation'
        ];


        Object.keys(data).forEach(key => {
            if (!specialFields.includes(key) && data[key]) {
                formData.append(key, data[key]);
            }
        });

        if (data.date_of_birth) {
            formData.append('date_of_birth', format(data.date_of_birth, "yyyy-MM-dd"));
        }
        if (data.date_of_consultation) {
            formData.append('date_of_consultation', format(data.date_of_consultation, "yyyy-MM-dd"));
        }

        if (data.profile_picture instanceof File) {
            formData.append('profile_picture', data.profile_picture);
        }

        if (data.payment_methods?.length) {
            data.payment_methods.forEach((method, index) => {
                if (method.payment_method_type_id) {
                    formData.append(`payment_methods[${index}][payment_method_type_id]`, method.payment_method_type_id);
                }
                if (method.bpjs_number) {
                    formData.append(`payment_methods[${index}][bpjs_number]`, method.bpjs_number);
                }
            });
        }

        if (data.addresses?.length) {
            data.addresses.forEach((address, index) => {
                Object.keys(address).forEach(key => {
                    if (address[key]) {
                        formData.append(`addresses[${index}][${key}]`, address[key]);
                    }
                });
            });
        }

        try {
            if (isEditMode) {
                await updatePatient(id, formData);
            } else {
                await createPatient(formData);
            }

            await navigate({to: "/settings/patients"});
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <SettingPage>
            <div className="space-y-6">
                <ContentHeader
                    title={isEditMode ? "Edit Pasien" : "Tambah Pasien Baru"}
                    description={isEditMode ? "Perbarui informasi pasien" : "Tambahkan pasien baru ke sistem"}
                />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <Link to="/settings/patients">
                                <Button type="button" variant="outline" size="sm" className="gap-2">
                                    <ArrowLeft className="w-4 h-4"/>
                                    Kembali ke Daftar
                                </Button>
                            </Link>
                        </div>

                        <PatientGeneralInfoSection
                            register={register}
                            control={control}
                            errors={errors}
                            previewImage={previewImage}
                            handleFileChange={handleFileChange}
                            userData={userData}
                            tenants={tenants}
                            removeImage={removeImage}
                            isEditMode={isEditMode}
                        />

                        <PatientAddressInfo
                            register={register}
                            control={control}
                            errors={errors}
                            isEditMode={isEditMode}
                        />

                        <PatientPaymentMethod
                            register={register}
                            control={control}
                            errors={errors}
                            paymentMethodTypes={paymentMethodTypes}
                            watch={watch}
                        />


                        <div className="flex justify-end gap-4">
                            <Link to="/settings/patients">
                                <Button type="button" variant="outline">
                                    Batal
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

export default PatientForm;