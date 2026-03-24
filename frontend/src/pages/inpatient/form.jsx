import Layout from "@/pages/dashboard/layout.jsx";
import {useForm, Controller} from "react-hook-form";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select.jsx";
import {
    ArrowLeft, Save, Users, BedDouble, Activity, ClipboardList,
    Calendar as CalendarIcon,
} from "lucide-react";
import {Link, useNavigate, useParams} from "@tanstack/react-router";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {Calendar} from "@/components/ui/calendar.jsx";
import {cn} from "@/lib/utils.js";
import {format} from "date-fns";
import ContentHeader from "@/components/ui/content-header.jsx";
import {usePatientStore} from "@/store/usePatientStore.js";
import {useUserStore} from "@/store/useUserStore.js";
import {AsyncSelect} from "@/components/common/async-select.jsx";
import {useInpatientAdmissionStore} from "@/store/inpatientAdmissionStore.js";
import {useBedStore} from "@/store/bedStore.js";
import {useCallback} from "react";

function InpatientForm(opts) {
    const {id} = useParams(opts);
    const isEditMode = !!id;
    const navigate = useNavigate();

    const {fetchPatientOptions} = usePatientStore();
    const {fetchDoctorOptions, userData} = useUserStore();
    const {fetchBedOptions} = useBedStore();

    const fetchAvailableBeds = useCallback(
        (query) => fetchBedOptions(query, 'available'),
        [fetchBedOptions]
    );

    const {inpatientAdmissionValue, createInpatientAdmission, updateInpatientAdmission} = useInpatientAdmissionStore();


    const {
        register,
        handleSubmit,
        control,
        formState: {errors, isSubmitting},
    } = useForm({
        defaultValues: {
            doctor_id: "",
            patient_id: "",
            admitted_at: new Date(),
            discharged_at: null,
            admission_source: "",
            diagnosis: "",
            temperature: "",
            pulse_rate: "",
            respiratory_rate: "",
            systolic: "",
            diastolic: "",
            bed_id: "",
            assigned_at: new Date(),
            released_at: "",
        },
    });

    const onSubmit = async (data) => {
        const formData = {
            ...data,
            admitted_at: data.admitted_at ? format(data.admitted_at, "yyyy-MM-dd HH:mm:ss") : null,
            discharged_at: data.discharged_at ? format(data.discharged_at, "yyyy-MM-dd HH:mm:ss") : null,
            assigned_at: data.assigned_at ? format(data.assigned_at, "yyyy-MM-dd HH:mm:ss") : null,
            released_at: data.released_at ? format(data.released_at, "yyyy-MM-dd HH:mm:ss") : null,
        };

        let result;
        if (isEditMode) {
            result = await updateInpatientAdmission(id, formData);
        } else {
            result = await createInpatientAdmission(formData);
        }

        if (result.success) {
            await navigate({to: "/inpatient"});
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <ContentHeader
                    title="Form Rawat Inap"
                    description="Isi data pendaftaran pasien rawat inap"
                />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <Link to="/inpatient">
                                <Button type="button" variant="outline" size="sm" className="gap-2">
                                    <ArrowLeft className="w-4 h-4"/>
                                    Kembali ke Daftar Rawat Inap
                                </Button>
                            </Link>
                        </div>

                        {/* 1. Informasi Admisi */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5"/>
                                    Informasi Admisi
                                </CardTitle>
                                <CardDescription>Data dasar penerimaan pasien rawat inap</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    {/* Pasien */}
                                    <div className="space-y-2">
                                        <Label>Pasien <span className="text-destructive">*</span></Label>
                                        <Controller
                                            name="patient_id"
                                            control={control}
                                            rules={{required: "Pasien wajib dipilih"}}
                                            render={({field}) => (
                                                <AsyncSelect fetchFn={fetchPatientOptions}
                                                             value={field.value}
                                                             onChange={field.onChange}
                                                             placeholder="Cari pasien..."
                                                             debounce={300}
                                                             defaultLabel={inpatientAdmissionValue.patient?.full_name ?? null}
                                                             emptyAction={{
                                                                 label: "Tambah Pasien Baru",
                                                                 to: "/settings/patients/create"
                                                             }}
                                                />
                                            )}
                                        />
                                        {errors.patient_id && (
                                            <p className="text-sm text-destructive">{errors.patient_id.message}</p>
                                        )}
                                    </div>

                                    {/* Dokter */}
                                    <div className="space-y-2">
                                        <Label>Dokter Penanggung Jawab <span
                                            className="text-destructive">*</span></Label>
                                        <Controller
                                            name="doctor_id"
                                            control={control}
                                            rules={{required: "Dokter wajib dipilih"}}
                                            render={({field}) => (
                                                <AsyncSelect fetchFn={fetchDoctorOptions}
                                                             value={field.value}
                                                             onChange={field.onChange}
                                                             placeholder="Cari Dokter..."
                                                             debounce={300}
                                                             defaultLabel={inpatientAdmissionValue.doctor?.name ?? null}
                                                />
                                            )}
                                        />
                                        {errors.doctor_id && (
                                            <p className="text-sm text-destructive">{errors.doctor_id.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    {/* Tanggal Masuk */}
                                    <div className="space-y-2">
                                        <Label>Tanggal & Waktu Masuk <span className="text-destructive">*</span></Label>
                                        <Controller
                                            name="admitted_at"
                                            control={control}
                                            rules={{required: "Tanggal masuk wajib diisi"}}
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
                                        {errors.admitted_at && (
                                            <p className="text-sm text-destructive">{errors.admitted_at.message}</p>
                                        )}
                                    </div>

                                    {/* Tanggal Keluar */}
                                    <div className="space-y-2">
                                        <Label>Tanggal & Waktu Keluar</Label>
                                        <Controller
                                            name="discharged_at"
                                            control={control}
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
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    {/* Sumber Penerimaan */}
                                    <div className="space-y-2">
                                        <Label>Sumber Penerimaan</Label>
                                        <Controller
                                            name="admission_source"
                                            control={control}
                                            render={({field}) => (
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih sumber penerimaan"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="IGD">IGD</SelectItem>
                                                        <SelectItem value="Rawat Jalan">Rawat Jalan</SelectItem>
                                                        <SelectItem value="Rujukan">Rujukan</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Diagnosis */}
                                <div className="space-y-2">
                                    <Label>Diagnosis</Label>
                                    <Textarea
                                        placeholder="Tuliskan diagnosis pasien..."
                                        className="resize-none"
                                        {...register("diagnosis")}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. Penempatan Tempat Tidur */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BedDouble className="w-5 h-5"/>
                                    Penempatan Tempat Tidur
                                </CardTitle>
                                <CardDescription>Informasi kamar dan tempat tidur pasien</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-3">
                                    {/* Bed */}
                                    <div className="space-y-2">
                                        <Label>Tempat Tidur <span className="text-destructive">*</span></Label>
                                        <Controller
                                            name="bed_id"
                                            control={control}
                                            rules={{required: "Tempat tidur wajib dipilih"}}
                                            render={({field}) => (
                                                <AsyncSelect
                                                    fetchFn={fetchAvailableBeds}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Cari Tempat tidur kosong..."
                                                    debounce={300}
                                                    defaultLabel={inpatientAdmissionValue.bed?.bed_number ?? null}
                                                />
                                            )}
                                        />
                                        {errors.bed_id && (
                                            <p className="text-sm text-destructive">{errors.bed_id.message}</p>
                                        )}
                                    </div>

                                    {/* Tanggal Penempatan */}
                                    <div className="space-y-2">
                                        <Label>Tanggal Penempatan <span className="text-destructive">*</span></Label>
                                        <Controller
                                            name="assigned_at"
                                            control={control}
                                            rules={{required: "Tanggal penempatan wajib diisi"}}
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
                                        {errors.assigned_at && (
                                            <p className="text-sm text-destructive">{errors.assigned_at.message}</p>
                                        )}
                                    </div>

                                    {/* Tanggal Pelepasan */}
                                    <div className="space-y-2">
                                        <Label>Tanggal Pelepasan</Label>
                                        <Controller
                                            name="released_at"
                                            control={control}
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
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 3. Tanda-Tanda Vital */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="w-5 h-5"/>
                                    Tanda-Tanda Vital
                                </CardTitle>
                                <CardDescription>Pengukuran tanda vital pasien saat masuk</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label>Suhu Tubuh (°C)</Label>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            placeholder="0"
                                            {...register("temperature")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Denyut Nadi (bpm)</Label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            {...register("pulse_rate")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Laju Pernafasan (x/menit)</Label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            {...register("respiratory_rate")}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label>Tekanan Darah Sistolik (mmHg)</Label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            {...register("systolic")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tekanan Darah Diastolik (mmHg)</Label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            {...register("diastolic")}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit */}
                        <div className="flex justify-end gap-4">
                            <Link to="/inpatient">
                                <Button type="button" variant="outline">
                                    Batal
                                </Button>
                            </Link>
                            <Button type="submit" className="gap-2" disabled={isSubmitting}>
                                <Save className="w-4 h-4"/>
                                {isSubmitting ? "Menyimpan..." : "Simpan Data"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

export default InpatientForm;