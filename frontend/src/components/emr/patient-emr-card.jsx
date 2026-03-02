import {Card, CardContent} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {useState} from "react";
import {
    Plus, User, ClipboardList, Pill, ChevronDown, BadgeCheck,
    Eye, CalendarDays, Stethoscope, Activity, Heart, Thermometer,
    Wind, Droplets, Weight, Ruler, StickyNote,
    Hash, Repeat2, Timer, Route, Package,
} from "lucide-react";
import {calculateAge} from "@/utils/calculateAge.js";
import {Badge} from "@/components/ui/badge.jsx";
import {Link} from "@tanstack/react-router";
import {formatDate} from "@/utils/formatDate.js";
import {ListCard} from "@/components/common/list-card.jsx";

/* ─── Helpers ───────────────────────────────────────────────── */
const genderLabel = (g) => (g === "wanita" ? "Perempuan" : "Laki-laki");
const genderAccent = (g) =>
    g === "wanita"
        ? {avatar: "bg-pink-100 text-pink-600", badge: "bg-pink-50 text-pink-700 border-pink-200"}
        : {avatar: "bg-sky-100 text-sky-600", badge: "bg-sky-50 text-sky-700 border-sky-200"};

const visitStatusMeta = {
    waiting: {label: "Menunggu", className: "bg-yellow-50 text-yellow-700 border-yellow-200"},
    in_progress: {label: "Berlangsung", className: "bg-blue-50 text-blue-700 border-blue-200"},
    completed: {label: "Selesai", className: "bg-emerald-50 text-emerald-700 border-emerald-200"},
};

const visitAccentBar = {
    waiting: "from-yellow-400 to-amber-400",
    in_progress: "from-blue-400 to-sky-400",
    completed: "from-emerald-400 to-teal-400",
};

const prescriptionStatusMeta = {
    draft: {label: "Draft", className: "bg-slate-50 text-slate-600 border-slate-200"},
    pending: {label: "Menunggu", className: "bg-yellow-50 text-yellow-700 border-yellow-200"},
    processing: {label: "Diproses", className: "bg-blue-50 text-blue-700 border-blue-200"},
    dispensed: {label: "Diserahkan", className: "bg-emerald-50 text-emerald-700 border-emerald-200"},
    cancelled: {label: "Dibatalkan", className: "bg-red-50 text-red-700 border-red-200"},
};

const routeLabel = {
    oral: "Oral (PO)", iv: "Intravena (IV)", im: "Intramuskular (IM)",
    sc: "Subkutan (SC)", topical: "Topikal", inhalasi: "Inhalasi", suppositoria: "Suppositoria",
};

const frequencyLabel = {
    "1x1": "1×1 (Sekali sehari)", "2x1": "2×1 (Dua kali sehari)",
    "3x1": "3×1 (Tiga kali sehari)", "4x1": "4×1 (Empat kali sehari)", prn: "p.r.n",
};

