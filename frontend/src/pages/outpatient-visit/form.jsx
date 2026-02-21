import Layout from "@/pages/dashboard/layout.jsx";
import {usePatientStore} from "@/store/usePatientStore.js";
import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.jsx";
import {
    ArrowLeft,
    Save,
    Users,
    Activity,
    UserCircle,
    Brain,
    AlertCircle,
    Plus,
    Trash2,
    Calendar as CalendarIcon,
    X
} from "lucide-react";
import {Link, useNavigate, useParams} from "@tanstack/react-router";
import {Separator} from "@/components/ui/separator.jsx";
import ContentHeader from "@/components/ui/content-header.jsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {cn} from "@/lib/utils.js";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar.jsx";
import {useUserStore} from "@/store/useUserStore.js";
import {usePoliStore} from "@/store/poliStore.js";
import {useOutpatientVisitStore} from "@/store/outpatientVisitStore.js";

function OutpatientForm(opts) {

    const {id} = useParams(opts);
    const isEditMode = !!id;
    const navigate = useNavigate();

    const {fetchPatients, patients} = usePatientStore();
    const {fetchDoctors, userData} = useUserStore();
    const {fetchPoli, poliData} = usePoliStore();
    const {createOutpatientVisit, updateOutpatientVisit} = useOutpatientVisitStore();


    const [allergies, setAllergies] = useState([{name: ""}]);
    const [medicalHistory, setMedicalHistory] = useState([{condition: ""}]);
    const [familyMedicalHistory, setFamilyMedicalHistory] = useState([{condition: ""}]);
    const [medicationHistory, setMedicationHistory] = useState([{medication: ""}]);
    const [psychologyConditions, setPsychologyConditions] = useState([{condition: ""}]);

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: {errors, isSubmitting},
    } = useForm({
        defaultValues: {
            type: "",
            referred_hospital: "",
            referred_doctor: "",
            patient_id: "",
            doctor_id: "",
            poli_id: "",
            date: undefined,
            height: "",
            weight: "",
            temperature: "",
            pulse_rate: "",
            respiratory_frequency: "",
            systolic: "",
            diastolic: "",
            abdominal_circumference: "",
            blood_sugar: "",
            oxygen_saturation: "",
            companion_name: "",
            companion_phone: "",
            companion_address: "",
            marital_status: "",
            live_with: "",
            job: "",
        }
    });

    const visitType = watch("type");
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        fetchPatients();
        fetchDoctors();
        fetchPoli();
    }, []);

    const onSubmit = async (data) => {
        const formData = {
            ...data,
            date: data.date ? format(data.date, "yyyy-MM-dd HH:mm:ss") : null,
            patient_allergy: allergies.filter(a => a.name),
            patient_medical_history: medicalHistory.filter(m => m.condition),
            patient_family_medical_history: familyMedicalHistory.filter(f => f.condition),
            patient_medication_history: medicationHistory.filter(m => m.medication),
            psychology_condition: psychologyConditions.filter(p => p.condition),
        };

        let result;

        result = await createOutpatientVisit(formData);
        if (result.success) {
            await navigate({
                to: '/outpatient-visit',
            });
        }
    };

    // Functions to handle dynamic fields
    const addAllergy = () => setAllergies([...allergies, {name: ""}]);
    const removeAllergy = (index) => setAllergies(allergies.filter((_, i) => i !== index));
    const updateAllergy = (index, value) => {
        const updated = [...allergies];
        updated[index] = {name: value};
        setAllergies(updated);
    };

    const addMedicalHistory = () => setMedicalHistory([...medicalHistory, {condition: ""}]);
    const removeMedicalHistory = (index) => setMedicalHistory(medicalHistory.filter((_, i) => i !== index));
    const updateMedicalHistory = (index, value) => {
        const updated = [...medicalHistory];
        updated[index] = {condition: value};
        setMedicalHistory(updated);
    };

    const addFamilyMedicalHistory = () => setFamilyMedicalHistory([...familyMedicalHistory, {condition: ""}]);
    const removeFamilyMedicalHistory = (index) => setFamilyMedicalHistory(familyMedicalHistory.filter((_, i) => i !== index));
    const updateFamilyMedicalHistory = (index, value) => {
        const updated = [...familyMedicalHistory];
        updated[index] = {condition: value};
        setFamilyMedicalHistory(updated);
    };

    const addMedicationHistory = () => setMedicationHistory([...medicationHistory, {medication: ""}]);
    const removeMedicationHistory = (index) => setMedicationHistory(medicationHistory.filter((_, i) => i !== index));
    const updateMedicationHistory = (index, value) => {
        const updated = [...medicationHistory];
        updated[index] = {medication: value};
        setMedicationHistory(updated);
    };

    const addPsychologyCondition = () => setPsychologyConditions([...psychologyConditions, {condition: ""}]);
    const removePsychologyCondition = (index) => setPsychologyConditions(psychologyConditions.filter((_, i) => i !== index));
    const updatePsychologyCondition = (index, value) => {
        const updated = [...psychologyConditions];
        updated[index] = {condition: value};
        setPsychologyConditions(updated);
    };

    return (
        <Layout>
            <div className="space-y-6">
                <ContentHeader
                    title="Form Kunjungan Rawat Jalan"
                    description="Isi data kunjungan pasien rawat jalan"
                />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-6">
                        {/* Back Button */}
                        <div className="flex items-center justify-between">
                            <Link to="/outpatient">
                                <Button type="button" variant="outline" size="sm" className="gap-2">
                                    <ArrowLeft className="w-4 h-4"/>
                                    Kembali ke Daftar Rawat Jalan
                                </Button>
                            </Link>
                        </div>

                        {/* 1. Informasi Kunjungan */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5"/>
                                    Informasi Kunjungan
                                </CardTitle>
                                <CardDescription>Data dasar kunjungan pasien</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    {/* Type */}
                                    <div className="space-y-2">
                                        <Label htmlFor="type">
                                            Tipe Kunjungan <span className="text-destructive">*</span>
                                        </Label>
                                        <Controller
                                            name="type"
                                            control={control}
                                            rules={{required: "Tipe kunjungan wajib dipilih"}}
                                            render={({field}) => (
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih tipe kunjungan"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="rujuk">Rujuk</SelectItem>
                                                        <SelectItem value="non_rujuk">Non Rujuk</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.type && (
                                            <p className="text-sm text-destructive">{errors.type.message}</p>
                                        )}
                                    </div>

                                    {/* Date */}
                                    <div className="space-y-2">
                                        <Label htmlFor="date">
                                            Tanggal Kunjungan <span className="text-destructive">*</span>
                                        </Label>
                                        <Controller
                                            name="date"
                                            control={control}
                                            rules={{required: "Tanggal kunjungan wajib diisi"}}
                                            render={({field}) => (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4"/>
                                                            {field.value ? format(field.value, "PPP") :
                                                                <span>Pilih tanggal</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        />
                                        {errors.date && (
                                            <p className="text-sm text-destructive">{errors.date.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Rujukan Fields - Show only if type is 'rujukan' */}
                                {visitType === "rujukan" && (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="referred_hospital">
                                                Rumah Sakit Perujuk
                                            </Label>
                                            <Input
                                                id="referred_hospital"
                                                placeholder="Nama rumah sakit"
                                                {...register("referred_hospital")}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="referred_doctor">
                                                Dokter Perujuk
                                            </Label>
                                            <Input
                                                id="referred_doctor"
                                                placeholder="Nama dokter perujuk"
                                                {...register("referred_doctor")}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="grid gap-4 md:grid-cols-3">
                                    {/* Patient */}
                                    <div className="space-y-2">
                                        <Label htmlFor="patient_id">
                                            Pasien <span className="text-destructive">*</span>
                                        </Label>
                                        <Controller
                                            name="patient_id"
                                            control={control}
                                            rules={{required: "Pasien wajib dipilih"}}
                                            render={({field}) => (
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih pasien"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {patients && patients?.map((patient) => (
                                                            <SelectItem key={patient.id} value={patient.id.toString()}>
                                                                {patient.full_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.patient_id && (
                                            <p className="text-sm text-destructive">{errors.patient_id.message}</p>
                                        )}
                                    </div>

                                    {/* Doctor */}
                                    <div className="space-y-2">
                                        <Label htmlFor="doctor_id">
                                            Dokter <span className="text-destructive">*</span>
                                        </Label>
                                        <Controller
                                            name="doctor_id"
                                            control={control}
                                            rules={{required: "Dokter wajib dipilih"}}
                                            render={({field}) => (
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih dokter"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {userData.map((doctor) => (
                                                            <SelectItem key={doctor.id} value={doctor.id}>
                                                                {doctor.name} - {doctor.poli.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.doctor_id && (
                                            <p className="text-sm text-destructive">{errors.doctor_id.message}</p>
                                        )}
                                    </div>

                                    {/* Poli */}
                                    <div className="space-y-2">
                                        <Label htmlFor="poli_id">
                                            Poli <span className="text-destructive">*</span>
                                        </Label>
                                        <Controller
                                            name="poli_id"
                                            control={control}
                                            rules={{required: "Poli wajib dipilih"}}
                                            render={({field}) => (
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih poli"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {poliData.map((p) => (
                                                            <SelectItem key={p.id} value={p.id}>
                                                                {p.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.poli_id && (
                                            <p className="text-sm text-destructive">{errors.poli_id.message}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. Vital Signs */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="w-5 h-5"/>
                                    Tanda-Tanda Vital
                                </CardTitle>
                                <CardDescription>Pengukuran tanda vital pasien</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="height">Tinggi Badan (cm)</Label>
                                        <Input
                                            id="height"
                                            type="number"
                                            step="0.1"
                                            placeholder="0"
                                            {...register("height")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="weight">Berat Badan (kg)</Label>
                                        <Input
                                            id="weight"
                                            type="number"
                                            step="0.1"
                                            placeholder="0"
                                            {...register("weight")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="temperature">Suhu Tubuh (°C)</Label>
                                        <Input
                                            id="temperature"
                                            type="number"
                                            step="0.1"
                                            placeholder="0"
                                            {...register("temperature")}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="pulse_rate">Nadi (x/menit)</Label>
                                        <Input
                                            id="pulse_rate"
                                            type="number"
                                            placeholder="0"
                                            {...register("pulse_rate")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="respiratory_frequency">Pernapasan (x/menit)</Label>
                                        <Input
                                            id="respiratory_frequency"
                                            type="number"
                                            placeholder="0"
                                            {...register("respiratory_frequency")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="oxygen_saturation">Saturasi Oksigen (%)</Label>
                                        <Input
                                            id="oxygen_saturation"
                                            type="number"
                                            step="0.1"
                                            placeholder="0"
                                            {...register("oxygen_saturation")}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="systolic">Tekanan Darah Sistolik (mmHg)</Label>
                                        <Input
                                            id="systolic"
                                            type="number"
                                            placeholder="0"
                                            {...register("systolic")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="diastolic">Tekanan Darah Diastolik (mmHg)</Label>
                                        <Input
                                            id="diastolic"
                                            type="number"
                                            placeholder="0"
                                            {...register("diastolic")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="blood_sugar">Gula Darah (mg/dL)</Label>
                                        <Input
                                            id="blood_sugar"
                                            type="number"
                                            step="0.1"
                                            placeholder="0"
                                            {...register("blood_sugar")}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="abdominal_circumference">Lingkar Perut (cm)</Label>
                                        <Input
                                            id="abdominal_circumference"
                                            type="number"
                                            step="0.1"
                                            placeholder="0"
                                            {...register("abdominal_circumference")}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 3. Patient Companion */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserCircle className="w-5 h-5"/>
                                    Data Pendamping Pasien
                                </CardTitle>
                                <CardDescription>Informasi pendamping yang menemani pasien</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="companion_name">Nama Lengkap</Label>
                                        <Input
                                            id="companion_name"
                                            placeholder="Nama pendamping"
                                            {...register("companion_name")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="companion_phone">Nomor Telepon</Label>
                                        <Input
                                            id="companion_phone"
                                            placeholder="08xxxxxxxxxx"
                                            {...register("companion_phone")}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="companion_address">Alamat</Label>
                                    <Textarea
                                        id="companion_address"
                                        placeholder="Alamat lengkap pendamping"
                                        {...register("companion_address")}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* 4. Allergies & Medical History */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5"/>
                                    Alergi & Riwayat Kesehatan
                                </CardTitle>
                                <CardDescription>Data alergi dan riwayat medis pasien</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Allergies */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label>Alergi</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addAllergy}
                                            className="gap-2"
                                        >
                                            <Plus className="w-4 h-4"/>
                                            Tambah Alergi
                                        </Button>
                                    </div>
                                    {allergies.map((allergy, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                placeholder="Nama alergi (contoh: Penisilin, Seafood)"
                                                value={allergy.name}
                                                onChange={(e) => updateAllergy(index, e.target.value)}
                                            />
                                            {allergies.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => removeAllergy(index)}
                                                >
                                                    <Trash2 className="w-4 h-4"/>
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <Separator/>

                                {/* Medical History */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label>Riwayat Penyakit</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addMedicalHistory}
                                            className="gap-2"
                                        >
                                            <Plus className="w-4 h-4"/>
                                            Tambah Riwayat
                                        </Button>
                                    </div>
                                    {medicalHistory.map((history, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                placeholder="Riwayat penyakit (contoh: Diabetes, Hipertensi)"
                                                value={history.condition}
                                                onChange={(e) => updateMedicalHistory(index, e.target.value)}
                                            />
                                            {medicalHistory.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => removeMedicalHistory(index)}
                                                >
                                                    <Trash2 className="w-4 h-4"/>
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <Separator/>

                                {/* Family Medical History */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label>Riwayat Penyakit Keluarga</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addFamilyMedicalHistory}
                                            className="gap-2"
                                        >
                                            <Plus className="w-4 h-4"/>
                                            Tambah Riwayat Keluarga
                                        </Button>
                                    </div>
                                    {familyMedicalHistory.map((history, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                placeholder="Riwayat penyakit keluarga"
                                                value={history.condition}
                                                onChange={(e) => updateFamilyMedicalHistory(index, e.target.value)}
                                            />
                                            {familyMedicalHistory.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => removeFamilyMedicalHistory(index)}
                                                >
                                                    <Trash2 className="w-4 h-4"/>
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <Separator/>

                                {/* Medication History */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label>Riwayat Pengobatan</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addMedicationHistory}
                                            className="gap-2"
                                        >
                                            <Plus className="w-4 h-4"/>
                                            Tambah Obat
                                        </Button>
                                    </div>
                                    {medicationHistory.map((medication, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                placeholder="Nama obat yang sedang dikonsumsi"
                                                value={medication.medication}
                                                onChange={(e) => updateMedicationHistory(index, e.target.value)}
                                            />
                                            {medicationHistory.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => removeMedicationHistory(index)}
                                                >
                                                    <Trash2 className="w-4 h-4"/>
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* 5. Psychosocial & Spiritual */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Brain className="w-5 h-5"/>
                                    Psikososial & Spiritual
                                </CardTitle>
                                <CardDescription>Data kondisi psikologis dan sosial pasien</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Psychology Conditions */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label>Kondisi Psikologi</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addPsychologyCondition}
                                            className="gap-2"
                                        >
                                            <Plus className="w-4 h-4"/>
                                            Tambah Kondisi
                                        </Button>
                                    </div>
                                    {psychologyConditions.map((condition, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                placeholder="Kondisi psikologi (contoh: Cemas, Stres)"
                                                value={condition.condition}
                                                onChange={(e) => updatePsychologyCondition(index, e.target.value)}
                                            />
                                            {psychologyConditions.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => removePsychologyCondition(index)}
                                                >
                                                    <Trash2 className="w-4 h-4"/>
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <Separator/>

                                <div className="grid gap-4 md:grid-cols-2">
                                    {/* Marital Status */}
                                    <div className="space-y-2">
                                        <Label htmlFor="marital_status">Status Pernikahan</Label>
                                        <Controller
                                            name="marital_status"
                                            control={control}
                                            render={({field}) => (
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih status"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="menikah">Menikah</SelectItem>
                                                        <SelectItem value="belum_menikah">Belum Menikah</SelectItem>
                                                        <SelectItem value="janda_atau_duda">Janda/Duda</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>

                                    {/* Live With */}
                                    <div className="space-y-2">
                                        <Label htmlFor="live_with">Tinggal Dengan</Label>
                                        <Controller
                                            name="live_with"
                                            control={control}
                                            render={({field}) => (
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="sendiri">Sendiri</SelectItem>
                                                        <SelectItem value="orang_tua">Orang Tua</SelectItem>
                                                        <SelectItem value="suami_atau_istri">Suami/Istri</SelectItem>
                                                        <SelectItem value="lainnya">Lainnya</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    {/* Job */}
                                    <div className="space-y-2">
                                        <Label htmlFor="job">Pekerjaan</Label>
                                        <Controller
                                            name="job"
                                            control={control}
                                            render={({field}) => (
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih pekerjaan"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="wiraswasta">Wiraswasta</SelectItem>
                                                        <SelectItem value="swasta">Swasta</SelectItem>
                                                        <SelectItem value="pns">PNS</SelectItem>
                                                        <SelectItem value="lainnya">Lainnya</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit Buttons */}
                        <div className="flex justify-end gap-4">
                            <Link to="/outpatient-visits">
                                <Button type="button" variant="outline">
                                    Batal
                                </Button>
                            </Link>
                            <Button type="submit" className="gap-2" disabled={isSubmitting}>
                                <Save className="w-4 h-4"/>
                                {isSubmitting ? "Menyimpan..." : "Simpan Kunjungan"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

export default OutpatientForm;