import {useEffect, useState} from "react";
import {Link} from "@tanstack/react-router";
import Layout from "@/pages/dashboard/layout.jsx";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select.jsx";
import {
    Pill, Search, Filter, X, Clock, CheckCircle, AlertCircle,
    PackageCheck, Eye, Printer, ChevronRight, User, Stethoscope,
    CalendarDays, Hash, Repeat2, Timer, Route, StickyNote, Package,
    FlaskConical,
} from "lucide-react";
import {usePrescriptionStore} from "@/store/prescriptionStore.js";
import {formatDate} from "@/utils/formatDate.js";

/* ─── Status meta ───────────────────────────────────────────── */
const statusMeta = {
    pending: {
        label: "Menunggu",
        icon: Clock,
        cls: "bg-yellow-50 text-yellow-700 border-yellow-200",
        dot: "bg-yellow-400",
    },
    processing: {
        label: "Diproses",
        icon: FlaskConical,
        cls: "bg-blue-50 text-blue-700 border-blue-200",
        dot: "bg-blue-400",
    },
    dispensed: {
        label: "Diserahkan",
        icon: PackageCheck,
        cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-400",
    },
    cancelled: {
        label: "Dibatalkan",
        icon: X,
        cls: "bg-red-50 text-red-700 border-red-200",
        dot: "bg-red-400",
    },
};

const routeLabel = {
    oral: "Oral (PO)",
    iv: "Intravena (IV)",
    im: "Intramuskular (IM)",
    sc: "Subkutan (SC)",
    topical: "Topikal",
    inhalasi: "Inhalasi",
    suppositoria: "Suppositoria",
};

const frequencyLabel = {
    "1x1": "1×1 — Sekali sehari",
    "2x1": "2×1 — Dua kali sehari",
    "3x1": "3×1 — Tiga kali sehari",
    "4x1": "4×1 — Empat kali sehari",
    prn: "Jika perlu (p.r.n)",
};

/* ─── Status Badge ──────────────────────────────────────────── */
const StatusBadge = ({status}) => {
    const m = statusMeta[status] ?? {label: status, cls: "", dot: "bg-slate-400", icon: Clock};
    const Icon = m.icon;
    return (
        <Badge variant="outline" className={`gap-1 text-[11px] px-2 py-0.5 ${m.cls}`}>
            <Icon className="w-3 h-3"/>
            {m.label}
        </Badge>
    );
};

