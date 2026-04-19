import {useState} from "react";
import {
    Activity,
    BadgeCheck,
    ChevronDown,
    ClipboardList,
    Clock, Droplets,
    Heart,
    Pill,
    Stethoscope,
    Thermometer, User,
    Wind, Zap
} from "lucide-react";
import {formatDate} from "@shared/utils";
import {Badge} from "@shared/components/ui/badge.jsx";
import {VitalChip} from "@features/emr/components/vital-chip.jsx";


const visitTypeMeta = {
    umum: {label: "Umum", cls: "bg-violet-50 text-violet-700 border-violet-200"},
    bpjs: {label: "BPJS", cls: "bg-emerald-50 text-emerald-700 border-emerald-200"},
    rujuk: {label: "Rujukan", cls: "bg-amber-50 text-amber-700 border-amber-200"},
};


const statusMeta = {
    waiting: {label: "Menunggu", cls: "bg-yellow-50 text-yellow-700 border-yellow-200"},
    in_progress: {label: "Berlangsung", cls: "bg-blue-50 text-blue-700 border-blue-200"},
    done: {label: "Selesai", cls: "bg-green-50 text-green-700 border-green-200"},
};


const diagnosisTypeCls = {
    primary: "bg-red-50 text-red-700 border-red-200",
    secondary: "bg-orange-50 text-orange-700 border-orange-200",
    comorbid: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

function VisitRow({visit, index, isLast}) {
    const [open, setOpen] = useState(true);
    const v = visit.vital_sign;
    const meta = visitTypeMeta[visit.type] ?? {label: visit.type, cls: ""};
    const sm = statusMeta[visit.status] ?? {label: visit.status, cls: ""};

    return (
        <div className="relative pl-6">
            {/* vertical line */}
            {!isLast && (
                <span className="absolute left-[9px] top-5 bottom-0 w-px bg-border"/>
            )}
            {/* dot */}
            <span
                className="absolute left-0 top-3.5 w-[18px] h-[18px] rounded-full border-2 border-teal-400 bg-white flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-teal-400"/>
            </span>

            <div
                className={`mb-3 rounded-lg border border-border/60 overflow-hidden transition-shadow ${open ? "shadow-sm" : "hover:shadow-sm"}`}>
                {/* always-visible header */}
                <button
                    type="button"
                    onClick={() => setOpen((p) => !p)}
                    className="w-full flex flex-col sm:flex-row sm:items-center gap-2 px-4 py-3 text-left hover:bg-muted/40 transition-colors"
                >
                    <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3"/>{formatDate(visit.date)}
                        </span>
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${meta.cls}`}>{meta.label}</Badge>
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${sm.cls}`}>{sm.label}</Badge>
                        {visit.doctor && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Stethoscope className="w-3 h-3"/>{visit.doctor.name}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-xs text-muted-foreground">
                        {visit.diagnoses?.length > 0 && (
                            <span className="flex items-center gap-1"><BadgeCheck
                                className="w-3.5 h-3.5 text-teal-500"/>{visit.diagnoses.length} Dx</span>
                        )}
                        {visit.procedures?.length > 0 && (
                            <span className="flex items-center gap-1"><ClipboardList
                                className="w-3.5 h-3.5 text-sky-500"/>{visit.procedures.length} Tx</span>
                        )}
                        {visit.prescriptions?.length > 0 && (
                            <span className="flex items-center gap-1"><Pill
                                className="w-3.5 h-3.5 text-violet-500"/>{visit.prescriptions.length} Rx</span>
                        )}
                        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}/>
                    </div>
                </button>

                {/* complain preview when collapsed */}
                {visit.complain && !open && (
                    <div className="px-4 pb-2.5 text-xs text-slate-500 italic truncate">
                        Keluhan: {visit.complain}
                    </div>
                )}

                {/* expanded */}
                {open && (
                    <div className="px-4 pb-4 space-y-4 border-t border-dashed">
                        {visit.complain && (
                            <div className="pt-3">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Keluhan</p>
                                <p className="text-sm">{visit.complain}</p>
                            </div>
                        )}

                        {v && (
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Tanda
                                    Vital</p>
                                <div className="flex flex-wrap gap-1.5">
                                    <VitalChip icon={Thermometer} label="Suhu" value={v.temperature} unit="°C"
                                               warn={v.temperature > 37.5}/>
                                    <VitalChip icon={Heart} label="Nadi" value={v.pulse_rate} unit="bpm"
                                               warn={v.pulse_rate > 100 || v.pulse_rate < 60}/>
                                    <VitalChip icon={Wind} label="RR" value={v.respiratory_frequency} unit="/mnt"
                                               warn={v.respiratory_frequency > 20}/>
                                    <VitalChip icon={Activity} label="TD" value={`${v.systolic}/${v.diastolic}`}
                                               unit="mmHg" warn={v.systolic > 140}/>
                                    <VitalChip icon={Droplets} label="SpO₂" value={v.oxygen_saturation} unit="%"
                                               warn={v.oxygen_saturation < 95}/>
                                    <VitalChip icon={Zap} label="GDS" value={v.blood_sugar} unit="mg/dL"
                                               warn={v.blood_sugar > 200}/>
                                    <VitalChip icon={User} label="BB/TB" value={`${v.weight}kg / ${v.height}cm`}/>
                                </div>
                            </div>
                        )}

                        {visit.diagnoses?.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Diagnosis</p>
                                <div className="space-y-1.5">
                                    {visit.diagnoses.map((d) => (
                                        <div key={d.id} className="flex items-start gap-2 text-xs">
                                            <Badge variant="outline"
                                                   className={`text-[10px] px-1.5 py-0 shrink-0 ${diagnosisTypeCls[d.type] ?? ""}`}>{d.type}</Badge>
                                            <span
                                                className="font-mono text-muted-foreground shrink-0">{d.icd10_code}</span>
                                            <span className="text-slate-700 flex-1">{d.description}</span>
                                            {d.is_confirmed &&
                                                <BadgeCheck className="w-3.5 h-3.5 text-teal-500 shrink-0"/>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {visit.procedures?.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Tindakan</p>
                                <div className="space-y-1.5">
                                    {visit.procedures.map((p) => (
                                        <div key={p.id} className="flex items-start gap-2 text-xs">
                                            <Badge variant="outline"
                                                   className="text-[10px] px-1.5 py-0 bg-sky-50 text-sky-700 border-sky-200 shrink-0">{p.icd9_code}</Badge>
                                            <span className="text-slate-700 flex-1">{p.description}</span>
                                            {p.procedure_date && <span
                                                className="text-muted-foreground shrink-0">{formatDate(p.procedure_date)}</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {visit.prescriptions?.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Resep</p>
                                <div className="space-y-1.5">
                                    {visit.prescriptions.map((rx) => (
                                        <div key={rx.id} className="flex items-center gap-2 text-xs">
                                            <Pill className="w-3.5 h-3.5 text-violet-500 shrink-0"/>
                                            <span className="text-slate-700">{rx.medicine_name}</span>
                                            {rx.dosage && <span className="text-muted-foreground">— {rx.dosage}</span>}
                                            {rx.frequency && <Badge variant="outline"
                                                                    className="text-[10px] px-1.5 py-0">{rx.frequency}</Badge>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}


export default VisitRow;