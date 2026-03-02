import {Controller, useFieldArray, useForm} from "react-hook-form";
import {Separator} from "@/components/ui/separator.jsx";
import ContentHeader from "@/components/ui/content-header.jsx";
import Layout from "@/pages/dashboard/layout.jsx";
import {
    Stethoscope, Plus, ClipboardList, Pill, FlaskConical,
    FileText, AlertCircle, Loader2, Save, Trash2,
    Calendar as CalendarIcon, ArrowLeft,
} from "lucide-react";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {
    Select, SelectContent, SelectGroup, SelectItem,
    SelectLabel, SelectTrigger, SelectValue
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
import {Card, CardContent, CardHeader} from "@/components/ui/card.jsx";
import {Badge} from "@/components/ui/badge.jsx";

/* ─── Section Card ──────────────────────────────────────────────────────── */
function SectionCard({icon: Icon, label, accent = "teal", children, action}) {
    const accents = {
        teal: {icon: "text-teal-600", bg: "bg-teal-50", border: "border-teal-100"},
        violet: {icon: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100"},
        amber: {icon: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100"},
        sky: {icon: "text-sky-600", bg: "bg-sky-50", border: "border-sky-100"},
        rose: {icon: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100"},
    };
    const c = accents[accent];
    return (
        <Card className="shadow-sm border-slate-100 overflow-hidden">
            <CardHeader className={cn("px-5 py-4 border-b border-slate-100", c.bg)}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <span className={cn("p-1.5 rounded-lg bg-white shadow-sm", c.border, "border")}>
                            <Icon className={cn("w-4 h-4", c.icon)}/>
                        </span>
                        <span className="font-semibold text-slate-700 text-[15px]">{label}</span>
                    </div>
                    {action}
                </div>
            </CardHeader>
            <CardContent className="px-5 py-5 space-y-4">
                {children}
            </CardContent>
        </Card>
    );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
function DiagnoseForm(opts) {
    const navigate = useNavigate();
    const {id} = useParams(opts);
    const {fetchReadyStockMedicine, readyStockMedicines} = useMedicineStore();
    const {createDiagnose} = useDiagnoseStore();
    const {showOutPatientVisit, outpatientVisitValue} = useOutpatientVisitStore();

    useEffect(() => {
        fetchReadyStockMedicine();
        showOutPatientVisit(id);
    }, []);

    const {
        register, control, handleSubmit, watch,
        formState: {errors, isSubmitting},
    } = useForm({
        defaultValues: {
            diagnoses: [{icd10_code: "", description: "", type: "primary"}],
            procedures: [{icd9_code: "", name: "", description: "", procedure_date: undefined, notes: ""}],
            prescriptions: [{
                medicine_id: "",
                dosage: "",
                frequency: "",
                duration: "",
                route: "",
                quantity: "",
                notes: ""
            }],
            lab_results: "", radiology_results: "", patient_education: "",
            follow_up: "", referral: "none", referral_destination: "", sick_leave_days: "",
        },
    });

    const diagnoseFields = useFieldArray({control, name: "diagnoses"});
    const procedureFields = useFieldArray({control, name: "procedures"});
    const prescriptionFields = useFieldArray({control, name: "prescriptions"});
    const referralValue = watch("referral");
    const watchedPrescriptions = watch("prescriptions");

    // Hitung total stock tersedia untuk satu obat (sum semua batch)
    const getAvailableStock = (medicineId) => {
        if (!medicineId || !Array.isArray(readyStockMedicines)) return 0;
        const medicine = readyStockMedicines.find(m => m.id === medicineId);
        if (!medicine?.batches) return 0;
        return medicine.batches.reduce((sum, b) => sum + (b.stock?.stock_amount ?? 0), 0);
    };

    const onSubmit = async (data) => {
        const result = await createDiagnose(data, id);
        if (result) await navigate({to: "/outpatient/visit"});
    };

    return (
        <Layout>
            <div className="space-y-6 mb-6">
                <ContentHeader
                    title="Form Kunjungan Rawat Jalan"
                    description="Isi data kunjungan pasien rawat jalan"
                />
                <Link to="/outpatient">
                    <Button type="button" variant="outline" size="sm" className="gap-2">
                        <ArrowLeft className="w-4 h-4"/>
                        Kembali ke Daftar Rawat Jalan
                    </Button>
                </Link>
            </div>

            <PatientInfoCard patientValue={outpatientVisitValue}/>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-5">

                {/* ── DIAGNOSIS ── */}
                <SectionCard icon={Stethoscope} label="Diagnosis" accent="teal"
                             action={
                                 <Button type="button" variant="outline" size="sm" className="gap-1.5 h-8 text-xs"
                                         onClick={() => diagnoseFields.append({
                                             icd10_code: "",
                                             description: "",
                                             type: "secondary"
                                         })}>
                                     <Plus className="w-3.5 h-3.5"/> Tambah Diagnosis
                                 </Button>
                             }
                >
                    <div className="space-y-3">
                        {diagnoseFields.fields.map((field, index) => (
                            <div key={field.id}
                                 className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-3">
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline" className="text-xs font-semibold">
                                        {index === 0 ? "Diagnosis Utama" : `Diagnosis ${index + 1}`}
                                    </Badge>
                                    {index > 0 && (
                                        <Button type="button" variant="ghost" size="icon"
                                                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-red-50"
                                                onClick={() => diagnoseFields.remove(index)}>
                                            <Trash2 className="w-3.5 h-3.5"/>
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-600">Kode ICD-10 <span
                                            className="text-destructive">*</span></Label>
                                        <Input placeholder="A00, B01.1..."
                                               {...register(`diagnoses.${index}.icd10_code`, {required: "Kode ICD wajib diisi"})}/>
                                        {errors.diagnoses?.[index]?.icd10_code && (
                                            <p className="text-xs text-destructive">{errors.diagnoses[index].icd10_code.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-600">Tipe</Label>
                                        <Controller name={`diagnoses.${index}.type`} control={control}
                                                    render={({field}) => (
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger
                                                                className="w-full"><SelectValue/></SelectTrigger>
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
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-slate-600">Deskripsi Diagnosis <span
                                        className="text-destructive">*</span></Label>
                                    <Textarea placeholder="Nama penyakit / kondisi" rows={2}
                                              {...register(`diagnoses.${index}.description`, {required: "Deskripsi wajib diisi"})}/>
                                    {errors.diagnoses?.[index]?.description && (
                                        <p className="text-xs text-destructive">{errors.diagnoses[index].description.message}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* ── TINDAKAN / PROSEDUR ── */}
                <SectionCard icon={ClipboardList} label="Tindakan / Prosedur" accent="violet"
                             action={
                                 <Button type="button" variant="outline" size="sm" className="gap-1.5 h-8 text-xs"
                                         onClick={() => procedureFields.append({
                                             icd9_code: "",
                                             name: "",
                                             description: "",
                                             procedure_date: undefined,
                                             notes: ""
                                         })}>
                                     <Plus className="w-3.5 h-3.5"/> Tambah Tindakan
                                 </Button>
                             }
                >
                    <div className="space-y-3">
                        {procedureFields.fields.map((field, index) => (
                            <div key={field.id}
                                 className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500">Tindakan {index + 1}</span>
                                    {index > 0 && (
                                        <Button type="button" variant="ghost" size="icon"
                                                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-red-50"
                                                onClick={() => procedureFields.remove(index)}>
                                            <Trash2 className="w-3.5 h-3.5"/>
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-600">Kode ICD-9 /
                                            Tindakan</Label>
                                        <Input placeholder="Kode prosedur"
                                               {...register(`procedures.${index}.icd9_code`, {required: "Prosedur tidak boleh kosong"})}/>
                                    </div>
                                    <div className="space-y-1.5 col-span-2">
                                        <Label className="text-xs font-semibold text-slate-600">Nama Tindakan</Label>
                                        <Input placeholder="Contoh: Jahit luka, Injeksi IV..."
                                               {...register(`procedures.${index}.name`)}/>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-600">Tanggal Tindakan</Label>
                                        <Controller name={`procedures.${index}.procedure_date`} control={control}
                                                    render={({field}) => (
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button variant="outline"
                                                                        className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                                                    <CalendarIcon className="mr-2 h-4 w-4"/>
                                                                    {field.value ? format(field.value, "dd MMMM yyyy") : "Pilih tanggal"}
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar mode="single" selected={field.value}
                                                                          onSelect={field.onChange}
                                                                          initialFocus captionLayout="dropdown-buttons"
                                                                          fromYear={2000}
                                                                          toYear={new Date().getFullYear()}/>
                                                            </PopoverContent>
                                                        </Popover>
                                                    )}
                                        />
                                    </div>
                                    <div className="space-y-1.5 col-span-2">
                                        <Label className="text-xs font-semibold text-slate-600">Deskripsi Tindakan <span
                                            className="text-destructive">*</span></Label>
                                        <Textarea placeholder="Uraian tindakan yang dilakukan" rows={2}
                                                  {...register(`procedures.${index}.description`, {required: "Deskripsi wajib diisi"})}/>
                                        {errors.procedures?.[index]?.description && (
                                            <p className="text-xs text-destructive">{errors.procedures[index].description.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* ── RESEP OBAT ── */}
                <SectionCard icon={Pill} label="Resep Obat" accent="amber"
                             action={
                                 <Button type="button" variant="outline" size="sm" className="gap-1.5 h-8 text-xs"
                                         onClick={() => prescriptionFields.append({
                                             medicine_id: "",
                                             dosage: "",
                                             frequency: "",
                                             duration: "",
                                             route: "",
                                             quantity: "",
                                             notes: ""
                                         })}>
                                     <Plus className="w-3.5 h-3.5"/> Tambah Obat
                                 </Button>
                             }
                >
                    <div className="space-y-3">
                        {prescriptionFields.fields.map((field, index) => (
                            <div key={field.id}
                                 className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500">Obat {index + 1}</span>
                                    {index > 0 && (
                                        <Button type="button" variant="ghost" size="icon"
                                                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-red-50"
                                                onClick={() => prescriptionFields.remove(index)}>
                                            <Trash2 className="w-3.5 h-3.5"/>
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5 col-span-2">
                                        <Label className="text-xs font-semibold text-slate-600">Nama Obat <span
                                            className="text-destructive">*</span></Label>
                                        <Controller name={`prescriptions.${index}.medicine_id`} control={control}
                                                    render={({field}) => (
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="w-full"><SelectValue
                                                                placeholder="Pilih Obat"/></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    {Array.isArray(readyStockMedicines) && readyStockMedicines.map((m) => (
                                                                        <SelectItem key={m.id}
                                                                                    value={m.id}>{m.name}</SelectItem>
                                                                    ))}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                        />
                                        {errors.prescriptions?.[index]?.medicine_id && (
                                            <p className="text-xs text-destructive">{errors.prescriptions[index].medicine_id.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-600">Dosis <span
                                            className="text-destructive">*</span></Label>
                                        <Input placeholder="500mg, 1 tablet..."
                                               {...register(`prescriptions.${index}.dosage`, {required: "Dosis wajib diisi"})}/>
                                        {errors.prescriptions?.[index]?.dosage && (
                                            <p className="text-xs text-destructive">{errors.prescriptions[index].dosage.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-600">Frekuensi <span
                                            className="text-destructive">*</span></Label>
                                        <Controller name={`prescriptions.${index}.frequency`} control={control}
                                                    rules={{required: "Frekuensi wajib dipilih"}}
                                                    render={({field}) => (
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="w-full"><SelectValue
                                                                placeholder="Pilih frekuensi"/></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>Frekuensi</SelectLabel>
                                                                    <SelectItem value="1x1">1x1 (Sekali
                                                                        sehari)</SelectItem>
                                                                    <SelectItem value="2x1">2x1 (Dua kali
                                                                        sehari)</SelectItem>
                                                                    <SelectItem value="3x1">3x1 (Tiga kali
                                                                        sehari)</SelectItem>
                                                                    <SelectItem value="4x1">4x1 (Empat kali
                                                                        sehari)</SelectItem>
                                                                    <SelectItem value="prn">Jika perlu
                                                                        (p.r.n)</SelectItem>
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                        />
                                        {errors.prescriptions?.[index]?.frequency && (
                                            <p className="text-xs text-destructive">{errors.prescriptions[index].frequency.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-600">Durasi</Label>
                                        <Input
                                            placeholder="3 hari, 1 minggu..." {...register(`prescriptions.${index}.duration`)}/>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-600">Rute Pemberian</Label>
                                        <Controller name={`prescriptions.${index}.route`} control={control}
                                                    render={({field}) => (
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="w-full"><SelectValue
                                                                placeholder="Pilih rute"/></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>Rute</SelectLabel>
                                                                    <SelectItem value="oral">Oral (PO)</SelectItem>
                                                                    <SelectItem value="iv">Intravena (IV)</SelectItem>
                                                                    <SelectItem value="im">Intramuskular
                                                                        (IM)</SelectItem>
                                                                    <SelectItem value="sc">Subkutan (SC)</SelectItem>
                                                                    <SelectItem value="topical">Topikal</SelectItem>
                                                                    <SelectItem value="inhalasi">Inhalasi</SelectItem>
                                                                    <SelectItem
                                                                        value="suppositoria">Suppositoria</SelectItem>
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs font-semibold text-slate-600">Jumlah / Qty <span
                                                className="text-destructive">*</span></Label>
                                            {(() => {
                                                const medId = watchedPrescriptions?.[index]?.medicine_id;
                                                const stock = getAvailableStock(medId);
                                                if (!medId) return null;
                                                return (
                                                    <span className={cn(
                                                        "text-[11px] font-medium px-2 py-0.5 rounded-full",
                                                        stock === 0 ? "bg-red-100 text-red-600" :
                                                            stock < 10 ? "bg-amber-100 text-amber-600" :
                                                                "bg-emerald-100 text-emerald-600"
                                                    )}>
                                                        Stok: {stock}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                        <Input type="number" min={1} placeholder="Jumlah obat"
                                               {...register(`prescriptions.${index}.quantity`, {
                                                   required: "Quantity wajib diisi",
                                                   min: {value: 1, message: "Minimal 1"},
                                                   validate: (val) => {
                                                       const medId = watchedPrescriptions?.[index]?.medicine_id;
                                                       const stock = getAvailableStock(medId);
                                                       if (!medId || stock === 0) return "Obat ini tidak memiliki stok tersedia";
                                                       if (Number(val) > stock) return `Melebihi stok tersedia (${stock})`;
                                                       return true;
                                                   }
                                               })}/>
                                        {errors.prescriptions?.[index]?.quantity && (
                                            <p className="text-xs text-destructive">{errors.prescriptions[index].quantity.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-600">Keterangan</Label>
                                        <Input placeholder="Sesudah makan, sebelum tidur, dll..."
                                               {...register(`prescriptions.${index}.notes`)}/>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* ── HASIL PENUNJANG ── */}
                <SectionCard icon={FlaskConical} label="Hasil Pemeriksaan Penunjang" accent="sky">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-600">Hasil Laboratorium</Label>
                            <Textarea placeholder="Hb: 12 g/dL, Leukosit: 8000/mm³..." rows={3}
                                      {...register("lab_results")}/>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-600">Hasil Radiologi</Label>
                            <Textarea placeholder="Rontgen thorax: ..., USG abdomen: ..." rows={3}
                                      {...register("radiology_results")}/>
                        </div>
                    </div>
                </SectionCard>

                {/* ── EDUKASI & TINDAK LANJUT ── */}
                <SectionCard icon={FileText} label="Edukasi & Tindak Lanjut" accent="rose">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-600">Edukasi Pasien</Label>
                        <Textarea placeholder="Instruksi diet, aktivitas, tanda bahaya yang harus diwaspadai..."
                                  rows={2}
                                  {...register("patient_education")}/>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-600">Kontrol Ulang</Label>
                            <Controller name="follow_up" control={control}
                                        render={({field}) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button type="button" variant="outline"
                                                            className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                                        <CalendarIcon className="mr-2 h-4 w-4"/>
                                                        {field.value ? format(field.value, "PPP") :
                                                            <span>Pilih tanggal</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar mode="single" selected={field.value}
                                                              onSelect={field.onChange} initialFocus/>
                                                </PopoverContent>
                                            </Popover>
                                        )}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-600">Surat Keterangan Sakit</Label>
                            <Input type="number" placeholder="Jumlah hari (kosongkan jika tidak ada)" min={1} max={365}
                                   {...register("sick_leave_days", {min: {value: 1, message: "Minimal 1 hari"}})}/>
                            {errors.sick_leave_days && (
                                <p className="text-xs text-destructive">{errors.sick_leave_days.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-rose-500"/> Rujukan
                        </Label>
                        <Controller name="referral" control={control}
                                    render={({field}) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full"><SelectValue
                                                placeholder="Status rujukan"/></SelectTrigger>
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

                    {referralValue && referralValue !== "none" && (
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-600">Tujuan Rujukan <span
                                className="text-destructive">*</span></Label>
                            <Input placeholder="Nama RS / Poli / Dokter tujuan"
                                   {...register("referral_destination", {required: "Tujuan rujukan wajib diisi"})}/>
                            {errors.referral_destination && (
                                <p className="text-xs text-destructive">{errors.referral_destination.message}</p>
                            )}
                        </div>
                    )}
                </SectionCard>

                {/* ── SUBMIT ── */}
                <div className="flex justify-end gap-3 pt-2">
                    <Link to="/outpatient">
                        <Button type="button" variant="outline">Batal</Button>
                    </Link>
                    <Button type="submit" className="gap-2" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <><Loader2 className="w-4 h-4 animate-spin"/> Menyimpan...</>
                        ) : (
                            <><Save className="w-4 h-4"/> Simpan Diagnosis</>
                        )}
                    </Button>
                </div>
            </form>
        </Layout>
    );
}

export default DiagnoseForm;