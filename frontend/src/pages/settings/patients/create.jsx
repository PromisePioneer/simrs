import Layout from "@/pages/dashboard/layout.jsx";
import ContentHeader from "@/components/ui/content-header.jsx";
import {Button} from "@/components/ui/button.jsx";
import {
    ArrowLeft,
    Save,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    CreditCard,
    BookUser,
} from "lucide-react";
import {Link, useParams} from "@tanstack/react-router";
import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.jsx";
import {usePatientStore} from "@/store/usePatientStore.js";
import {useTenantStore} from "@/store/useTenantStore.js";
import {useAuthStore} from "@/store/authStore.js";

function PatientForm(opts) {
    const {id} = useParams(opts);
    const isEditMode = !!id;


    const {createPatient, updatePatient} = usePatientStore();

    const {fetchTenants, tenants} = useTenantStore()
    const {userData} = useAuthStore();
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
        defaultValues: {
            full_name: '',
            medical_record_number: '',
            city_of_birth: '',
            date_of_birth: '',
            id_card_number: '',
            gender: '',
            religion: '',
            blood_type: '',
            job: '',
            kis_number: '',
            phone: '',
            email: '',
            date_of_consultation: '',
            profile_picture: null,
            payment_methods: [
                {
                    payment_method: '',
                    bpjs_number: ''
                }
            ],
            addresses: [
                {
                    address: '',
                    province: '',
                    city: '',
                    subdistrict: '',
                    ward: '',
                    postal_code: ''
                }
            ]
        }
    });

    // Image preview state
    const [previewImage, setPreviewImage] = useState(null);

    // Handle file change
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Set file to form
            setValue('profile_picture', file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove image
    const removeImage = () => {
        setValue('profile_picture', null);
        setPreviewImage(null);
    };

    // Generate auto medical record number
    useEffect(() => {

        if (!isEditMode) {
            const generateMedicalRecordNumber = () => {
                const timestamp = Date.now();
                const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                return `RM-${timestamp}${random}`;
            };
            setValue('medical_record_number', generateMedicalRecordNumber());
        }
    }, [isEditMode, setValue]);

    // Mock data
    const paymentMethodOptions = [
        {value: 'bpjs_kesehatan', label: 'BPJS Kesehatan'},
        {value: 'cash', label: 'Tunai'},
        {value: 'asuransi', label: 'Asuransi Swasta'},
        {value: 'perusahaan', label: 'Perusahaan'},
        {value: 'lainnya', label: 'Lainnya'}
    ];

    // Watch payment methods to show BPJS number field
    const paymentMethods = watch("payment_methods") || [];

    // Form submission
    const onSubmit = async (data) => {
        // Create FormData for file upload
        const formData = new FormData();

        // Append regular fields
        const fieldsToAppend = [
            'full_name', 'medical_record_number', 'city_of_birth',
            'date_of_birth', 'id_card_number', 'gender', 'religion',
            'blood_type', 'job', 'kis_number', 'phone', 'email',
            'date_of_consultation'
        ];

        fieldsToAppend.forEach(field => {
            if (data[field]) {
                formData.append(field, data[field]);
            }
        });

        // Append profile picture
        if (data.profile_picture instanceof File) {
            formData.append('profile_picture', data.profile_picture);
        }

        // Append payment methods array
        if (data.payment_methods && Array.isArray(data.payment_methods)) {
            data.payment_methods.forEach((method, index) => {
                if (method.payment_method) {
                    formData.append(`payment_methods[${index}][payment_method]`, method.payment_method);
                }
                if (method.bpjs_number) {
                    formData.append(`payment_methods[${index}][bpjs_number]`, method.bpjs_number);
                }
            });
        }

        // Append addresses array
        if (data.addresses && Array.isArray(data.addresses)) {
            data.addresses.forEach((address, index) => {
                Object.keys(address).forEach(key => {
                    if (address[key]) {
                        formData.append(`addresses[${index}][${key}]`, address[key]);
                    }
                });
            });
        }

        console.log('Form Data:', data);
        console.log('FormData entries:');
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }


        if (isEditMode) {
            await updatePatient(id, formData);
        } else {

            await createPatient(formData);
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <ContentHeader
                        title={isEditMode ? "Ubah Data Pasien" : "Tambah Pasien Baru"}
                        description={isEditMode ? "Ubah informasi pasien" : "Masukkan informasi lengkap pasien baru"}
                    />
                    <Link to="/master/patient">
                        <Button variant="outline" className="gap-2">
                            <ArrowLeft className="w-4 h-4"/>
                            Kembali ke Daftar
                        </Button>
                    </Link>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-6">
                        {/* Informasi Umum Pasien */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5"/>
                                    Informasi Umum Pasien
                                </CardTitle>
                                <CardDescription>Data identitas dan informasi dasar pasien</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Photo Upload */}
                                <div className="space-y-2">
                                    <Label>Foto Profil</Label>
                                    <div className="flex items-center gap-4">
                                        {previewImage ? (
                                            <div className="relative">
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                                                <User className="w-12 h-12 text-gray-400"/>
                                            </div>
                                        )}
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="max-w-xs"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Format: JPG, PNG. Max 2MB</p>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    {/* Full Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="full_name">
                                            Nama Lengkap <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="full_name"
                                            placeholder="Masukkan nama lengkap"
                                            {...register("full_name", {required: "Nama lengkap wajib diisi"})}
                                        />
                                        {errors.full_name && (
                                            <p className="text-sm text-destructive">{errors.full_name.message}</p>
                                        )}
                                    </div>

                                    {/* Medical Record Number */}
                                    <div className="space-y-2">
                                        <Label htmlFor="medical_record_number">
                                            No. Rekam Medis <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="relative">
                                            <BookUser className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                            <Input
                                                id="medical_record_number"
                                                placeholder="RM-001234"
                                                className="pl-9 bg-gray-50"
                                                disabled
                                                {...register("medical_record_number", {required: "Nomor rekam medis wajib diisi"})}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">Nomor rekam medis di-generate
                                            otomatis</p>
                                    </div>

                                    {/* ID Card Number (NIK) */}
                                    <div className="space-y-2">
                                        <Label htmlFor="id_card_number">
                                            NIK <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="relative">
                                            <CreditCard
                                                className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                            <Input
                                                id="id_card_number"
                                                placeholder="1234567890123456"
                                                maxLength={16}
                                                className="pl-9"
                                                {...register("id_card_number", {
                                                    required: "NIK wajib diisi",
                                                    minLength: {value: 16, message: "NIK harus 16 digit"},
                                                    maxLength: {value: 16, message: "NIK harus 16 digit"}
                                                })}
                                            />
                                        </div>
                                        {errors.id_card_number && (
                                            <p className="text-sm text-destructive">{errors.id_card_number.message}</p>
                                        )}
                                    </div>

                                    {/* City of Birth */}
                                    <div className="space-y-2">
                                        <Label htmlFor="city_of_birth">
                                            Tempat Lahir <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="city_of_birth"
                                            placeholder="Kota lahir"
                                            {...register("city_of_birth", {required: "Tempat lahir wajib diisi"})}
                                        />
                                        {errors.city_of_birth && (
                                            <p className="text-sm text-destructive">{errors.city_of_birth.message}</p>
                                        )}
                                    </div>

                                    {/* Date of Birth */}
                                    <div className="space-y-2">
                                        <Label htmlFor="date_of_birth">
                                            Tanggal Lahir <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                            <Input
                                                id="date_of_birth"
                                                type="date"
                                                className="pl-9"
                                                {...register("date_of_birth", {required: "Tanggal lahir wajib diisi"})}
                                            />
                                        </div>
                                        {errors.date_of_birth && (
                                            <p className="text-sm text-destructive">{errors.date_of_birth.message}</p>
                                        )}
                                    </div>

                                    {/* Gender */}
                                    <div className="space-y-2">
                                        <Label htmlFor="gender">
                                            Jenis Kelamin <span className="text-destructive">*</span>
                                        </Label>
                                        <Controller
                                            name="gender"
                                            control={control}
                                            rules={{required: "Jenis kelamin wajib dipilih"}}
                                            render={({field}) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih jenis kelamin"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pria">Pria</SelectItem>
                                                        <SelectItem value="wanita">Wanita</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.gender && (
                                            <p className="text-sm text-destructive">{errors.gender.message}</p>
                                        )}
                                    </div>

                                    {/* Religion */}
                                    <div className="space-y-2">
                                        <Label htmlFor="religion">
                                            Agama <span className="text-destructive">*</span>
                                        </Label>
                                        <Controller
                                            name="religion"
                                            control={control}
                                            rules={{required: "Agama wajib diisi"}}
                                            render={({field}) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih agama"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="islam">Islam</SelectItem>
                                                        <SelectItem value="protestan">Protestan</SelectItem>
                                                        <SelectItem value="katholik">Katholik</SelectItem>
                                                        <SelectItem value="hindu">Hindu</SelectItem>
                                                        <SelectItem value="budha">Budha</SelectItem>
                                                        <SelectItem value="konghucu">Konghucu</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.religion && (
                                            <p className="text-sm text-destructive">{errors.religion.message}</p>
                                        )}
                                    </div>

                                    {/* Blood Type */}
                                    <div className="space-y-2">
                                        <Label htmlFor="blood_type">
                                            Golongan Darah <span className="text-destructive">*</span>
                                        </Label>
                                        <Controller
                                            name="blood_type"
                                            control={control}
                                            rules={{required: "Golongan darah wajib diisi"}}
                                            render={({field}) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih golongan darah"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="a+">A+</SelectItem>
                                                        <SelectItem value="a-">A-</SelectItem>
                                                        <SelectItem value="b+">B+</SelectItem>
                                                        <SelectItem value="b-">B-</SelectItem>
                                                        <SelectItem value="ab+">AB+</SelectItem>
                                                        <SelectItem value="ab-">AB-</SelectItem>
                                                        <SelectItem value="o+">O+</SelectItem>
                                                        <SelectItem value="o-">O-</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.blood_type && (
                                            <p className="text-sm text-destructive">{errors.blood_type.message}</p>
                                        )}
                                    </div>

                                    {/* Job */}
                                    <div className="space-y-2">
                                        <Label htmlFor="job">
                                            Pekerjaan <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="job"
                                            placeholder="Masukkan pekerjaan"
                                            {...register("job", {required: "Pekerjaan wajib diisi"})}
                                        />
                                        {errors.job && (
                                            <p className="text-sm text-destructive">{errors.job.message}</p>
                                        )}
                                    </div>

                                    {/* KIS Number */}
                                    <div className="space-y-2">
                                        <Label htmlFor="kis_number">Nomor KIS</Label>
                                        <Input
                                            id="kis_number"
                                            placeholder="Masukkan nomor KIS"
                                            {...register("kis_number")}
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">
                                            Nomor Telepon <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="+62 812 3456 7890"
                                                className="pl-9"
                                                {...register("phone", {
                                                    required: "Nomor telepon wajib diisi",
                                                    pattern: {
                                                        value: /^(^\+62|62|0)(\d{9,13})$/,
                                                        message: "Format nomor HP tidak valid. Gunakan 08xxx atau +62xxx"
                                                    }
                                                })}
                                            />
                                        </div>
                                        {errors.phone && (
                                            <p className="text-sm text-destructive">{errors.phone.message}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            Email <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="pasien@example.com"
                                                className="pl-9"
                                                {...register("email", {
                                                    required: "Email wajib diisi",
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "Format email tidak valid"
                                                    }
                                                })}
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="text-sm text-destructive">{errors.email.message}</p>
                                        )}
                                    </div>

                                    {/* Date of Consultation */}
                                    <div className="space-y-2">
                                        <Label htmlFor="date_of_consultation">Tanggal Konsultasi</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                            <Input
                                                id="date_of_consultation"
                                                type="date"
                                                className="pl-9"
                                                {...register("date_of_consultation")}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Address Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5"/>
                                    Informasi Alamat
                                </CardTitle>
                                <CardDescription>Alamat lengkap dan domisili pasien</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Address */}
                                <div className="space-y-2">
                                    <Label htmlFor="addresses.0.address">
                                        Alamat Lengkap <span className="text-destructive">*</span>
                                    </Label>
                                    <Textarea
                                        id="addresses.0.address"
                                        placeholder="Masukkan alamat lengkap"
                                        className="min-h-[100px]"
                                        {...register("addresses.0.address", {required: "Alamat wajib diisi"})}
                                    />
                                    {errors.addresses?.[0]?.address && (
                                        <p className="text-sm text-destructive">{errors.addresses[0].address.message}</p>
                                    )}
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    {/* Province */}
                                    <div className="space-y-2">
                                        <Label htmlFor="addresses.0.province">
                                            Provinsi <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="addresses.0.province"
                                            placeholder="Provinsi"
                                            {...register("addresses.0.province", {required: "Provinsi wajib diisi"})}
                                        />
                                        {errors.addresses?.[0]?.province && (
                                            <p className="text-sm text-destructive">{errors.addresses[0].province.message}</p>
                                        )}
                                    </div>

                                    {/* City */}
                                    <div className="space-y-2">
                                        <Label htmlFor="addresses.0.city">
                                            Kota/Kabupaten <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="addresses.0.city"
                                            placeholder="Kota/Kabupaten"
                                            {...register("addresses.0.city", {required: "Kota wajib diisi"})}
                                        />
                                        {errors.addresses?.[0]?.city && (
                                            <p className="text-sm text-destructive">{errors.addresses[0].city.message}</p>
                                        )}
                                    </div>

                                    {/* Subdistrict */}
                                    <div className="space-y-2">
                                        <Label htmlFor="addresses.0.subdistrict">
                                            Kecamatan <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="addresses.0.subdistrict"
                                            placeholder="Kecamatan"
                                            {...register("addresses.0.subdistrict", {required: "Kecamatan wajib diisi"})}
                                        />
                                        {errors.addresses?.[0]?.subdistrict && (
                                            <p className="text-sm text-destructive">{errors.addresses[0].subdistrict.message}</p>
                                        )}
                                    </div>

                                    {/* Ward */}
                                    <div className="space-y-2">
                                        <Label htmlFor="addresses.0.ward">
                                            Kelurahan <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="addresses.0.ward"
                                            placeholder="Kelurahan"
                                            {...register("addresses.0.ward", {required: "Kelurahan wajib diisi"})}
                                        />
                                        {errors.addresses?.[0]?.ward && (
                                            <p className="text-sm text-destructive">{errors.addresses[0].ward.message}</p>
                                        )}
                                    </div>

                                    {/* Postal Code */}
                                    <div className="space-y-2">
                                        <Label htmlFor="addresses.0.postal_code">
                                            Kode Pos <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="addresses.0.postal_code"
                                            placeholder="12345"
                                            maxLength={5}
                                            {...register("addresses.0.postal_code", {required: "Kode pos wajib diisi"})}
                                        />
                                        {errors.addresses?.[0]?.postal_code && (
                                            <p className="text-sm text-destructive">{errors.addresses[0].postal_code.message}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Methods */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5"/>
                                    Metode Pembayaran
                                </CardTitle>
                                <CardDescription>Pilih metode pembayaran yang tersedia</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    {/* Payment Method */}
                                    <div className="space-y-2">
                                        <Label htmlFor="payment_methods.0.payment_method">
                                            Metode Pembayaran <span className="text-destructive">*</span>
                                        </Label>
                                        <Controller
                                            name="payment_methods.0.payment_method"
                                            control={control}
                                            rules={{required: "Metode pembayaran wajib dipilih"}}
                                            render={({field}) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih metode pembayaran"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {paymentMethodOptions.map((method) => (
                                                            <SelectItem key={method.value} value={method.value}>
                                                                {method.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.payment_methods?.[0]?.payment_method && (
                                            <p className="text-sm text-destructive">
                                                {errors.payment_methods[0].payment_method.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* BPJS Number - conditional */}
                                    {paymentMethods[0]?.payment_method === 'bpjs_kesehatan' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="payment_methods.0.bpjs_number">
                                                Nomor BPJS <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="payment_methods.0.bpjs_number"
                                                placeholder="Masukkan nomor BPJS"
                                                {...register("payment_methods.0.bpjs_number", {
                                                    required: paymentMethods[0]?.payment_method === 'bpjs_kesehatan'
                                                        ? "Nomor BPJS wajib diisi"
                                                        : false
                                                })}
                                            />
                                            {errors.payment_methods?.[0]?.bpjs_number && (
                                                <p className="text-sm text-destructive">
                                                    {errors.payment_methods[0].bpjs_number.message}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-4">
                            <Link to="/master/patient">
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
        </Layout>
    );
}

export default PatientForm;