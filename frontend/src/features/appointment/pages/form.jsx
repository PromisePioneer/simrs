import {useState} from "react";
import {useNavigate, Link} from "@tanstack/react-router";
import Layout from "@features/dashboard/pages/layout.jsx";
import {useAppointmentStore} from "@features/appointment";
import {usePatientStore} from "@features/patients";
import {Button} from "@shared/components/ui/button.jsx";
import {Input} from "@shared/components/ui/input.jsx";
import {Label} from "@shared/components/ui/label.jsx";
import {Textarea} from "@shared/components/ui/textarea.jsx";
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@shared/components/ui/card.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@shared/components/ui/select.jsx";
import {ArrowLeft, Save, Loader2, User, UserPlus, Search} from "lucide-react";
import {toast} from "sonner";
import {AsyncSelect} from "@shared/components/common/async-select.jsx";
import {Controller, useForm} from "react-hook-form";
import {
    CalendarIcon,
    Upload,
    X,
} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@shared/components/ui/popover.jsx";
import {cn} from "@shared/lib/utils";
import {Calendar} from "@shared/components/ui/calendar.jsx";
import {format} from "date-fns";
import {Avatar, AvatarFallback, AvatarImage} from "@shared/components/ui/avatar.jsx";
import ContentHeader from "@shared/components/ui/content-header.jsx";

// ── Helpers ──────────────────────────────────────────────────────────────────
const generateVisitNumber = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const seq = String(Math.floor(Math.random() * 999999) + 1).padStart(6, "0");
    return `${yyyy}/${mm}/${dd}/${seq}`;
};

const nowDateTimeLocal = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
};

// ── Initial visit state ───────────────────────────────────────────────────────
const initialVisit = {
    visit_number: generateVisitNumber(),
    date: nowDateTimeLocal(),
    advanced_status: "outpatient",
    registration_status: "new",
    guarantor_name: "",
    guarantor_address: "",
    guarantor_relationship: "",
    registration_fee: "",
};

// ── Initial new patient form values ──────────────────────────────────────────
const initialNewPatient = {
    full_name: "",
    id_card_number: "",
    city_of_birth: "",
    date_of_birth: null,
    gender: "",
    religion: "",
    blood_type: "",
    job: "",
    kis_number: "",
    phone: "",
    email: "",
    date_of_consultation: null,
};

