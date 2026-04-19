import {Link, useParams} from "@tanstack/react-router";
import {useOutpatientVisitStore} from "@features/outpatient";
import {useEffect} from "react";
import {Separator} from "@shared/components/ui/separator.jsx";
import {
    User, Stethoscope, Activity, FileText, Pill, ClipboardList,
    Phone, Droplets, Heart, Thermometer, Wind, Gauge, Ruler,
    Weight, AlertCircle, IdCard, BookOpen, UserCheck, ArrowLeft
} from "lucide-react";
import {format} from "date-fns";
import {id as localeId} from "date-fns/locale";
import {cn} from "@shared/lib/utils";
import Layout from "@features/dashboard/pages/layout.jsx";
import {Button} from "@shared/components/ui/button.jsx";

const STATUS_CONFIG = {
    waiting: {label: "Menunggu", cls: "bg-amber-100 text-amber-700 border-amber-200"},
    in_progress: {label: "Dalam Proses", cls: "bg-blue-100 text-blue-700 border-blue-200"},
    done: {label: "Selesai", cls: "bg-emerald-100 text-emerald-700 border-emerald-200"},
    cancelled: {label: "Dibatalkan", cls: "bg-red-100 text-red-700 border-red-200"},
};
const GENDER_MAP = {pria: "Laki-laki", wanita: "Perempuan"};
const RELIGION_MAP = {islam: "Islam", kristen: "Kristen", katolik: "Katolik", hindu: "Hindu", budha: "Budha"};
const BLOOD_MAP = {"ab-": "AB−", "ab+": "AB+", "a+": "A+", "a-": "A−", "b+": "B+", "b-": "B−", "o+": "O+", "o-": "O−"};

function Field({label, value}) {
    return (
        <div className="space-y-0.5">
            <p className="text-[11px] uppercase tracking-wide font-medium text-slate-400">{label}</p>
            <p className="text-sm font-semibold text-slate-800">{value || "—"}</p>
        </div>
    );
}

function SectionTitle({icon: Icon, title, accent = "teal", count}) {
    const colors = {
        teal: "text-teal-600 bg-teal-50",
        violet: "text-violet-600 bg-violet-50",
        rose: "text-rose-600 bg-rose-50",
        amber: "text-amber-600 bg-amber-50",
        sky: "text-sky-600 bg-sky-50",
    };
    return (
        <div className="flex items-center gap-2.5">
            <span className={cn("p-1.5 rounded-lg", colors[accent])}>
                <Icon className="w-[15px] h-[15px]"/>
            </span>
            <span className="font-semibold text-slate-700 text-[15px]">{title}</span>
            {count !== undefined && (
                <span
                    className="ml-auto text-xs font-medium text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">{count}</span>
            )}
        </div>
    );
}

function Panel({children, className}) {
    return <div
        className={cn("bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden", className)}>{children}</div>;
}

function PanelHeader({children}) {
    return <div className="px-5 py-4 border-b border-slate-100">{children}</div>;
}

function PanelBody({children, className}) {
    return <div className={cn("px-5 py-4", className)}>{children}</div>;
}

function VitalCard({icon: Icon, label, value, unit, color = "slate"}) {
    const colors = {
        slate: {bg: "bg-slate-50", icon: "text-slate-400", val: "text-slate-800"},
        teal: {bg: "bg-teal-50", icon: "text-teal-500", val: "text-teal-700"},
        rose: {bg: "bg-rose-50", icon: "text-rose-500", val: "text-rose-700"},
        amber: {bg: "bg-amber-50", icon: "text-amber-500", val: "text-amber-700"},
        sky: {bg: "bg-sky-50", icon: "text-sky-500", val: "text-sky-700"},
        violet: {bg: "bg-violet-50", icon: "text-violet-500", val: "text-violet-700"},
    };
    const c = colors[color];
    return (
        <div className={cn("rounded-xl p-4 flex flex-col gap-2", c.bg)}>
            <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wide font-medium text-slate-400">{label}</span>
                <Icon className={cn("w-4 h-4", c.icon)}/>
            </div>
            <div className="flex items-baseline gap-1">
                <span className={cn("text-2xl font-bold", c.val)}>{value ?? "—"}</span>
                {value != null && <span className="text-xs text-slate-400 font-medium">{unit}</span>}
            </div>
        </div>
    );
}

