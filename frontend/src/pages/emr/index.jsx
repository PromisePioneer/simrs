import Layout from "@/pages/dashboard/layout.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {
    FileText, Plus, Search, User, Activity, Stethoscope,
    ClipboardList, Pill, TestTube, Heart, Filter,
    ChevronDown, Thermometer, Wind, Droplets,
    Zap, BadgeCheck, ArrowUpRight, Clock,
    Eye, CalendarDays,
} from "lucide-react";
import {Input} from "@/components/ui/input.jsx";
import {useEffect, useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {usePatientStore} from "@/store/usePatientStore.js";
import {calculateAge} from "@/utils/calculateAge.js";
import {formatDate} from "@/utils/formatDate.js";
import {Link} from "@tanstack/react-router";

/* ─── helpers ───────────────────────────────────────────────── */
const genderLabel = (g) => (g === "wanita" ? "Perempuan" : "Laki-laki");
const genderAccent = (g) =>
    g === "wanita"
        ? {
            bar: "from-pink-400 to-rose-400",
            avatar: "bg-pink-100 text-pink-600",
            badge: "bg-pink-50 text-pink-700 border-pink-200"
        }
        : {
            bar: "from-sky-400 to-blue-500",
            avatar: "bg-sky-100 text-sky-600",
            badge: "bg-sky-50 text-sky-700 border-sky-200"
        };

const visitTypeMeta = {
    umum: {label: "Umum", cls: "bg-violet-50 text-violet-700 border-violet-200"},
    bpjs: {label: "BPJS", cls: "bg-emerald-50 text-emerald-700 border-emerald-200"},
    rujuk: {label: "Rujukan", cls: "bg-amber-50 text-amber-700 border-amber-200"},
};

const diagnosisTypeCls = {
    primary: "bg-red-50 text-red-700 border-red-200",
    secondary: "bg-orange-50 text-orange-700 border-orange-200",
    comorbid: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

const statusMeta = {
    waiting: {label: "Menunggu", cls: "bg-yellow-50 text-yellow-700 border-yellow-200"},
    in_progress: {label: "Berlangsung", cls: "bg-blue-50 text-blue-700 border-blue-200"},
    done: {label: "Selesai", cls: "bg-green-50 text-green-700 border-green-200"},
};

/* ─── Vital chip ────────────────────────────────────────────── */
const VitalChip = ({icon: Icon, label, value, unit, warn}) => (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px] font-medium
        ${warn ? "bg-red-50 border-red-200 text-red-700" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
        <Icon className="w-3 h-3 shrink-0"/>
        <span className="text-muted-foreground font-normal">{label}</span>
        <span>{value}{unit && <span className="text-muted-foreground font-normal ml-0.5">{unit}</span>}</span>
    </div>
);

/* ─── Single Visit Row ──────────────────────────────────────── */
function VisitRow({visit, isLast}) {
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

/* ─── Patient Card ──────────────────────────────────────────── */
function PatientEMRCard({patient}) {
    const [visitsOpen, setVisitsOpen] = useState(false);
    const accent = genderAccent(patient.gender);
    const visits = patient.outpatient_visits ?? [];
    const age = calculateAge(patient.date_of_birth);
    const totalDx = visits.reduce((s, v) => s + (v.diagnoses?.length ?? 0), 0);
    const totalRx = visits.reduce((s, v) => s + (v.prescriptions?.length ?? 0), 0);
    const totalTx = visits.reduce((s, v) => s + (v.procedures?.length ?? 0), 0);

    return (
        <Card
            className="overflow-hidden border border-border/60 hover:border-teal-300 hover:shadow-md transition-all duration-200">
            <CardContent className="p-5">
                {/* identity */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex gap-4 min-w-0">
                        <div
                            className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 font-bold text-lg ${accent.avatar}`}>
                            {patient.full_name.charAt(0)}
                        </div>
                        <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-semibold text-base">{patient.full_name}</h3>
                                <Badge variant="outline"
                                       className={`text-[10px] px-1.5 py-0 ${accent.badge}`}>{genderLabel(patient.gender)}</Badge>
                                {patient.blood_type && (
                                    <Badge variant="outline"
                                           className="text-[10px] px-1.5 py-0">{patient.blood_type.toUpperCase()}</Badge>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><User
                                    className="w-3 h-3"/>{age} tahun • {patient.city_of_birth}</span>
                                <span
                                    className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px]">{patient.medical_record_number}</span>
                                {patient.job && <span>{patient.job}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0">
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8" asChild>
                            <Link to={`/emr/${patient.id}`}><Eye className="w-3.5 h-3.5"/> Detail</Link>
                        </Button>
                        <Button size="sm" className="gap-1.5 text-xs h-8 bg-teal-500 hover:bg-teal-600">
                            <Plus className="w-3.5 h-3.5"/> Catatan
                        </Button>
                    </div>
                </div>

                {/* aggregate summary */}
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

                {/* toggle visits */}
                {visits.length > 0 && (
                    <div className="mt-3">
                        <button
                            type="button"
                            onClick={() => setVisitsOpen((p) => !p)}
                            className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
                        >
                            <ChevronDown className={`w-4 h-4 transition-transform ${visitsOpen ? "rotate-180" : ""}`}/>
                            {visitsOpen ? "Sembunyikan" : "Lihat"} riwayat kunjungan ({visits.length})
                        </button>

                        {visitsOpen && (
                            <div className="mt-4 pl-1">
                                {visits.map((visit, idx) => (
                                    <VisitRow key={visit.id} visit={visit} isLast={idx === visits.length - 1}/>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

/* ─── Page ──────────────────────────────────────────────────── */
function ElectronicMedicalRecordPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const {fetchPatientWhereHasEmr, patientsWhereHasEmr} = usePatientStore();

    useEffect(() => {
        fetchPatientWhereHasEmr({perPage: 20});
    }, []);

    const patients = Array.isArray(patientsWhereHasEmr?.data) ? patientsWhereHasEmr.data : [];

    const filtered = patients.filter((p) => {
        const q = searchQuery.toLowerCase();
        if (!q) return true;
        return (
            p.full_name.toLowerCase().includes(q) ||
            p.medical_record_number.toLowerCase().includes(q) ||
            p.outpatient_visits?.some((v) =>
                v.complain?.toLowerCase().includes(q) ||
                v.diagnoses?.some((d) =>
                    d.description.toLowerCase().includes(q) || d.icd10_code.toLowerCase().includes(q)
                )
            )
        );
    });

    const stats = [
        {
            title: "Total Pasien",
            value: patientsWhereHasEmr?.total ?? "–",
            icon: User,
            color: "bg-teal-500",
            desc: "Pasien terdaftar"
        },
        {title: "Kunjungan Hari Ini", value: "45", icon: Activity, color: "bg-teal-500", desc: "+5% dari kemarin"},
        {title: "Rekam Medis Baru", value: "23", icon: FileText, color: "bg-teal-500", desc: "+8% bulan ini"},
        {title: "Pemeriksaan Aktif", value: "12", icon: Stethoscope, color: "bg-teal-500", desc: "Sedang berjalan"},
    ];

    return (
        <Layout>
            <div className="space-y-6">
                {/* header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500 shadow-lg shadow-teal-200">
                            <FileText className="w-6 h-6 text-white"/>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-teal-600">Rekam Medis Elektronik</h1>
                            <p className="text-sm text-muted-foreground">Kelola rekam medis pasien secara digital</p>
                        </div>
                    </div>
                    <Button className="gap-2 bg-teal-500 hover:bg-teal-600 shadow-md" size="lg">
                        <Plus className="w-4 h-4"/> Tambah Rekam Medis
                    </Button>
                </div>

                {/* stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, i) => (
                        <Card key={i} className="border border-border/60">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className={`${stat.color} p-3 rounded-xl shrink-0`}>
                                    <stat.icon className="w-5 h-5 text-white"/>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">{stat.title}</p>
                                    <p className="text-2xl font-bold leading-tight">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground">{stat.desc}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* patient list */}
                <Card className="border border-border/60">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base">Daftar Rekam Medis Pasien</CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                            {filtered.length} dari {patients.length} pasien
                        </CardDescription>
                        <div className="flex flex-col sm:flex-row gap-3 mt-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    placeholder="Cari nama, No. MR, diagnosis, keluhan…"
                                    className="pl-9 h-9 text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                                <SelectTrigger className="w-full sm:w-[180px] h-9 text-sm">
                                    <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground"/>
                                    <SelectValue placeholder="Filter"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="active">Aktif</SelectItem>
                                    <SelectItem value="completed">Selesai</SelectItem>
                                    <SelectItem value="followup">Follow Up</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                        {filtered.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <FileText className="w-10 h-10 mx-auto mb-3 opacity-30"/>
                                <p className="text-sm">Tidak ada rekam medis ditemukan</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filtered.map((patient) => (
                                    <PatientEMRCard key={patient.id} patient={patient}/>
                                ))}
                            </div>
                        )}
                        {patientsWhereHasEmr?.last_page > 1 && (
                            <div
                                className="flex items-center justify-between mt-4 pt-4 border-t text-xs text-muted-foreground">
                                <span>Halaman {patientsWhereHasEmr.current_page} dari {patientsWhereHasEmr.last_page}</span>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="h-7 text-xs"
                                            disabled={!patientsWhereHasEmr.prev_page_url}>Sebelumnya</Button>
                                    <Button variant="outline" size="sm" className="h-7 text-xs"
                                            disabled={!patientsWhereHasEmr.next_page_url}>Berikutnya</Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* quick actions */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            icon: ClipboardList,
                            color: "bg-blue-100 text-blue-600",
                            label: "Riwayat Pemeriksaan",
                            desc: "Lihat riwayat pemeriksaan pasien"
                        },
                        {
                            icon: Pill,
                            color: "bg-emerald-100 text-emerald-600",
                            label: "Resep Obat",
                            desc: "Kelola resep dan obat pasien"
                        },
                        {
                            icon: TestTube,
                            color: "bg-violet-100 text-violet-600",
                            label: "Hasil Lab",
                            desc: "Lihat hasil laboratorium"
                        },
                        {
                            icon: Heart,
                            color: "bg-red-100 text-red-600",
                            label: "Vital Signs",
                            desc: "Monitor tanda vital pasien"
                        },
                    ].map(({icon: Icon, color, label, desc}) => (
                        <Card key={label}
                              className="hover:shadow-md hover:border-teal-200 transition-all duration-200 cursor-pointer group">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div
                                    className={`${color} p-3 rounded-xl shrink-0 group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-5 h-5"/>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">{label}</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                                </div>
                                <ArrowUpRight
                                    className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity"/>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default ElectronicMedicalRecordPage;