import {useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {
    Pill, Search, Filter, X, Clock, PackageCheck, Printer,
    User, Stethoscope, CalendarDays, Hash, Repeat2, Timer,
    Route, StickyNote, Package, FlaskConical,
} from "lucide-react";
import {usePrescriptionStore} from "@/store/prescriptionStore.js";
import {formatDate} from "@/utils/formatDate.js";
import {ListCard} from "@/components/common/list-card.jsx";
import {ClinicalPDFDocument, PDFModal} from "@/components/common/pdf-document.jsx";

/* ─── Status meta ───────────────────────────────────────────── */
const statusMeta = {
    draft: {label: "Draft", icon: StickyNote, className: "bg-slate-50 text-slate-600 border-slate-200"},
    pending: {label: "Menunggu", icon: Clock, className: "bg-yellow-50 text-yellow-700 border-yellow-200"},
    processing: {label: "Diproses", icon: FlaskConical, className: "bg-blue-50 text-blue-700 border-blue-200"},
    dispensed: {
        label: "Diserahkan",
        icon: PackageCheck,
        className: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    cancelled: {label: "Dibatalkan", icon: X, className: "bg-red-50 text-red-700 border-red-200"},
};

const accentBar = {
    draft: "from-slate-300 to-slate-400",
    pending: "from-yellow-400 to-amber-400",
    processing: "from-blue-400 to-sky-400",
    dispensed: "from-emerald-400 to-teal-400",
    cancelled: "from-red-400 to-rose-400",
};

const routeLabel = {
    oral: "Oral (PO)", iv: "Intravena (IV)", im: "Intramuskular (IM)",
    sc: "Subkutan (SC)", topical: "Topikal", inhalasi: "Inhalasi", suppositoria: "Suppositoria",
};

const frequencyLabel = {
    "1x1": "1×1 (Sekali sehari)", "2x1": "2×1 (Dua kali sehari)",
    "3x1": "3×1 (Tiga kali sehari)", "4x1": "4×1 (Empat kali sehari)", prn: "Jika perlu (p.r.n)",
};


function buildPDFProps(p) {
    const visit = p.outpatient_visit;
    const patient = visit?.patient;
    const doctor = visit?.doctor;
    const medName = p.medicine?.name ?? p.medicine_name ?? "—";

    return {
        title: "Resep Obat",
        fileName: `RX-${p.id?.slice(-8).toUpperCase()}-${medName.replace(/\s+/g, "-")}.pdf`,

        patient: patient ? {
            full_name: patient.full_name,
            medical_record_number: patient.medical_record_number,
            complaint: visit?.complain,
        } : undefined,

        doctor: doctor ? {name: doctor.name} : undefined,

        table: {
            columns: ["Nama Obat", "Dosis", "Frekuensi", "Durasi", "Rute Pemberian"],
            firstColBold: true,
            rows: [[
                medName,
                p.dosage ?? "—",
                frequencyLabel[p.frequency] ?? p.frequency ?? "—",
                p.duration ?? "—",
                routeLabel[p.route] ?? p.route ?? "—",
            ]],
        },

        sections: p.quantity ? [{
            label: "Info Tambahan",
            rows: [{key: "Jumlah Obat", value: `${p.quantity} unit`}],
        }] : [],

        notes: p.notes ?? undefined,
        instructions: p.instructions ?? `Minum obat ${frequencyLabel[p.frequency] ?? p.frequency ?? ""} selama ${p.duration ?? "sesuai anjuran dokter"}. Habiskan obat meskipun gejala sudah membaik.`,

        signerLeft: "Apoteker / Petugas Farmasi",
        signerRight: doctor?.name,
    };
}

/* ─── Page ──────────────────────────────────────────────────── */
function PrescriptionPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [printTarget, setPrintTarget] = useState(null); // prescription yg mau di-print
    const {fetchPrescriptions, prescriptions, updatePrescriptionStatus} = usePrescriptionStore();

    useEffect(() => {
        fetchPrescriptions({perPage: 20});
    }, [search]);

    const list = Array.isArray(prescriptions?.data) ? prescriptions.data : [];
    const filtered = list.filter((p) => {
        const q = search.toLowerCase();
        const matchSearch = !q
            || p.medicine?.name?.toLowerCase().includes(q)
            || p.medicine_name?.toLowerCase().includes(q)
            || p.outpatient_visit?.patient?.full_name?.toLowerCase().includes(q);
        const matchStatus = statusFilter === "all" || p.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const handleUpdateStatus = async (id, status) => {
        await updatePrescriptionStatus(id, status);
        await fetchPrescriptions({perPage: 20});
    };

    return (
        <div className="space-y-6">
            {/* Header */}
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

            <Card className="border border-border/60">
                <CardHeader className="pb-4">
                    <div>
                        <CardTitle className="text-base">Daftar Resep</CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                            {filtered.length} dari {list.length} resep ditampilkan
                        </CardDescription>
                    </div>
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
                                {Object.entries(statusMeta).map(([key, {label}]) => (
                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
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
                            {filtered.map((p, index) => {
                                const visit = p.outpatient_visit;
                                const patient = visit?.patient;
                                const doctor = visit?.doctor;
                                const medicineName = p.medicine?.name ?? p.medicine_name ?? "—";
                                const status = statusMeta[p.status] ?? {label: p.status, className: ""};

                                // Tombol workflow (berubah sesuai status)
                                const workflowActions = [
                                    ...(p.status === "draft" ? [{
                                        label: "Ajukan",
                                        icon: Clock,
                                        className: "bg-yellow-500 hover:bg-yellow-600 text-white",
                                        onClick: () => handleUpdateStatus(p.id, "pending"),
                                    }] : []),
                                    ...(p.status === "pending" ? [{
                                        label: "Proses",
                                        icon: FlaskConical,
                                        className: "bg-teal-500 hover:bg-teal-600 text-white",
                                        onClick: () => handleUpdateStatus(p.id, "processing"),
                                    }] : []),
                                    ...(p.status === "processing" ? [{
                                        label: "Serahkan",
                                        icon: PackageCheck,
                                        className: "bg-emerald-500 hover:bg-emerald-600 text-white",
                                        onClick: () => handleUpdateStatus(p.id, "dispensed"),
                                    }] : []),
                                ];

                                return (
                                    <ListCard
                                        key={p.id}
                                        index={index}

                                        accentColor={accentBar[p.status] ?? accentBar.pending}

                                        icon={<Pill className="w-5 h-5 text-teal-500"/>}
                                        iconBg="bg-teal-50 border border-teal-100"

                                        title={medicineName}

                                        badges={[{
                                            label: status.label,
                                            icon: status.icon,
                                            className: status.className,
                                        }]}

                                        meta={[
                                            ...(p.dosage ? [{icon: Hash, label: p.dosage}] : []),
                                            ...(p.frequency ? [{
                                                icon: Repeat2,
                                                label: frequencyLabel[p.frequency] ?? p.frequency
                                            }] : []),
                                            ...(p.duration ? [{icon: Timer, label: p.duration}] : []),
                                            ...(p.route ? [{icon: Route, label: routeLabel[p.route] ?? p.route}] : []),
                                            ...(patient ? [{icon: User, label: patient.full_name}] : []),
                                            ...(doctor ? [{icon: Stethoscope, label: doctor.name}] : []),
                                            ...(p.created_at ? [{
                                                icon: CalendarDays,
                                                label: formatDate(p.created_at)
                                            }] : []),
                                        ]}

                                        /* ── Cetak selalu di kanan atas, rapi & terpisah ── */
                                        headerActions={[{
                                            label: "Cetak",
                                            icon: Printer,
                                            variant: "outline",
                                            onClick: () => setPrintTarget(p),
                                        }]}

                                        /* ── Workflow di bawah kiri ── */
                                        actions={workflowActions}

                                        detail={
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {[
                                                    {icon: Hash, label: "Dosis", value: p.dosage},
                                                    {
                                                        icon: Repeat2,
                                                        label: "Frekuensi",
                                                        value: frequencyLabel[p.frequency] ?? p.frequency
                                                    },
                                                    {icon: Timer, label: "Durasi", value: p.duration},
                                                    {
                                                        icon: Route,
                                                        label: "Rute Pemberian",
                                                        value: routeLabel[p.route] ?? p.route
                                                    },
                                                    {
                                                        icon: Package,
                                                        label: "Jumlah",
                                                        value: p.quantity ? `${p.quantity} unit` : null
                                                    },
                                                ].filter(r => r.value).map(({icon: Icon, label, value}) => (
                                                    <div key={label} className="flex items-start gap-2 text-xs">
                                                        <Icon className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0"/>
                                                        <span
                                                            className="text-muted-foreground w-28 shrink-0">{label}</span>
                                                        <span className="text-slate-700 font-medium">{value}</span>
                                                    </div>
                                                ))}
                                                {p.notes && (
                                                    <div className="sm:col-span-2 flex items-start gap-2 text-xs">
                                                        <StickyNote
                                                            className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0"/>
                                                        <span
                                                            className="text-muted-foreground w-28 shrink-0">Catatan</span>
                                                        <span className="text-slate-700 italic">{p.notes}</span>
                                                    </div>
                                                )}
                                                {visit && (
                                                    <div
                                                        className="sm:col-span-2 p-3 rounded-lg bg-muted/40 border text-xs space-y-1">
                                                        <p className="font-semibold text-muted-foreground uppercase tracking-wide text-[10px] mb-2">Info
                                                            Kunjungan</p>
                                                        {patient && <p><span
                                                            className="text-muted-foreground">Pasien: </span>{patient.full_name}
                                                        </p>}
                                                        {doctor && <p><span
                                                            className="text-muted-foreground">Dokter: </span>{doctor.name}
                                                        </p>}
                                                        {visit.complain && <p><span
                                                            className="text-muted-foreground">Keluhan: </span>{visit.complain}
                                                        </p>}
                                                    </div>
                                                )}
                                            </div>
                                        }
                                    />
                                );
                            })}
                        </div>
                    )}

                    {prescriptions?.last_page > 1 && (
                        <div
                            className="flex items-center justify-between mt-4 pt-4 border-t text-xs text-muted-foreground">
                            <span>Halaman {prescriptions.current_page} dari {prescriptions.last_page}</span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="h-7 text-xs"
                                        disabled={!prescriptions.prev_page_url}>Sebelumnya</Button>
                                <Button variant="outline" size="sm" className="h-7 text-xs"
                                        disabled={!prescriptions.next_page_url}>Berikutnya</Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            {printTarget && (
                <PDFModal
                    open={!!printTarget}
                    onClose={() => setPrintTarget(null)}
                    {...buildPDFProps(printTarget)} // ← semua prop otomatis ter-map
                />
            )}
        </div>
    );
}

export default PrescriptionPage;