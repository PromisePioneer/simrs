import {useEffect, useRef, useState} from "react";
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
    Pill, Search, Filter, X, Clock,
    PackageCheck, Eye, Printer, User, Stethoscope,
    CalendarDays, Hash, Repeat2, Timer, Route, StickyNote, Package,
    FlaskConical, ChevronDown, Building2,
} from "lucide-react";
import {usePrescriptionStore} from "@/store/prescriptionStore.js";
import {formatDate} from "@/utils/formatDate.js";

/* ─── keyframes ─────────────────────────────────────────────── */
typeof document !== "undefined" && (() => {
    const id = "__rx-fadeup__";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
        @keyframes rx-fadeup {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        @media print {
            body * { visibility: hidden !important; }
            #rx-print-area, #rx-print-area * { visibility: visible !important; }
            #rx-print-area {
                position: fixed !important;
                inset: 0 !important;
                width: 210mm !important;
                min-height: 297mm !important;
                margin: 0 auto !important;
                padding: 16mm 20mm !important;
                background: white !important;
                font-family: 'Times New Roman', serif !important;
            }
        }
    `;
    document.head.appendChild(s);
})();

/* ─── Status meta ───────────────────────────────────────────── */
const statusMeta = {
    draft:      { label: "Draft",      icon: StickyNote,   cls: "bg-slate-50 text-slate-600 border-slate-200" },
    pending:    { label: "Menunggu",   icon: Clock,        cls: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    processing: { label: "Diproses",   icon: FlaskConical, cls: "bg-blue-50 text-blue-700 border-blue-200" },
    dispensed:  { label: "Diserahkan", icon: PackageCheck, cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    cancelled:  { label: "Dibatalkan", icon: X,            cls: "bg-red-50 text-red-700 border-red-200" },
};

const accentBar = {
    draft:      "from-slate-300 to-slate-400",
    pending:    "from-yellow-400 to-amber-400",
    processing: "from-blue-400 to-sky-400",
    dispensed:  "from-emerald-400 to-teal-400",
    cancelled:  "from-red-400 to-rose-400",
};

const routeLabel = {
    oral: "Oral (PO)", iv: "Intravena (IV)", im: "Intramuskular (IM)",
    sc: "Subkutan (SC)", topical: "Topikal", inhalasi: "Inhalasi", suppositoria: "Suppositoria",
};

const frequencyLabel = {
    "1x1": "1×1 (Sekali sehari)", "2x1": "2×1 (Dua kali sehari)",
    "3x1": "3×1 (Tiga kali sehari)", "4x1": "4×1 (Empat kali sehari)", prn: "Jika perlu (p.r.n)",
};

/* ─── Status Badge ──────────────────────────────────────────── */
const StatusBadge = ({status}) => {
    const m = statusMeta[status] ?? {label: status, cls: "", icon: Clock};
    const Icon = m.icon;
    return (
        <Badge variant="outline" className={`gap-1 text-[11px] px-2 py-0.5 ${m.cls}`}>
            <Icon className="w-3 h-3"/>{m.label}
        </Badge>
    );
};

/* ─── Smooth Collapse ───────────────────────────────────────── */
function Collapse({open, children}) {
    return (
        <div style={{
            display: "grid",
            gridTemplateRows: open ? "1fr" : "0fr",
            transition: "grid-template-rows 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}>
            <div style={{overflow: "hidden"}}>
                <div style={{
                    opacity: open ? 1 : 0,
                    transform: open ? "translateY(0)" : "translateY(-6px)",
                    transition: "opacity 0.25s ease, transform 0.25s ease",
                    transitionDelay: open ? "0.05s" : "0s",
                }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

/* ─── Print Modal ───────────────────────────────────────────── */
function PrintModal({prescription, onClose}) {
    const visit = prescription.outpatient_visit;
    const patient = visit?.patient;
    const doctor = visit?.doctor;
    const medicineName = prescription.medicine?.name ?? prescription.medicine_name ?? "—";
    const printDate = new Date().toLocaleDateString("id-ID", {day: "numeric", month: "long", year: "numeric"});
    const rxNumber = `RX-${prescription.id?.slice(-8).toUpperCase()}`;

    const handlePrint = () => window.print();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto">
                {/* modal toolbar */}
                <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
                    <span className="font-semibold text-sm">Preview Cetak Resep</span>
                    <div className="flex gap-2">
                        <Button size="sm" className="gap-1.5 bg-teal-500 hover:bg-teal-600" onClick={handlePrint}>
                            <Printer className="w-3.5 h-3.5"/> Cetak
                        </Button>
                        <Button size="sm" variant="outline" onClick={onClose}>
                            <X className="w-3.5 h-3.5"/>
                        </Button>
                    </div>
                </div>

                {/* A4 preview */}
                <div className="p-6">
                    <div
                        id="rx-print-area"
                        className="bg-white border border-gray-200 shadow-sm mx-auto"
                        style={{width: "210mm", minHeight: "297mm", padding: "16mm 20mm", fontFamily: "'Times New Roman', serif"}}
                    >
                        {/* ── KOP KLINIK ── */}
                        <div style={{borderBottom: "3px solid #0d9488", paddingBottom: "12px", marginBottom: "20px"}}>
                            <div style={{display: "flex", alignItems: "center", gap: "16px"}}>
                                <div style={{
                                    width: "64px", height: "64px", borderRadius: "12px",
                                    background: "#0d9488", display: "flex", alignItems: "center", justifyContent: "center",
                                    flexShrink: 0,
                                }}>
                                    <span style={{color: "white", fontSize: "28px", fontWeight: "bold"}}>+</span>
                                </div>
                                <div>
                                    <div style={{fontSize: "22px", fontWeight: "bold", color: "#0d9488", lineHeight: 1.2}}>
                                        Klinik Sehat Bersama
                                    </div>
                                    <div style={{fontSize: "11px", color: "#555", marginTop: "4px"}}>
                                        Jl. Kesehatan No. 1, Jakarta Selatan · Telp: (021) 555-0100
                                    </div>
                                    <div style={{fontSize: "11px", color: "#555"}}>
                                        SIP: 503/KL/DKK/2024 · Buka: Senin–Sabtu 08.00–21.00
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── JUDUL ── */}
                        <div style={{textAlign: "center", marginBottom: "20px"}}>
                            <div style={{fontSize: "16px", fontWeight: "bold", letterSpacing: "3px", textTransform: "uppercase"}}>
                                Resep Obat
                            </div>
                            <div style={{fontSize: "11px", color: "#666", marginTop: "4px"}}>
                                No. Resep: <strong>{rxNumber}</strong>
                            </div>
                        </div>

                        {/* ── INFO PASIEN & DOKTER ── */}
                        <div style={{
                            display: "grid", gridTemplateColumns: "1fr 1fr",
                            gap: "12px", marginBottom: "20px",
                            background: "#f8fafc", border: "1px solid #e2e8f0",
                            borderRadius: "8px", padding: "14px",
                        }}>
                            <div>
                                <div style={{fontSize: "10px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px"}}>
                                    Data Pasien
                                </div>
                                <table style={{fontSize: "12px", width: "100%", borderCollapse: "collapse"}}>
                                    <tbody>
                                    <tr>
                                        <td style={{color: "#64748b", paddingBottom: "4px", width: "80px"}}>Nama</td>
                                        <td style={{paddingBottom: "4px"}}>: <strong>{patient?.full_name ?? "—"}</strong></td>
                                    </tr>
                                    <tr>
                                        <td style={{color: "#64748b", paddingBottom: "4px"}}>No. MR</td>
                                        <td style={{paddingBottom: "4px"}}>: {patient?.medical_record_number ?? "—"}</td>
                                    </tr>
                                    <tr>
                                        <td style={{color: "#64748b", paddingBottom: "4px"}}>Keluhan</td>
                                        <td style={{paddingBottom: "4px"}}>: {visit?.complain ?? "—"}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <div style={{fontSize: "10px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px"}}>
                                    Data Dokter & Tanggal
                                </div>
                                <table style={{fontSize: "12px", width: "100%", borderCollapse: "collapse"}}>
                                    <tbody>
                                    <tr>
                                        <td style={{color: "#64748b", paddingBottom: "4px", width: "80px"}}>Dokter</td>
                                        <td style={{paddingBottom: "4px"}}>: <strong>{doctor?.name ?? "—"}</strong></td>
                                    </tr>
                                    <tr>
                                        <td style={{color: "#64748b", paddingBottom: "4px"}}>Tanggal</td>
                                        <td style={{paddingBottom: "4px"}}>: {printDate}</td>
                                    </tr>
                                    <tr>
                                        <td style={{color: "#64748b", paddingBottom: "4px"}}>Status</td>
                                        <td style={{paddingBottom: "4px"}}>: {statusMeta[prescription.status]?.label ?? prescription.status}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ── DETAIL OBAT ── */}
                        <div style={{marginBottom: "24px"}}>
                            <div style={{
                                fontSize: "10px", fontWeight: "bold", color: "#64748b",
                                textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px",
                                borderBottom: "1px solid #e2e8f0", paddingBottom: "6px",
                            }}>
                                Detail Obat
                            </div>

                            <table style={{width: "100%", borderCollapse: "collapse", fontSize: "13px"}}>
                                <thead>
                                <tr style={{background: "#f1f5f9"}}>
                                    <th style={{padding: "8px 10px", textAlign: "left", border: "1px solid #e2e8f0", fontWeight: "600", fontSize: "12px"}}>Nama Obat</th>
                                    <th style={{padding: "8px 10px", textAlign: "left", border: "1px solid #e2e8f0", fontWeight: "600", fontSize: "12px"}}>Dosis</th>
                                    <th style={{padding: "8px 10px", textAlign: "left", border: "1px solid #e2e8f0", fontWeight: "600", fontSize: "12px"}}>Frekuensi</th>
                                    <th style={{padding: "8px 10px", textAlign: "left", border: "1px solid #e2e8f0", fontWeight: "600", fontSize: "12px"}}>Durasi</th>
                                    <th style={{padding: "8px 10px", textAlign: "left", border: "1px solid #e2e8f0", fontWeight: "600", fontSize: "12px"}}>Rute</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td style={{padding: "10px", border: "1px solid #e2e8f0", fontWeight: "600"}}>{medicineName}</td>
                                    <td style={{padding: "10px", border: "1px solid #e2e8f0"}}>{prescription.dosage ?? "—"}</td>
                                    <td style={{padding: "10px", border: "1px solid #e2e8f0"}}>{frequencyLabel[prescription.frequency] ?? prescription.frequency ?? "—"}</td>
                                    <td style={{padding: "10px", border: "1px solid #e2e8f0"}}>{prescription.duration ?? "—"}</td>
                                    <td style={{padding: "10px", border: "1px solid #e2e8f0"}}>{routeLabel[prescription.route] ?? prescription.route ?? "—"}</td>
                                </tr>
                                </tbody>
                            </table>

                            {prescription.notes && (
                                <div style={{
                                    marginTop: "10px", padding: "10px 14px",
                                    background: "#fffbeb", border: "1px solid #fde68a",
                                    borderRadius: "6px", fontSize: "12px",
                                }}>
                                    <strong>Catatan:</strong> {prescription.notes}
                                </div>
                            )}
                        </div>

                        {/* ── INSTRUKSI ── */}
                        <div style={{
                            marginBottom: "32px", padding: "12px 14px",
                            background: "#f0fdf4", border: "1px solid #bbf7d0",
                            borderRadius: "8px", fontSize: "12px",
                        }}>
                            <div style={{fontWeight: "bold", marginBottom: "6px", color: "#166534"}}>Instruksi Penggunaan:</div>
                            <div style={{color: "#15803d"}}>
                                Minum obat sesuai dosis yang tertera. Habiskan obat meskipun kondisi sudah membaik.
                                Simpan di tempat sejuk dan kering, jauhkan dari jangkauan anak-anak.
                                Segera hubungi dokter jika terjadi efek samping yang tidak diinginkan.
                            </div>
                        </div>

                        {/* ── TANDA TANGAN ── */}
                        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginTop: "auto"}}>
                            <div style={{textAlign: "center"}}>
                                <div style={{fontSize: "12px", marginBottom: "60px"}}>Apoteker / Petugas Farmasi</div>
                                <div style={{borderTop: "1px solid #000", paddingTop: "6px", fontSize: "12px"}}>
                                    (.................................)
                                </div>
                            </div>
                            <div style={{textAlign: "center"}}>
                                <div style={{fontSize: "12px", marginBottom: "4px"}}>Jakarta, {printDate}</div>
                                <div style={{fontSize: "12px", marginBottom: "44px"}}>Dokter Pemeriksa</div>
                                <div style={{borderTop: "1px solid #000", paddingTop: "6px", fontSize: "12px"}}>
                                    <strong>{doctor?.name ?? "(.................................)"}</strong>
                                </div>
                            </div>
                        </div>

                        {/* ── FOOTER ── */}
                        <div style={{
                            marginTop: "24px", paddingTop: "10px",
                            borderTop: "1px dashed #cbd5e1",
                            textAlign: "center", fontSize: "10px", color: "#94a3b8",
                        }}>
                            Dokumen ini dicetak secara elektronik dari sistem rekam medis · {rxNumber} · {printDate}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Prescription Card ─────────────────────────────────────── */
function PrescriptionCard({prescription, onUpdateStatus, index}) {
    const [expanded, setExpanded] = useState(false);
    const [showPrint, setShowPrint] = useState(false);
    const visit = prescription.outpatient_visit;
    const patient = visit?.patient;
    const doctor = visit?.doctor;
    const medicineName = prescription.medicine?.name ?? prescription.medicine_name ?? "—";
    const bar = accentBar[prescription.status] ?? accentBar.pending;

    return (
        <>
            {showPrint && (
                <PrintModal prescription={prescription} onClose={() => setShowPrint(false)}/>
            )}

            <div style={{animation: "rx-fadeup 0.3s ease both", animationDelay: `${index * 60}ms`}}>
                <Card className="overflow-hidden border border-border/60 hover:border-teal-300 hover:shadow-md transition-all duration-200">
                    <div className={`h-1 w-full bg-gradient-to-r ${bar}`}/>

                    <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div className="flex gap-4 min-w-0 flex-1">
                                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 shrink-0 transition-transform duration-200 hover:scale-110">
                                    <Pill className="w-5 h-5 text-teal-500"/>
                                </div>

                                <div className="space-y-1 min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-semibold text-base">{medicineName}</h3>
                                        <StatusBadge status={prescription.status}/>
                                    </div>

                                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                        {prescription.dosage && <span className="flex items-center gap-1"><Hash className="w-3 h-3"/>{prescription.dosage}</span>}
                                        {prescription.frequency && <span className="flex items-center gap-1"><Repeat2 className="w-3 h-3"/>{frequencyLabel[prescription.frequency] ?? prescription.frequency}</span>}
                                        {prescription.duration && <span className="flex items-center gap-1"><Timer className="w-3 h-3"/>{prescription.duration}</span>}
                                        {prescription.route && <span className="flex items-center gap-1"><Route className="w-3 h-3"/>{routeLabel[prescription.route] ?? prescription.route}</span>}
                                        {prescription.quantity && <span className="flex items-center gap-1"><Package className="w-3 h-3"/>{prescription.quantity} unit</span>}
                                    </div>

                                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-0.5">
                                        {patient && <span className="flex items-center gap-1"><User className="w-3 h-3"/>{patient.full_name}</span>}
                                        {doctor  && <span className="flex items-center gap-1"><Stethoscope className="w-3 h-3"/>{doctor.name}</span>}
                                        {prescription.created_at && <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3"/>{formatDate(prescription.created_at)}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* actions */}
                            <div className="flex sm:flex-col gap-2 shrink-0">
                                {prescription.status === "draft" && (
                                    <Button size="sm" className="gap-1.5 text-xs h-8 bg-yellow-500 hover:bg-yellow-600 active:scale-95 transition-all"
                                            onClick={() => onUpdateStatus(prescription.id, "pending")}>
                                        <Clock className="w-3.5 h-3.5"/> Ajukan
                                    </Button>
                                )}
                                {prescription.status === "pending" && (
                                    <Button size="sm" className="gap-1.5 text-xs h-8 bg-teal-500 hover:bg-teal-600 active:scale-95 transition-all"
                                            onClick={() => onUpdateStatus(prescription.id, "processing")}>
                                        <FlaskConical className="w-3.5 h-3.5"/> Proses
                                    </Button>
                                )}
                                {prescription.status === "processing" && (
                                    <Button size="sm" className="gap-1.5 text-xs h-8 bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all"
                                            onClick={() => onUpdateStatus(prescription.id, "dispensed")}>
                                        <PackageCheck className="w-3.5 h-3.5"/> Serahkan
                                    </Button>
                                )}
                                <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8 active:scale-95 transition-all"
                                        onClick={() => setExpanded((p) => !p)}>
                                    <Eye className="w-3.5 h-3.5"/>
                                    {expanded ? "Tutup" : "Detail"}
                                    <ChevronDown className="w-3 h-3" style={{
                                        transition: "transform 0.3s ease",
                                        transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                                    }}/>
                                </Button>
                                {/* Cetak always visible */}
                                <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8 active:scale-95 transition-all"
                                        onClick={() => setShowPrint(true)}>
                                    <Printer className="w-3.5 h-3.5"/> Cetak
                                </Button>
                            </div>
                        </div>

                        <Collapse open={expanded}>
                            <div className="mt-4 pt-4 border-t border-dashed grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    {icon: Hash,    label: "Dosis",          value: prescription.dosage},
                                    {icon: Repeat2, label: "Frekuensi",      value: frequencyLabel[prescription.frequency] ?? prescription.frequency},
                                    {icon: Timer,   label: "Durasi",         value: prescription.duration},
                                    {icon: Route,   label: "Rute Pemberian", value: routeLabel[prescription.route] ?? prescription.route},
                                    {icon: Package, label: "Jumlah",         value: prescription.quantity ? `${prescription.quantity} unit` : null},
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
                                        <p className="font-semibold text-muted-foreground uppercase tracking-wide text-[10px] mb-2">Info Kunjungan</p>
                                        {patient     && <p><span className="text-muted-foreground">Pasien: </span>{patient.full_name}</p>}
                                        {doctor      && <p><span className="text-muted-foreground">Dokter: </span>{doctor.name}</p>}
                                        {visit.complain && <p><span className="text-muted-foreground">Keluhan: </span>{visit.complain}</p>}
                                    </div>
                                )}
                            </div>
                        </Collapse>
                    </CardContent>
                </Card>
            </div>
        </>
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
        const matchSearch = !q ||
            p.medicine?.name?.toLowerCase().includes(q) ||
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
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500 shadow-lg shadow-teal-200">
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
                            <Input placeholder="Cari nama obat atau nama pasien…" className="pl-9 h-9 text-sm"
                                   value={search} onChange={(e) => setSearch(e.target.value)}/>
                            {search && (
                                <button onClick={() => setSearch("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-teal-600 transition-colors">
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
                                <SelectItem value="draft">Draft</SelectItem>
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
                            {filtered.map((prescription, index) => (
                                <PrescriptionCard
                                    key={prescription.id}
                                    prescription={prescription}
                                    onUpdateStatus={handleUpdateStatus}
                                    index={index}
                                />
                            ))}
                        </div>
                    )}
                    {prescriptions?.last_page > 1 && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t text-xs text-muted-foreground">
                            <span>Halaman {prescriptions.current_page} dari {prescriptions.last_page}</span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="h-7 text-xs" disabled={!prescriptions.prev_page_url}>Sebelumnya</Button>
                                <Button variant="outline" size="sm" className="h-7 text-xs" disabled={!prescriptions.next_page_url}>Berikutnya</Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default PrescriptionPage;