import {Controller, useFieldArray, useForm} from "react-hook-form";
import {Separator} from "@/components/ui/separator";
import ContentHeader from "@/components/ui/content-header.jsx";
import Layout from "@/pages/dashboard/layout.jsx";
import {
    Stethoscope,
    Badge,
    Plus,
    ClipboardList,
    Pill,
    FlaskConical,
    FileText,
    AlertCircle,
    Loader2,
    Save,
    Trash2, Calendar as CalendarIcon, ArrowLeft,
} from "lucide-react";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {useMedicineStore} from "@/store/medicineStore.js";
import {useEffect} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {cn} from "@/lib/utils.js";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar.jsx";
import {useDiagnoseStore} from "@/store/diagnoseStore.js";
import {Link, useNavigate, useParams} from "@tanstack/react-router";
import {useOutpatientVisitStore} from "@/store/outpatientVisitStore.js";
import PatientInfoCard from "@/components/patient/patient-info-card.jsx";


function DiagnoseForm(opts) {
    const navigate = useNavigate();
    const {id} = useParams(opts);
    const {fetchMedicines, medicines} = useMedicineStore();
    const {createDiagnose} = useDiagnoseStore();
    const {showOutPatientVisit, outpatientVisitValue} = useOutpatientVisitStore();


    useEffect(() => {
        fetchMedicines();
        showOutPatientVisit(id);
    }, []);

    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: {errors, isSubmitting},
    } = useForm({
        defaultValues: {
            diagnoses: [{icd_code: "", description: "", type: "primary"}],
            procedures: [{code: "", name: "", description: ""}],
            prescriptions: [
                {
                    medicine_name: "",
                    dosage: "",
                    frequency: "",
                    duration: "",
                    route: "",
                    notes: "",
                },
            ],
            lab_results: "",
            radiology_results: "",
            patient_education: "",
            follow_up: "",
            referral: "none",
            referral_destination: "",
            sick_leave_days: "",
        },
    });

    const diagnoseFields = useFieldArray({control, name: "diagnoses"});
    const procedureFields = useFieldArray({control, name: "procedures"});
    const prescriptionFields = useFieldArray({control, name: "prescriptions"});

    const referralValue = watch("referral");

    const onSubmit = async (data) => {
        const result = await createDiagnose(data, id);
        if (result.success) {
            await navigate({
                to: "/outpatient-visit"
            });
        }
    };

    const SectionHeader = ({icon: Icon, color, label}) => (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${color}`}/>
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {label}
                </span>
            </div>
            <Separator/>
        </div>
    );

    return (
        <Layout>
            <div className="space-y-6 mb-4">
                <ContentHeader
                    title="Form Kunjungan Rawat Jalan"
                    description="Isi data kunjungan pasien rawat jalan"
                />
                <Link to="/outpatient-visit">
                    <Button type="button" variant="outline" size="sm" className="gap-2">
                        <ArrowLeft className="w-4 h-4"/>
                        Kembali ke Daftar Rawat Jalan
                    </Button>
                </Link>
            </div>


            <PatientInfoCard patientValue={outpatientVisitValue}/>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                    <SectionHeader icon={Stethoscope} color="text-teal-500" label="Diagnosis"/>

                    {diagnoseFields.fields.map((field, index) => (
                        <div key={field.id} className="space-y-3 p-4 rounded-lg border bg-muted/20">
                            <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-xs">
                                    {index === 0 ? "Diagnosis Utama" : `Diagnosis ${index + 1}`}
                                </Badge>
                                {index > 0 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-destructive hover:text-destructive"
                                        onClick={() => diagnoseFields.remove(index)}
                                    >
                                        <Trash2 className="w-4 h-4"/>
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {/* Kode ICD-10 */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">
                                        Kode ICD-10 <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        placeholder="A00, B01.1..."
                                        {...register(`diagnoses.${index}.icd_code`, {
                                            required: "Kode ICD wajib diisi",
                                        })}
                                    />
                                    {errors.diagnoses?.[index]?.icd_code && (
                                        <p className="text-sm text-destructive">
                                            {errors.diagnoses[index].icd_code.message}
                                        </p>
                                    )}
                                </div>


                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Tipe</Label>
                                    <Controller
                                        name={`diagnoses.${index}.type`}
                                        control={control}
                                        render={({field}) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="primary">Primer</SelectItem>
                                                        <SelectItem value="secondary">Sekunder</SelectItem>
                                                        <SelectItem value="comorbid">Komorbid</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label className="text-sm font-semibold">
                                    Deskripsi Diagnosis <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    placeholder="Nama penyakit / kondisi"
                                    {...register(`diagnoses.${index}.description`, {
                                        required: "Deskripsi wajib diisi",
                                    })}
                                />
                                {errors.diagnoses?.[index]?.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.diagnoses[index].description.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() =>
                            diagnoseFields.append({icd_code: "", description: "", type: "secondary"})
                        }
                    >
                        <Plus className="w-4 h-4"/>
                        Tambah Diagnosis
                    </Button>
                </div>

                {/* ── TINDAKAN / PROSEDUR ─────────────────────────────── */}
                <div className="space-y-4">
                    <SectionHeader icon={ClipboardList} color="text-teal-500" label="Tindakan / Prosedur"/>

                    {procedureFields.fields.map((field, index) => (
                        <div key={field.id} className="flex items-start gap-3">
                            <div className="grid grid-cols-3 gap-3 flex-1">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Kode ICD-9 / Tindakan</Label>
                                    <Input
                                        placeholder="Kode prosedur"
                                        {...register(`procedures.${index}.code`)}
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label className="text-sm font-semibold">Nama Tindakan</Label>
                                    <Input
                                        placeholder="Contoh: Jahit luka, Injeksi IV..."
                                        {...register(`procedures.${index}.name`)}
                                    />
                                </div>


                                {/* Deskripsi */}
                                <div className="space-y-2 col-span-2">
                                    <Label className="text-sm font-semibold">
                                        Deskripsi Tindakan <span className="text-destructive">*</span>
                                    </Label>
                                    <Textarea
                                        placeholder="Nama penyakit / kondisi"
                                        {...register(`procedures.${index}.description`, {
                                            required: "Deskripsi wajib diisi",
                                        })}
                                    />
                                    {errors.procedures?.[index]?.description && (
                                        <p className="text-sm text-destructive">
                                            {errors.procedures[index].description.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {index > 0 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="mt-7 h-9 w-9 text-destructive hover:text-destructive shrink-0"
                                    onClick={() => procedureFields.remove(index)}
                                >
                                    <Trash2 className="w-4 h-4"/>
                                </Button>
                            )}
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => procedureFields.append({code: "", name: ""})}
                    >
                        <Plus className="w-4 h-4"/>
                        Tambah Tindakan
                    </Button>
                </div>

                <div className="space-y-4">
                    <SectionHeader icon={Pill} color="text-teal-500" label="Resep Obat"/>

                    {prescriptionFields.fields.map((field, index) => (
                        <div key={field.id} className="space-y-3 p-4 rounded-lg border bg-muted/20">
                            <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                Obat {index + 1}
                            </span>
                                {index > 0 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-destructive hover:text-destructive"
                                        onClick={() => prescriptionFields.remove(index)}
                                    >
                                        <Trash2 className="w-4 h-4"/>
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {/* Nama Obat */}
                                <div className="space-y-2 col-span-2">
                                    <Label className="text-sm font-semibold">
                                        Nama Obat <span className="text-destructive">*</span>
                                    </Label>
                                    <Controller
                                        name={`prescriptions.${index}.medicine_name`}
                                        control={control}
                                        render={({field}) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih Obat"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {Array.isArray(medicines) && medicines.map((medicine) => (
                                                            <SelectItem key={medicine.id}
                                                                        value={medicine.id}>{medicine.name}</SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.prescriptions?.[index]?.medicine_name && (
                                        <p className="text-sm text-destructive">
                                            {errors.prescriptions[index].medicine_name.message}
                                        </p>
                                    )}
                                </div>

                                {/* Dosis */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">
                                        Dosis <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        placeholder="500mg, 1 tablet..."
                                        {...register(`prescriptions.${index}.dosage`, {
                                            required: "Dosis wajib diisi",
                                        })}
                                    />
                                    {errors.prescriptions?.[index]?.dosage && (
                                        <p className="text-sm text-destructive">
                                            {errors.prescriptions[index].dosage.message}
                                        </p>
                                    )}
                                </div>

                                {/* Frekuensi */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">
                                        Frekuensi <span className="text-destructive">*</span>
                                    </Label>
                                    <Controller
                                        name={`prescriptions.${index}.frequency`}
                                        control={control}
                                        rules={{required: "Frekuensi wajib dipilih"}}
                                        render={({field}) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih frekuensi"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Frekuensi</SelectLabel>
                                                        <SelectItem value="1x1">1x1 (Sekali sehari)</SelectItem>
                                                        <SelectItem value="2x1">2x1 (Dua kali sehari)</SelectItem>
                                                        <SelectItem value="3x1">3x1 (Tiga kali sehari)</SelectItem>
                                                        <SelectItem value="4x1">4x1 (Empat kali sehari)</SelectItem>
                                                        <SelectItem value="prn">Jika perlu (p.r.n)</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.prescriptions?.[index]?.frequency && (
                                        <p className="text-sm text-destructive">
                                            {errors.prescriptions[index].frequency.message}
                                        </p>
                                    )}
                                </div>

                                {/* Durasi */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Durasi</Label>
                                    <Input
                                        placeholder="3 hari, 1 minggu..."
                                        {...register(`prescriptions.${index}.duration`)}
                                    />
                                </div>

                                {/* Rute */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Rute Pemberian</Label>
                                    <Controller
                                        name={`prescriptions.${index}.route`}
                                        control={control}
                                        render={({field}) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih rute"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Rute</SelectLabel>
                                                        <SelectItem value="oral">Oral (PO)</SelectItem>
                                                        <SelectItem value="iv">Intravena (IV)</SelectItem>
                                                        <SelectItem value="im">Intramuskular (IM)</SelectItem>
                                                        <SelectItem value="sc">Subkutan (SC)</SelectItem>
                                                        <SelectItem value="topical">Topikal</SelectItem>
                                                        <SelectItem value="inhalasi">Inhalasi</SelectItem>
                                                        <SelectItem value="suppositoria">Suppositoria</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Catatan Obat */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Keterangan</Label>
                                <Input
                                    placeholder="Sesudah makan, sebelum tidur, dll..."
                                    {...register(`prescriptions.${index}.notes`)}
                                />
                            </div>
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() =>
                            prescriptionFields.append({
                                medicine_name: "",
                                dosage: "",
                                frequency: "",
                                duration: "",
                                route: "",
                                notes: "",
                            })
                        }
                    >
                        <Plus className="w-4 h-4"/>
                        Tambah Obat
                    </Button>
                </div>

                {/* ── HASIL PENUNJANG ─────────────────────────────────── */}
                <div className="space-y-4">
                    <SectionHeader icon={FlaskConical} color="text-teal-500" label="Hasil Pemeriksaan Penunjang"/>

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Hasil Laboratorium</Label>
                        <Textarea
                            placeholder="Hb: 12 g/dL, Leukosit: 8000/mm³..."
                            rows={2}
                            {...register("lab_results")}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Hasil Radiologi</Label>
                        <Textarea
                            placeholder="Rontgen thorax: ..., USG abdomen: ..."
                            rows={2}
                            {...register("radiology_results")}
                        />
                    </div>
                </div>

                {/* ── EDUKASI & TINDAK LANJUT ─────────────────────────── */}
                <div className="space-y-4">
                    <SectionHeader icon={FileText} color="text-teal-500" label="Edukasi & Tindak Lanjut"/>

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Edukasi Pasien</Label>
                        <Textarea
                            placeholder="Instruksi diet, aktivitas, tanda bahaya yang harus diwaspadai..."
                            rows={2}
                            {...register("patient_education")}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Kontrol Ulang */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Kontrol Ulang</Label>
                            <Controller
                                name="date"
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

                        {/* Surat Sakit */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Surat Keterangan Sakit</Label>
                            <Input
                                type="number"
                                placeholder="Jumlah hari (kosongkan jika tidak ada)"
                                min={1}
                                max={365}
                                {...register("sick_leave_days", {
                                    min: {value: 1, message: "Minimal 1 hari"},
                                })}
                            />
                            {errors.sick_leave_days && (
                                <p className="text-sm text-destructive">{errors.sick_leave_days.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Rujukan */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-teal-500"/>
                            Rujukan
                        </Label>
                        <Controller
                            name="referral"
                            control={control}
                            render={({field}) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Status rujukan"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Status Rujukan</SelectLabel>
                                            <SelectItem value="none">Tidak Ada Rujukan</SelectItem>
                                            <SelectItem value="poli">Rujuk Poli Spesialis</SelectItem>
                                            <SelectItem value="rs">Rujuk RS Lain</SelectItem>
                                            <SelectItem value="rawat_inap">Rawat Inap</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    {/* Tujuan Rujukan — tampil hanya jika ada rujukan */}
                    {referralValue && referralValue !== "none" && (
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">
                                Tujuan Rujukan <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                placeholder="Nama RS / Poli / Dokter tujuan"
                                {...register("referral_destination", {
                                    required: "Tujuan rujukan wajib diisi",
                                })}
                            />
                            {errors.referral_destination && (
                                <p className="text-sm text-destructive">{errors.referral_destination.message}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* ── SUBMIT ──────────────────────────────────────────── */}
                <div className="flex justify-end gap-3 pt-2 border-t">
                    <Link to="/outpatient-visit">
                        <Button type="button" variant="outline">
                            Batal
                        </Button>
                    </Link>
                    <Button type="submit" className="gap-2" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin"/>
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4"/>
                                Simpan Diagnosis
                            </>
                        )}
                    </Button>
                </div>

            </form>
        </Layout>
    );
}

export default DiagnoseForm;