/* ─── Vital Sign Grid ───────────────────────────────────────── */
function VitalSigns({vs}) {
    if (!vs) return null;
    const items = [
        {icon: Ruler, label: "Tinggi Badan", value: vs.height, unit: "cm", color: "text-sky-500"},
        {icon: Weight, label: "Berat Badan", value: vs.weight, unit: "kg", color: "text-sky-500"},
        {icon: Thermometer, label: "Suhu", value: vs.temperature, unit: "°C", color: "text-orange-500"},
        {icon: Heart, label: "Nadi", value: vs.pulse_rate, unit: "bpm", color: "text-red-500"},
        {icon: Wind, label: "Frekuensi Napas", value: vs.respiratory_frequency, unit: "x/mnt", color: "text-teal-500"},
        {
            icon: Activity,
            label: "Tekanan Darah",
            value: vs.systolic && vs.diastolic ? `${vs.systolic}/${vs.diastolic}` : null,
            unit: "mmHg",
            color: "text-violet-500"
        },
        {icon: Droplets, label: "Gula Darah", value: vs.blood_sugar, unit: "mg/dL", color: "text-amber-500"},
        {icon: Activity, label: "SpO₂", value: vs.oxygen_saturation, unit: "%", color: "text-blue-500"},
    ].filter(i => i.value !== null && i.value !== undefined);

    if (items.length === 0) return null;

    return (
        <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Tanda
                Vital</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {items.map(({icon: Icon, label, value, unit, color}) => (
                    <div key={label}
                         className="flex flex-col gap-0.5 rounded-lg bg-white border border-border/50 px-3 py-2">
                        <div className="flex items-center gap-1">
                            <Icon className={`w-3 h-3 ${color}`}/>
                            <span className="text-[10px] text-muted-foreground">{label}</span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                            {value} <span className="text-[10px] font-normal text-muted-foreground">{unit}</span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Diagnoses Section ─────────────────────────────────────── */
function DiagnosesSection({diagnoses}) {
    if (!diagnoses?.length) return null;
    return (
        <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Diagnosis</p>
            <div className="space-y-1.5">
                {diagnoses.map((d) => (
                    <div key={d.id}
                         className="flex items-start gap-2 text-xs rounded-lg bg-white border border-border/50 px-3 py-2">
                        <BadgeCheck className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0"/>
                        <div className="flex-1 min-w-0">
                            <span className="font-mono text-[10px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded mr-2">
                                {d.icd10_code}
                            </span>
                            <span className="text-foreground">{d.description}</span>
                        </div>
                        <div className="flex gap-1 shrink-0">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {d.type === "primary" ? "Primer" : "Sekunder"}
                            </Badge>
                            {d.is_confirmed && (
                                <Badge variant="outline"
                                       className="text-[10px] px-1.5 py-0 bg-emerald-50 text-emerald-700 border-emerald-200">
                                    Confirmed
                                </Badge>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Procedures Section ────────────────────────────────────── */
function ProceduresSection({procedures}) {
    if (!procedures?.length) return null;
    return (
        <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Tindakan</p>
            <div className="space-y-1.5">
                {procedures.map((proc) => (
                    <div key={proc.id}
                         className="flex items-start gap-2 text-xs rounded-lg bg-white border border-border/50 px-3 py-2">
                        <ClipboardList className="w-3.5 h-3.5 text-sky-500 mt-0.5 shrink-0"/>
                        <div className="flex-1 min-w-0">
                            <span className="font-mono text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded mr-2">
                                {proc.icd9_code}
                            </span>
                            <span className="text-foreground">{proc.description}</span>
                        </div>
                        {proc.procedure_date && (
                            <span
                                className="text-[10px] text-muted-foreground shrink-0">{formatDate(proc.procedure_date)}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Prescriptions Section ─────────────────────────────────── */
function PrescriptionsSection({prescriptions}) {
    if (!prescriptions?.length) return null;
    return (
        <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Resep Obat</p>
            <div className="space-y-2">
                {prescriptions.map((p) => {
                    const rxStatus = prescriptionStatusMeta[p.status] ?? {label: p.status, className: ""};
                    return (
                        <div key={p.id}
                             className="rounded-lg bg-white border border-border/50 px-3 py-2.5 space-y-2 text-xs">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <Pill className="w-3.5 h-3.5 text-violet-500 shrink-0"/>
                                    <span className="font-semibold text-foreground">
                                        {p.medicine?.name ?? p.medicine_name ?? "—"}
                                    </span>
                                </div>
                                <Badge variant="outline"
                                       className={`text-[10px] px-1.5 py-0 shrink-0 ${rxStatus.className}`}>
                                    {rxStatus.label}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-muted-foreground">
                                {p.dosage && <span className="flex items-center gap-1"><Hash
                                    className="w-3 h-3"/> {p.dosage}</span>}
                                {p.frequency && <span className="flex items-center gap-1"><Repeat2
                                    className="w-3 h-3"/> {frequencyLabel[p.frequency] ?? p.frequency}</span>}
                                {p.duration &&
                                    <span className="flex items-center gap-1"><Timer className="w-3 h-3"/> {p.duration}</span>}
                                {p.route && <span className="flex items-center gap-1"><Route
                                    className="w-3 h-3"/> {routeLabel[p.route] ?? p.route}</span>}
                                {p.quantity && <span className="flex items-center gap-1"><Package
                                    className="w-3 h-3"/> {p.quantity} unit</span>}
                            </div>
                            {p.notes && (
                                <div
                                    className="flex items-start gap-1.5 text-muted-foreground pt-1 border-t border-dashed">
                                    <StickyNote className="w-3 h-3 text-amber-500 mt-0.5 shrink-0"/>
                                    <span className="italic">{p.notes}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ─── Visit Detail ──────────────────────────────────────────── */
function VisitDetail({visit}) {
    return (
        <div className="space-y-4">
            <VitalSigns vs={visit.vital_sign}/>
            <DiagnosesSection diagnoses={visit.diagnoses}/>
            <ProceduresSection procedures={visit.procedures}/>
            <PrescriptionsSection prescriptions={visit.prescriptions}/>
            {!visit.vital_sign && !visit.diagnoses?.length && !visit.procedures?.length && !visit.prescriptions?.length && (
                <p className="text-xs text-muted-foreground text-center py-2">Belum ada data detail kunjungan.</p>
            )}
        </div>
    );
}

/* ─── Main Component ────────────────────────────────────────── */
function PatientEMRCard({patient}) {
    const [visitsOpen, setVisitsOpen] = useState(false);
    const accent = genderAccent(patient.gender);
    const visits = patient.outpatient_visits ?? [];
    const age = calculateAge(patient.date_of_birth);
    const totalDx = visits.reduce((s, v) => s + (v.diagnoses?.length ?? 0), 0);
    const totalRx = visits.reduce((s, v) => s + (v.prescriptions?.length ?? 0), 0);
    const totalTx = visits.reduce((s, v) => s + (v.procedures?.length ?? 0), 0);

    // Hentikan bubble dari tombol & ListCard supaya tidak trigger toggle
    const stopProp = (e) => e.stopPropagation();

    return (
        <Card
            className="overflow-hidden border border-border/60 hover:border-teal-300 hover:cursor-pointer hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => visits.length > 0 && setVisitsOpen((p) => !p)}
        >
            <CardContent className="p-5">
                {/* ── Identity ── */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex gap-4 min-w-0">
                        <div
                            className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 font-bold text-lg ${accent.avatar}`}>
                            {patient.full_name.charAt(0)}
                        </div>
                        <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-semibold text-base">{patient.full_name}</h3>
                                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${accent.badge}`}>
                                    {genderLabel(patient.gender)}
                                </Badge>
                                {patient.blood_type && (
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                        {patient.blood_type.toUpperCase()}
                                    </Badge>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <User className="w-3 h-3"/>{age} tahun • {patient.city_of_birth}
                                </span>
                                <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px]">
                                    {patient.medical_record_number}
                                </span>
                                {patient.job && <span>{patient.job}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Tombol harus stopPropagation supaya tidak trigger toggle card */}
                    <div className="flex sm:flex-col gap-2 shrink-0" onClick={stopProp}>
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8" asChild>
                            <Link to={`/emr/${patient.id}`}><Eye className="w-3.5 h-3.5"/> Detail</Link>
                        </Button>
                        <Button size="sm" className="gap-1.5 text-xs h-8 bg-teal-500 hover:bg-teal-600">
                            <Plus className="w-3.5 h-3.5"/> Catatan
                        </Button>
                    </div>
                </div>

                {/* ── Aggregate Summary ── */}
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-teal-500"/>
                        <strong className="text-foreground">{visits.length}</strong> kunjungan
                    </span>
                    {totalDx > 0 && (
                        <span className="flex items-center gap-1.5">
                            <BadgeCheck className="w-3.5 h-3.5 text-teal-500"/>
                            <strong className="text-foreground">{totalDx}</strong> diagnosis
                        </span>
                    )}
                    {totalTx > 0 && (
                        <span className="flex items-center gap-1.5">
                            <ClipboardList className="w-3.5 h-3.5 text-sky-500"/>
                            <strong className="text-foreground">{totalTx}</strong> tindakan
                        </span>
                    )}
                    {totalRx > 0 && (
                        <span className="flex items-center gap-1.5">
                            <Pill className="w-3.5 h-3.5 text-violet-500"/>
                            <strong className="text-foreground">{totalRx}</strong> resep
                        </span>
                    )}
                </div>

                {/* ── Toggle Visits ── */}
                {visits.length > 0 && (
                    <div className="mt-3">
                        {/* Animated expand — stopProp supaya klik ListCard tidak bubble ke card parent */}
                        <div
                            className="overflow-hidden transition-all duration-300 ease-in-out"
                            style={{
                                maxHeight: visitsOpen ? `${visits.length * 800}px` : "0px",
                                opacity: visitsOpen ? 1 : 0,
                            }}
                            onClick={stopProp}
                        >
                            <div className="mt-4 space-y-3">
                                {visits.map((visit, index) => {
                                    const statusMeta = visitStatusMeta[visit.status] ?? {
                                        label: visit.status,
                                        className: ""
                                    };
                                    const doctor = visit.doctor;

                                    return (
                                        <ListCard
                                            key={visit.id}
                                            index={index}
                                            accentColor={visitAccentBar[visit.status] ?? "from-slate-300 to-slate-400"}
                                            icon={<CalendarDays className="w-5 h-5 text-teal-500"/>}
                                            iconBg="bg-teal-50 border border-teal-100"
                                            title={formatDate(visit.date)}
                                            badges={[
                                                {label: statusMeta.label, className: statusMeta.className},
                                                ...(visit.type === "rujuk" ? [{
                                                    label: "Rujukan",
                                                    className: "bg-purple-50 text-purple-700 border-purple-200",
                                                }] : []),
                                            ]}
                                            meta={[
                                                ...(visit.complain ? [{icon: StickyNote, label: visit.complain}] : []),
                                                ...(doctor ? [{icon: Stethoscope, label: doctor.name}] : []),
                                                ...(visit.diagnoses?.length ? [{
                                                    icon: BadgeCheck,
                                                    label: `${visit.diagnoses.length} diagnosis`
                                                }] : []),
                                                ...(visit.procedures?.length ? [{
                                                    icon: ClipboardList,
                                                    label: `${visit.procedures.length} tindakan`
                                                }] : []),
                                                ...(visit.prescriptions?.length ? [{
                                                    icon: Pill,
                                                    label: `${visit.prescriptions.length} resep`
                                                }] : []),
                                            ]}
                                            detail={<VisitDetail visit={visit}/>}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default PatientEMRCard;