/* ─── Prescription Card ─────────────────────────────────────── */
function PrescriptionCard({prescription, onUpdateStatus}) {
    const [expanded, setExpanded] = useState(false);
    const visit = prescription.outpatient_visit;
    const patient = visit?.patient;
    const doctor = visit?.doctor;

    return (
        <Card
            className="overflow-hidden border border-border/60 hover:border-teal-300 hover:shadow-md transition-all duration-200">
            {/* colour accent */}
            <div className={`h-1 w-full ${
                prescription.status === "dispensed" ? "bg-gradient-to-r from-emerald-400 to-teal-400"
                    : prescription.status === "cancelled" ? "bg-gradient-to-r from-red-400 to-rose-400"
                        : prescription.status === "processing" ? "bg-gradient-to-r from-blue-400 to-sky-400"
                            : "bg-gradient-to-r from-yellow-400 to-amber-400"
            }`}/>

            <CardContent className="p-5">
                {/* ── row 1: identity ── */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex gap-4 min-w-0 flex-1">
                        {/* medicine icon */}
                        <div
                            className="flex items-center justify-center w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 shrink-0">
                            <Pill className="w-5 h-5 text-teal-500"/>
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-semibold text-base">{prescription.medicine_name}</h3>
                                <StatusBadge status={prescription.status}/>
                            </div>

                            {/* quick facts */}
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                {prescription.dosage && (
                                    <span className="flex items-center gap-1">
                                        <Hash className="w-3 h-3"/> {prescription.dosage}
                                    </span>
                                )}
                                {prescription.frequency && (
                                    <span className="flex items-center gap-1">
                                        <Repeat2 className="w-3 h-3"/>
                                        {frequencyLabel[prescription.frequency] ?? prescription.frequency}
                                    </span>
                                )}
                                {prescription.duration && (
                                    <span className="flex items-center gap-1">
                                        <Timer className="w-3 h-3"/> {prescription.duration}
                                    </span>
                                )}
                                {prescription.route && (
                                    <span className="flex items-center gap-1">
                                        <Route className="w-3 h-3"/>
                                        {routeLabel[prescription.route] ?? prescription.route}
                                    </span>
                                )}
                                {prescription.quantity && (
                                    <span className="flex items-center gap-1">
                                        <Package className="w-3 h-3"/> {prescription.quantity} unit
                                    </span>
                                )}
                            </div>

                            {/* patient + doctor */}
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-0.5">
                                {patient && (
                                    <span className="flex items-center gap-1">
                                        <User className="w-3 h-3"/> {patient.full_name}
                                    </span>
                                )}
                                {doctor && (
                                    <span className="flex items-center gap-1">
                                        <Stethoscope className="w-3 h-3"/> {doctor.name}
                                    </span>
                                )}
                                {prescription.created_at && (
                                    <span className="flex items-center gap-1">
                                        <CalendarDays className="w-3 h-3"/>
                                        {formatDate(prescription.created_at)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* actions */}
                    <div className="flex sm:flex-col gap-2 shrink-0">
                        {prescription.status === "pending" && (
                            <Button
                                size="sm"
                                className="gap-1.5 text-xs h-8 bg-teal-500 hover:bg-teal-600"
                                onClick={() => onUpdateStatus(prescription.id, "processing")}
                            >
                                <FlaskConical className="w-3.5 h-3.5"/> Proses
                            </Button>
                        )}
                        {prescription.status === "processing" && (
                            <Button
                                size="sm"
                                className="gap-1.5 text-xs h-8 bg-emerald-500 hover:bg-emerald-600"
                                onClick={() => onUpdateStatus(prescription.id, "dispensed")}
                            >
                                <PackageCheck className="w-3.5 h-3.5"/> Serahkan
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs h-8"
                            onClick={() => setExpanded((p) => !p)}
                        >
                            <Eye className="w-3.5 h-3.5"/>
                            {expanded ? "Tutup" : "Detail"}
                        </Button>
                        {prescription.status === "dispensed" && (
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
                                <Printer className="w-3.5 h-3.5"/> Cetak
                            </Button>
                        )}
                    </div>
                </div>

                {/* ── expanded detail ── */}
                {expanded && (
                    <div className="mt-4 pt-4 border-t border-dashed grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            {icon: Hash, label: "Dosis", value: prescription.dosage},
                            {
                                icon: Repeat2,
                                label: "Frekuensi",
                                value: frequencyLabel[prescription.frequency] ?? prescription.frequency
                            },
                            {icon: Timer, label: "Durasi", value: prescription.duration},
                            {
                                icon: Route,
                                label: "Rute Pemberian",
                                value: routeLabel[prescription.route] ?? prescription.route
                            },
                            {
                                icon: Package,
                                label: "Jumlah",
                                value: prescription.quantity ? `${prescription.quantity} unit` : null
                            },
                        ].filter((r) => r.value).map(({icon: Icon, label, value}) => (
                            <div key={label} className="flex items-start gap-2 text-xs">
                                <Icon className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0"/>
                                <span className="text-muted-foreground w-28 shrink-0">{label}</span>
                                <span className="text-slate-700 font-medium">{value}</span>
                            </div>
                        ))}

                        {prescription.notes && (
                            <div className="sm:col-span-2 flex items-start gap-2 text-xs">
                                <StickyNote className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0"/>
                                <span className="text-muted-foreground w-28 shrink-0">Catatan</span>
                                <span className="text-slate-700 italic">{prescription.notes}</span>
                            </div>
                        )}

                        {visit && (
                            <div className="sm:col-span-2 p-3 rounded-lg bg-muted/40 border text-xs space-y-1">
                                <p className="font-semibold text-muted-foreground uppercase tracking-wide text-[10px] mb-2">Info
                                    Kunjungan</p>
                                {patient &&
                                    <p><span className="text-muted-foreground">Pasien: </span>{patient.full_name}</p>}
                                {doctor && <p><span className="text-muted-foreground">Dokter: </span>{doctor.name}</p>}
                                {visit.complain &&
                                    <p><span className="text-muted-foreground">Keluhan: </span>{visit.complain}</p>}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}


/* ─── Page ──────────────────────────────────────────────────── */
function PrescriptionPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const {fetchPrescriptions, prescriptions, updatePrescriptionStatus} = usePrescriptionStore();

    useEffect(() => {
        fetchPrescriptions({perPage: 20});
    }, [search]);

    const list = Array.isArray(prescriptions?.data) ? prescriptions.data : [];

    const filtered = list.filter((p) => {
        const q = search.toLowerCase();
        const matchSearch =
            !q ||
            p.medicine_name?.toLowerCase().includes(q) ||
            p.outpatient_visit?.patient?.full_name?.toLowerCase().includes(q);
        const matchStatus = statusFilter === "all" || p.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const handleUpdateStatus = async (id, status) => {
        await updatePrescriptionStatus(id, status);
        await fetchPrescriptions({perPage: 20});
    };

    return (
        <div className="space-y-6">
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div
                        className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500 shadow-lg shadow-teal-200">
                        <Pill className="w-6 h-6 text-white"/>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-teal-600">Resep Obat</h1>
                        <p className="text-sm text-muted-foreground">Kelola resep dan pengeluaran obat</p>
                    </div>
                </div>
            </div>

            {/* ── List ── */}
            <Card className="border border-border/60">
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                            <CardTitle className="text-base">Daftar Resep</CardTitle>
                            <CardDescription className="text-xs mt-0.5">
                                {filtered.length} dari {list.length} resep ditampilkan
                            </CardDescription>
                        </div>
                    </div>

                    {/* search + filter */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input
                                placeholder="Cari nama obat atau nama pasien…"
                                className="pl-9 h-9 text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-teal-600 transition-colors"
                                >
                                    <X className="w-4 h-4"/>
                                </button>
                            )}
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px] h-9 text-sm">
                                <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground"/>
                                <SelectValue placeholder="Filter Status"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="pending">Menunggu</SelectItem>
                                <SelectItem value="processing">Diproses</SelectItem>
                                <SelectItem value="dispensed">Diserahkan</SelectItem>
                                <SelectItem value="cancelled">Dibatalkan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>

                <CardContent className="pt-0">
                    {filtered.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Pill className="w-10 h-10 mx-auto mb-3 opacity-30"/>
                            <p className="text-sm">Tidak ada resep ditemukan</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map((prescription) => (
                                <PrescriptionCard
                                    key={prescription.id}
                                    prescription={prescription}
                                    onUpdateStatus={handleUpdateStatus}
                                />
                            ))}
                        </div>
                    )}

                    {/* pagination */}
                    {prescriptions?.last_page > 1 && (
                        <div
                            className="flex items-center justify-between mt-4 pt-4 border-t text-xs text-muted-foreground">
                                <span>
                                    Halaman {prescriptions.current_page} dari {prescriptions.last_page}
                                </span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="h-7 text-xs"
                                        disabled={!prescriptions.prev_page_url}>
                                    Sebelumnya
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 text-xs"
                                        disabled={!prescriptions.next_page_url}>
                                    Berikutnya
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default PrescriptionPage;