function OutpatientVisitDetail(opts) {
    const {id} = useParams(opts);
    const {showOutPatientVisit, outpatientVisitValue} = useOutpatientVisitStore();

    useEffect(() => {
        showOutPatientVisit(id);
    }, [id]);

    if (!outpatientVisitValue) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"/>
                    <p className="text-sm text-slate-400">Memuat data kunjungan...</p>
                </div>
            </div>
        );
    }

    const visit = outpatientVisitValue;
    const {patient, doctor, vital_sign, diagnoses = [], procedures = [], prescriptions = []} = visit;
    const status = STATUS_CONFIG[visit.status] ?? {label: visit.status, cls: "bg-slate-100 text-slate-600"};

    return (
        <Layout>
            <div className="space-y-5 ">
                <div className="flex items-center justify-between">
                    <Link to="/outpatient?tab=outpatient-visit">
                        <Button type="button" variant="outline" size="sm" className="gap-2">
                            <ArrowLeft className="w-4 h-4"/>
                            Kembali ke Rawat Jalan
                        </Button>
                    </Link>
                </div>
                {/* Header */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-widest text-slate-400 mb-1">Rawat Jalan</p>
                        <h1 className="text-2xl font-bold text-slate-800 leading-tight">Detail Kunjungan</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            {visit.date ? format(new Date(visit.date), "EEEE, dd MMMM yyyy · HH:mm", {locale: localeId}) : "—"}
                        </p>
                    </div>
                    <span className={cn("text-sm font-semibold px-4 py-1.5 rounded-full border", status.cls)}>
                    {status.label}
                </span>
                </div>

                {/* Row 1: Pasien + Dokter/Keluhan */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                    <Panel className="lg:col-span-3">
                        <PanelHeader><SectionTitle icon={User} title="Informasi Pasien" accent="teal"/></PanelHeader>
                        <PanelBody className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                                    <User className="w-6 h-6 text-teal-600"/>
                                </div>
                                <div>
                                    <p className="text-base font-bold text-slate-800">{patient?.full_name}</p>
                                    <p className="text-xs text-slate-400 font-mono mt-0.5">{patient?.medical_record_number}</p>
                                </div>
                                <div className="ml-auto">
                                <span
                                    className="text-sm font-bold px-3 py-1 rounded-lg bg-red-50 text-red-600 border border-red-100">
                                    {BLOOD_MAP[patient?.blood_type] ?? patient?.blood_type ?? "—"}
                                </span>
                                </div>
                            </div>

                            <Separator className="bg-slate-100"/>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <Field label="Jenis Kelamin" value={GENDER_MAP[patient?.gender] ?? patient?.gender}/>
                                <Field label="Tanggal Lahir"
                                       value={patient?.date_of_birth ? format(new Date(patient.date_of_birth), "dd MMM yyyy", {locale: localeId}) : null}/>
                                <Field label="Kota Lahir" value={patient?.city_of_birth}/>
                                <Field label="Agama" value={RELIGION_MAP[patient?.religion] ?? patient?.religion}/>
                                <Field label="Pekerjaan" value={patient?.job}/>
                                <Field label="No. KIS" value={patient?.kis_number}/>
                            </div>

                            <Separator className="bg-slate-100"/>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                        <Phone className="w-3.5 h-3.5 text-slate-500"/>
                                    </div>
                                    <div>
                                        <p className="text-[11px] uppercase tracking-wide font-medium text-slate-400">Telepon</p>
                                        <p className="text-sm font-semibold text-slate-800">{patient?.phone ?? "—"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                        <IdCard className="w-3.5 h-3.5 text-slate-500"/>
                                    </div>
                                    <div>
                                        <p className="text-[11px] uppercase tracking-wide font-medium text-slate-400">No.
                                            KTP</p>
                                        <p className="text-sm font-semibold text-slate-800 font-mono">{patient?.id_card_number ?? "—"}</p>
                                    </div>
                                </div>
                            </div>
                        </PanelBody>
                    </Panel>

                    <div className="lg:col-span-2 flex flex-col gap-5">
                        <Panel>
                            <PanelHeader><SectionTitle icon={Stethoscope} title="Dokter Pemeriksa"
                                                       accent="violet"/></PanelHeader>
                            <PanelBody className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                                        <UserCheck className="w-5 h-5 text-violet-600"/>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{doctor?.full_name_with_degrees ?? doctor?.name ?? "—"}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{visit.type === "non_rujuk" ? "Non Rujukan" : "Rujukan"}</p>
                                    </div>
                                </div>
                                {(visit.referred_hospital || visit.referred_doctor) && (
                                    <>
                                        <Separator className="bg-slate-100"/>
                                        <div className="space-y-2">
                                            {visit.referred_hospital &&
                                                <Field label="RS Perujuk" value={visit.referred_hospital}/>}
                                            {visit.referred_doctor &&
                                                <Field label="Dokter Perujuk" value={visit.referred_doctor}/>}
                                        </div>
                                    </>
                                )}
                            </PanelBody>
                        </Panel>

                        <Panel className="flex-1">
                            <PanelHeader><SectionTitle icon={AlertCircle} title="Keluhan Utama"
                                                       accent="rose"/></PanelHeader>
                            <PanelBody>
                                <p className="text-sm text-slate-700 leading-relaxed">
                                    {visit.complain ||
                                        <span className="text-slate-400 italic">Tidak ada keluhan tercatat</span>}
                                </p>
                            </PanelBody>
                        </Panel>
                    </div>
                </div>

                {/* Row 2: Vital Signs */}
                {vital_sign && (
                    <Panel>
                        <PanelHeader><SectionTitle icon={Activity} title="Tanda-Tanda Vital"
                                                   accent="sky"/></PanelHeader>
                        <PanelBody>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                <VitalCard icon={Ruler} label="Tinggi Badan" value={vital_sign.height} unit="cm"
                                           color="slate"/>
                                <VitalCard icon={Weight} label="Berat Badan" value={vital_sign.weight} unit="kg"
                                           color="slate"/>
                                <VitalCard icon={Thermometer} label="Suhu Tubuh" value={vital_sign.temperature}
                                           unit="°C" color="amber"/>
                                <VitalCard icon={Heart} label="Nadi" value={vital_sign.pulse_rate} unit="bpm"
                                           color="rose"/>
                                <VitalCard icon={Wind} label="Frekuensi Napas" value={vital_sign.respiratory_frequency}
                                           unit="x/mnt" color="sky"/>
                                <VitalCard icon={Gauge} label="Sistol" value={vital_sign.systolic} unit="mmHg"
                                           color="violet"/>
                                <VitalCard icon={Gauge} label="Diastol" value={vital_sign.diastolic} unit="mmHg"
                                           color="violet"/>
                                <VitalCard icon={Droplets} label="Gula Darah" value={vital_sign.blood_sugar}
                                           unit="mg/dL" color="teal"/>
                                <VitalCard icon={Activity} label="Saturasi O₂" value={vital_sign.oxygen_saturation}
                                           unit="%" color="teal"/>
                                <VitalCard icon={Ruler} label="Lingkar Perut" value={vital_sign.abdominal_circumference}
                                           unit="cm" color="slate"/>
                            </div>
                        </PanelBody>
                    </Panel>
                )}

                {/* Row 3: Diagnosa + Prosedur */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Panel>
                        <PanelHeader><SectionTitle icon={BookOpen} title="Diagnosa" accent="teal"
                                                   count={diagnoses.length}/></PanelHeader>
                        <PanelBody>
                            {diagnoses.length > 0 ? (
                                <div className="space-y-2">
                                    {diagnoses.map((d, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                                            <div className="flex flex-col gap-1 shrink-0">
                                                <span
                                                    className="text-xs font-bold font-mono bg-teal-100 text-teal-700 px-2 py-0.5 rounded-lg text-center">{d.icd10_code}</span>
                                                <span
                                                    className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-center",
                                                        d.type === "primary" ? "bg-teal-100 text-teal-700" :
                                                            d.type === "secondary" ? "bg-blue-100 text-blue-700" :
                                                                "bg-orange-100 text-orange-700"
                                                    )}>
                                                {d.type === "primary" ? "Primer" : d.type === "secondary" ? "Sekunder" : "Komorbid"}
                                            </span>
                                            </div>
                                            <p className="text-sm text-slate-700 leading-relaxed">{d.description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 gap-2">
                                    <BookOpen className="w-8 h-8 text-slate-200"/>
                                    <p className="text-sm text-slate-400">Belum ada diagnosa</p>
                                </div>
                            )}
                        </PanelBody>
                    </Panel>

                    <Panel>
                        <PanelHeader><SectionTitle icon={ClipboardList} title="Prosedur" accent="violet"
                                                   count={procedures.length}/></PanelHeader>
                        <PanelBody>
                            {procedures.length > 0 ? (
                                <div className="space-y-2">
                                    {procedures.map((p, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                                            <span
                                                className="text-xs font-bold font-mono bg-violet-100 text-violet-700 px-2 py-0.5 rounded-lg shrink-0 mt-0.5">{p.icd9_code}</span>
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <p className="text-sm text-slate-700 leading-relaxed">{p.description}</p>
                                                {p.procedure_date && (
                                                    <p className="text-xs text-slate-400">
                                                        {format(new Date(p.procedure_date), "dd MMM yyyy · HH:mm", {locale: localeId})}
                                                    </p>
                                                )}
                                                {p.notes && <p className="text-xs text-slate-500 italic">{p.notes}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 gap-2">
                                    <ClipboardList className="w-8 h-8 text-slate-200"/>
                                    <p className="text-sm text-slate-400">Belum ada prosedur</p>
                                </div>
                            )}
                        </PanelBody>
                    </Panel>
                </div>

                {/* Row 4: Resep */}
                <Panel>
                    <PanelHeader><SectionTitle icon={Pill} title="Resep Obat" accent="amber"
                                               count={prescriptions.length}/></PanelHeader>
                    <PanelBody className="p-0">
                        {prescriptions.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        {["Obat", "Dosis", "Frekuensi", "Rute", "Durasi", "Qty", "Catatan", "Status"].map(h => (
                                            <th key={h}
                                                className="text-left px-5 py-3 text-[11px] uppercase tracking-wide font-semibold text-slate-400">{h}</th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                    {prescriptions.map((rx) => (
                                        <tr key={rx.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="px-5 py-3.5 font-medium text-slate-800">{rx.medicine?.name ?? rx.medicine_id}</td>
                                            <td className="px-5 py-3.5 text-slate-600">{rx.dosage}</td>
                                            <td className="px-5 py-3.5 text-slate-600">{rx.frequency}</td>
                                            <td className="px-5 py-3.5 text-slate-600 capitalize">{rx.route}</td>
                                            <td className="px-5 py-3.5 text-slate-600">{rx.duration}</td>
                                            <td className="px-5 py-3.5 font-semibold text-slate-800">{parseFloat(rx.quantity)}</td>
                                            <td className="px-5 py-3.5 text-slate-500 text-xs italic max-w-[140px]">{rx.notes ?? "—"}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={cn(
                                                    "text-xs font-semibold px-2.5 py-1 rounded-full",
                                                    rx.status === "draft" ? "bg-slate-100 text-slate-500" : "bg-emerald-100 text-emerald-700"
                                                )}>
                                                    {rx.status === "draft" ? "Draft" : rx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 gap-2">
                                <Pill className="w-8 h-8 text-slate-200"/>
                                <p className="text-sm text-slate-400">Belum ada resep obat</p>
                            </div>
                        )}
                    </PanelBody>
                </Panel>
            </div>
        </Layout>
    );
}

export default OutpatientVisitDetail;