// ── Component ─────────────────────────────────────────────────────────────────
function AppointmentFormPage() {
    const navigate = useNavigate();
    const {createAppointment} = useAppointmentStore();
    const {fetchPatientOptions, createPatient} = usePatientStore();

    // Visit-level state
    const [visit, setVisit] = useState(initialVisit);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [patientMode, setPatientMode] = useState("new");

    const [selectedPatientId, setSelectedPatientId] = useState("");

    const {
        register,
        control,
        handleSubmit: handlePatientSubmit,
        formState: {errors},
        setValue,
        watch,
    } = useForm({defaultValues: initialNewPatient});

    // Profile picture preview for new patient
    const [previewImage, setPreviewImage] = useState(null);
    const [profilePictureFile, setProfilePictureFile] = useState(null);

    const setVisitField = (key, value) => setVisit((prev) => ({...prev, [key]: value}));

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setProfilePictureFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setPreviewImage(null);
        setProfilePictureFile(null);
    };

    // Build FormData for new patient
    const buildPatientFormData = (data) => {
        const fd = new FormData();
        Object.entries(data).forEach(([k, v]) => {
            if (v === null || v === undefined) return;
            if (k === "date_of_birth" || k === "date_of_consultation") {
                fd.append(k, v ? format(v, "yyyy-MM-dd") : "");
            } else {
                fd.append(k, v);
            }
        });
        if (profilePictureFile) fd.append("profile_picture", profilePictureFile);
        return fd;
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();

        if (patientMode === "old" && !selectedPatientId) {
            toast.error("Pasien wajib dipilih.");
            return;
        }

        setIsSubmitting(true);
        try {
            let patientId = selectedPatientId;

            // If new patient → create patient first, get id
            if (patientMode === "new") {
                await handlePatientSubmit(async (patientData) => {
                    const fd = buildPatientFormData(patientData);
                    const created = await createPatient(fd);
                    patientId = created?.data?.id ?? created?.id;
                })();

                if (!patientId) {
                    // createPatient threw — toast already shown inside store
                    setIsSubmitting(false);
                    return;
                }
            }

            await createAppointment({
                ...visit,
                patient_id: patientId,
                registration_fee: visit.registration_fee ? Number(visit.registration_fee) : null,
            });
            toast.success("Pendaftaran berhasil dibuat.");
            navigate({to: "/appointments"});
        } catch (err) {
            const msg = err?.response?.data?.message || "Gagal membuat pendaftaran.";
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <ContentHeader
                        title="Formulir Registrasi"
                        description="Isi data pendaftaran pasien"
                    />
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Link to="/appointments">
                            <Button type="button" variant="outline" size="sm" className="gap-2">
                                <ArrowLeft/>
                                Kembali ke Daftar Janji Temu
                            </Button>
                        </Link>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Info Kunjungan</CardTitle>
                            <CardDescription>Data registrasi kunjungan pasien</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            {/* No. Kunjungan */}
                            <div className="space-y-1.5">
                                <Label htmlFor="visit_number">
                                    No. Kunjungan
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="visit_number"
                                    value={visit.visit_number}
                                    onChange={(e) => setVisitField("visit_number", e.target.value)}
                                    className="font-mono"
                                    placeholder="YYYY/MM/DD/XXXXXX"
                                    required
                                />
                            </div>

                            {/* Tanggal & Jam */}
                            <div className="space-y-1.5">
                                <Label htmlFor="date">
                                    Tanggal & Jam Kunjungan
                                    <span className="text-destructive">*</span>

                                </Label>
                                <Input
                                    id="date"
                                    type="datetime-local"
                                    value={visit.date}
                                    onChange={(e) => setVisitField("date", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Jenis Kunjungan */}
                                <div className="space-y-1.5">
                                    <Label>
                                        Jenis Kunjungan
                                        <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={visit.advanced_status}
                                        onValueChange={(v) => setVisitField("advanced_status", v)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="outpatient">Rawat Jalan (Ralan)</SelectItem>
                                            <SelectItem value="inpatient">Rawat Inap (Ranap)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Status Daftar */}
                                <div className="space-y-1.5">
                                    <Label>
                                        Status Daftar
                                        <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={visit.registration_status}
                                        onValueChange={(v) => {
                                            setVisitField("registration_status", v);
                                            // Switch patient input mode based on registration status
                                            if (v === "new") {
                                                setPatientMode("new");
                                                setSelectedPatientId("");
                                            } else if (v === "old") {
                                                setPatientMode("old");
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">Baru</SelectItem>
                                            <SelectItem value="old">Lama</SelectItem>
                                            <SelectItem value="-">—</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    {/* ── Data Pasien ────────────────────────────────────── */}
                    {visit.registration_status === "-" && (
                        <div className="flex rounded-lg border p-1 gap-1 bg-muted w-fit">
                            <button
                                type="button"
                                onClick={() => setPatientMode("new")}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                                    patientMode === "new"
                                        ? "bg-background shadow-sm text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <UserPlus className="w-4 h-4"/>
                                Pasien Baru
                            </button>
                            <button
                                type="button"
                                onClick={() => setPatientMode("old")}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                                    patientMode === "old"
                                        ? "bg-background shadow-sm text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Search className="w-4 h-4"/>
                                Pasien Lama
                            </button>
                        </div>
                    )}

                    {/* ── OLD PATIENT: Async Select ─────────────────────── */}
                    {patientMode === "old" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Search className="w-4 h-4"/>
                                    Cari Pasien
                                </CardTitle>
                                <CardDescription>Cari pasien yang sudah terdaftar di sistem</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1.5">
                                    <Label>Pasien <span className="text-destructive">*</span></Label>
                                    <AsyncSelect
                                        placeholder="Cari nama atau no. rekam medis..."
                                        value={selectedPatientId}
                                        onChange={setSelectedPatientId}
                                        fetchFn={fetchPatientOptions}
                                        emptyAction={{
                                            to: "/settings/patients/create",
                                            label: "Tambah pasien baru",
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* ── NEW PATIENT: Full Form ────────────────────────── */}
                    {patientMode === "new" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserPlus className="w-5 h-5"/>
                                    Data Pasien Baru
                                </CardTitle>
                                <CardDescription>Isi data identitas pasien baru</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">

                                {/* Photo Upload */}
                                <div className="space-y-2">
                                    <Label>Foto Profil</Label>
                                    <div className="flex items-center gap-4">
                                        {previewImage ? (
                                            <div className="relative">
                                                <Avatar className="h-24 w-24">
                                                    <AvatarImage src={previewImage} alt="Preview"/>
                                                    <AvatarFallback>Preview</AvatarFallback>
                                                </Avatar>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                                    onClick={removeImage}
                                                >
                                                    <X className="h-3 w-3"/>
                                                </Button>
                                            </div>
                                        ) : (
                                            <div
                                                className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/25 bg-muted">
                                                <User className="h-10 w-10 text-muted-foreground/50"/>
                                            </div>
                                        )}
                                        <Label htmlFor="profile_picture_new" className="cursor-pointer">
                                            <div
                                                className="flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                                                <Upload className="h-4 w-4"/>
                                                Pilih Foto
                                            </div>
                                            <Input
                                                id="profile_picture_new"
                                                type="file"
                                                accept="image/*"
                                                className="sr-only"
                                                onChange={handleFileChange}
                                            />
                                        </Label>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">

                                    {/* Nama Lengkap */}
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

                                    {/* NIK */}
                                    <div className="space-y-2">
                                        <Label htmlFor="id_card_number">
                                            NIK <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="id_card_number"
                                            placeholder="16 digit NIK"
                                            maxLength={16}
                                            {...register("id_card_number", {
                                                required: "NIK wajib diisi",
                                                pattern: {
                                                    value: /^[0-9]{16}$/,
                                                    message: "NIK harus 16 digit angka"
                                                }
                                            })}
                                        />
                                        {errors.id_card_number && (
                                            <p className="text-sm text-destructive">{errors.id_card_number.message}</p>
                                        )}
                                    </div>

                                    {/* Tempat Lahir */}
                                    <div className="space-y-2">
                                        <Label htmlFor="city_of_birth">
                                            Tempat Lahir <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="city_of_birth"
                                            placeholder="Kota kelahiran"
                                            {...register("city_of_birth", {required: "Tempat lahir wajib diisi"})}
                                        />
                                        {errors.city_of_birth && (
                                            <p className="text-sm text-destructive">{errors.city_of_birth.message}</p>
                                        )}
                                    </div>

                                    {/* Tanggal Lahir */}
                                    <div className="space-y-2">
                                        <Label>
                                            Tanggal Lahir <span className="text-destructive">*</span>
                                        </Label>
                                        <Controller
                                            name="date_of_birth"
                                            control={control}
                                            rules={{required: "Tanggal lahir wajib diisi"}}
                                            render={({field}) => (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4"/>
                                                            {field.value ? format(field.value, "dd MMMM yyyy") : "Pilih tanggal lahir"}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            initialFocus
                                                            captionLayout="dropdown-buttons"
                                                            fromYear={1900}
                                                            toYear={new Date().getFullYear()}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        />
                                        {errors.date_of_birth && (
                                            <p className="text-sm text-destructive">{errors.date_of_birth.message}</p>
                                        )}
                                    </div>

                                    {/* Jenis Kelamin */}
                                    <div className="space-y-2">
                                        <Label>
                                            Jenis Kelamin <span className="text-destructive">*</span>
                                        </Label>
                                        <Controller
                                            name="gender"
                                            control={control}
                                            rules={{required: "Jenis kelamin wajib dipilih"}}
                                            render={({field}) => (
                                                <div className="relative">
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger
                                                            className={field.value ? "w-full pr-9" : "w-full"}>
                                                            <SelectValue placeholder="Pilih jenis kelamin"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="pria">Pria</SelectItem>
                                                            <SelectItem value="wanita">Wanita</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {field.value && (
                                                        <button type="button"
                                                                className="absolute right-3 top-2.5 text-muted-foreground hover:text-destructive"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    field.onChange(undefined);
                                                                }}>
                                                            <X className="w-4 h-4"/>
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        />
                                        {errors.gender && (
                                            <p className="text-sm text-destructive">{errors.gender.message}</p>
                                        )}
                                    </div>

                                    {/* Agama */}
                                    <div className="space-y-2">
                                        <Label>
                                            Agama <span className="text-destructive">*</span>
                                        </Label>
                                        <Controller
                                            name="religion"
                                            control={control}
                                            rules={{required: "Agama wajib dipilih"}}
                                            render={({field}) => (
                                                <div className="relative">
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger
                                                            className={field.value ? "w-full pr-9" : "w-full"}>
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
                                                    {field.value && (
                                                        <button type="button"
                                                                className="absolute right-3 top-2.5 text-muted-foreground hover:text-destructive"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    field.onChange(undefined);
                                                                }}>
                                                            <X className="w-4 h-4"/>
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        />
                                        {errors.religion && (
                                            <p className="text-sm text-destructive">{errors.religion.message}</p>
                                        )}
                                    </div>

                                    {/* Golongan Darah */}
                                    <div className="space-y-2">
                                        <Label>
                                            Golongan Darah <span className="text-destructive">*</span>
                                        </Label>
                                        <Controller
                                            name="blood_type"
                                            control={control}
                                            rules={{required: "Golongan darah wajib dipilih"}}
                                            render={({field}) => (
                                                <div className="relative">
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger
                                                            className={field.value ? "w-full pr-9" : "w-full"}>
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
                                                    {field.value && (
                                                        <button type="button"
                                                                className="absolute right-3 top-2.5 text-muted-foreground hover:text-destructive"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    field.onChange(undefined);
                                                                }}>
                                                            <X className="w-4 h-4"/>
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        />
                                        {errors.blood_type && (
                                            <p className="text-sm text-destructive">{errors.blood_type.message}</p>
                                        )}
                                    </div>

                                    {/* Pekerjaan */}
                                    <div className="space-y-2">
                                        <Label htmlFor="job">
                                            Pekerjaan <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="job"
                                            placeholder="Pekerjaan"
                                            {...register("job", {required: "Pekerjaan wajib diisi"})}
                                        />
                                        {errors.job && (
                                            <p className="text-sm text-destructive">{errors.job.message}</p>
                                        )}
                                    </div>

                                    {/* Nomor KIS */}
                                    <div className="space-y-2">
                                        <Label htmlFor="kis_number">Nomor KIS</Label>
                                        <Input
                                            id="kis_number"
                                            placeholder="Nomor KIS (opsional)"
                                            {...register("kis_number")}
                                        />
                                    </div>

                                    {/* Nomor Telepon */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">
                                            Nomor Telepon <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="08xxxxxxxxxx"
                                            {...register("phone", {required: "Nomor telepon wajib diisi"})}
                                        />
                                        {errors.phone && (
                                            <p className="text-sm text-destructive">{errors.phone.message}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            Email <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="email@example.com"
                                            {...register("email", {
                                                required: "Email wajib diisi",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Format email tidak valid"
                                                }
                                            })}
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-destructive">{errors.email.message}</p>
                                        )}
                                    </div>

                                    {/* Tanggal Konsultasi */}
                                    <div className="space-y-2">
                                        <Label>
                                            Tanggal Konsultasi <span className="text-destructive">*</span>
                                        </Label>
                                        <Controller
                                            name="date_of_consultation"
                                            control={control}
                                            rules={{required: "Tanggal konsultasi wajib diisi"}}
                                            render={({field}) => (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4"/>
                                                            {field.value ? format(field.value, "dd MMMM yyyy") : "Pilih tanggal konsultasi"}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            initialFocus
                                                            captionLayout="dropdown-buttons"
                                                            fromYear={1900}
                                                            toYear={new Date().getFullYear()}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        />
                                        {errors.date_of_consultation && (
                                            <p className="text-sm text-destructive">{errors.date_of_consultation.message}</p>
                                        )}
                                    </div>

                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* ── Data Penjamin ──────────────────────────────────── */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Data Penjamin</CardTitle>
                            <CardDescription>Informasi penanggung biaya kunjungan</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="guarantor_name">Nama Penjamin</Label>
                                    <Input
                                        id="guarantor_name"
                                        value={visit.guarantor_name}
                                        onChange={(e) => setVisitField("guarantor_name", e.target.value)}
                                        placeholder="Nama lengkap penjamin"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="guarantor_relationship">Hubungan dengan Pasien</Label>
                                    <Input
                                        id="guarantor_relationship"
                                        value={visit.guarantor_relationship}
                                        onChange={(e) => setVisitField("guarantor_relationship", e.target.value)}
                                        placeholder="Contoh: Suami, Orang Tua, BPJS"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="guarantor_address">Alamat Penjamin</Label>
                                <Textarea
                                    id="guarantor_address"
                                    value={visit.guarantor_address}
                                    onChange={(e) => setVisitField("guarantor_address", e.target.value)}
                                    placeholder="Alamat lengkap penjamin"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="registration_fee">Biaya Registrasi (Rp)</Label>
                                <Input
                                    id="registration_fee"
                                    type="number"
                                    min="0"
                                    value={visit.registration_fee}
                                    onChange={(e) => setVisitField("registration_fee", e.target.value)}
                                    placeholder="0"
                                />
                            </div>

                        </CardContent>
                    </Card>

                    {/* ── Actions ────────────────────────────────────────── */}
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" asChild>
                            <Link to="/appointments">Batal</Link>
                        </Button>
                        <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting
                                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Menyimpan...</>
                                : <><Save/> Simpan Pendaftaran</>
                            }
                        </Button>
                    </div>

                </div>
            </div>
        </Layout>
    );
}

export default AppointmentFormPage;