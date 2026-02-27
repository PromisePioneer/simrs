import {useEffect, useState} from "react";
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
    FlaskConical, ChevronDown,
} from "lucide-react";
import {
    Document, Page, Text, View, StyleSheet, PDFViewer, pdf,
} from "@react-pdf/renderer";
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
    `;
    document.head.appendChild(s);
})();

/* ─── Status meta ───────────────────────────────────────────── */
const statusMeta = {
    draft: {label: "Draft", icon: StickyNote, cls: "bg-slate-50 text-slate-600 border-slate-200"},
    pending: {label: "Menunggu", icon: Clock, cls: "bg-yellow-50 text-yellow-700 border-yellow-200"},
    processing: {label: "Diproses", icon: FlaskConical, cls: "bg-blue-50 text-blue-700 border-blue-200"},
    dispensed: {label: "Diserahkan", icon: PackageCheck, cls: "bg-emerald-50 text-emerald-700 border-emerald-200"},
    cancelled: {label: "Dibatalkan", icon: X, cls: "bg-red-50 text-red-700 border-red-200"},
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

/* ─── PDF Styles ─────────────────────────────────────────────── */
const pdfStyles = StyleSheet.create({
    page: {
        padding: "16mm 20mm",
        fontFamily: "Helvetica",
        fontSize: 10,
        color: "#1e293b",
        backgroundColor: "#ffffff",
    },
    // KOP
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 3,
        borderBottomColor: "#0d9488",
        paddingBottom: 10,
        marginBottom: 16,
        gap: 12,
    },
    logoBox: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: "#0d9488",
        alignItems: "center",
        justifyContent: "center",
    },
    logoText: {color: "#ffffff", fontSize: 26, fontFamily: "Helvetica-Bold"},
    clinicName: {fontSize: 18, fontFamily: "Helvetica-Bold", color: "#0d9488"},
    clinicSub: {fontSize: 8, color: "#555555", marginTop: 2},
    // Title
    titleWrap: {alignItems: "center", marginBottom: 16},
    titleText: {fontSize: 14, fontFamily: "Helvetica-Bold", letterSpacing: 2},
    rxNumber: {fontSize: 9, color: "#666666", marginTop: 3},
    // Info grid
    infoGrid: {
        flexDirection: "row",
        gap: 10,
        backgroundColor: "#f8fafc",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 6,
        padding: 10,
        marginBottom: 16,
    },
    infoCol: {flex: 1},
    infoLabel: {
        fontSize: 7,
        fontFamily: "Helvetica-Bold",
        color: "#64748b",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 6,
    },
    infoRow: {flexDirection: "row", marginBottom: 3},
    infoKey: {width: 55, color: "#64748b", fontSize: 9},
    infoVal: {flex: 1, fontSize: 9},
    infoValBold: {flex: 1, fontSize: 9, fontFamily: "Helvetica-Bold"},
    // Section label
    sectionLabel: {
        fontSize: 7,
        fontFamily: "Helvetica-Bold",
        color: "#64748b",
        textTransform: "uppercase",
        letterSpacing: 1,
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        paddingBottom: 4,
        marginBottom: 8,
    },
    // Table
    table: {marginBottom: 16},
    tableHead: {
        flexDirection: "row",
        backgroundColor: "#f1f5f9",
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    tableRow: {
        flexDirection: "row",
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#e2e8f0",
    },
    thCell: {
        flex: 1,
        padding: "5px 7px",
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        borderRightWidth: 1,
        borderRightColor: "#e2e8f0",
    },
    tdCell: {
        flex: 1,
        padding: 7,
        fontSize: 9,
        borderRightWidth: 1,
        borderRightColor: "#e2e8f0",
    },
    tdCellBold: {
        flex: 1,
        padding: 7,
        fontSize: 9,
        fontFamily: "Helvetica-Bold",
        borderRightWidth: 1,
        borderRightColor: "#e2e8f0",
    },
    notesBox: {
        backgroundColor: "#fffbeb",
        borderWidth: 1,
        borderColor: "#fde68a",
        borderRadius: 4,
        padding: "7px 10px",
        marginTop: 6,
        fontSize: 9,
    },
    // Instruksi
    instrBox: {
        backgroundColor: "#f0fdf4",
        borderWidth: 1,
        borderColor: "#bbf7d0",
        borderRadius: 6,
        padding: "9px 12px",
        marginBottom: 24,
    },
    instrTitle: {fontFamily: "Helvetica-Bold", color: "#166534", fontSize: 9, marginBottom: 4},
    instrText: {color: "#15803d", fontSize: 8.5, lineHeight: 1.5},
    // TTD
    ttdGrid: {flexDirection: "row", gap: 30},
    ttdCol: {flex: 1, alignItems: "center"},
    ttdLabel: {fontSize: 9, marginBottom: 45},
    ttdLabelSm: {fontSize: 9, marginBottom: 4},
    ttdLabelMd: {fontSize: 9, marginBottom: 34},
    ttdLine: {
        borderTopWidth: 1,
        borderTopColor: "#000000",
        paddingTop: 4,
        fontSize: 9,
        width: "100%",
        textAlign: "center",
    },
    ttdBold: {fontFamily: "Helvetica-Bold"},
    // Footer
    footer: {
        marginTop: 20,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#cbd5e1",
        textAlign: "center",
        fontSize: 7.5,
        color: "#94a3b8",
    },
});

/* ─── PDF Document ───────────────────────────────────────────── */
function ResepPDFDocument({prescription}) {
    const visit = prescription.outpatient_visit;
    const patient = visit?.patient;
    const doctor = visit?.doctor;
    const medicineName = prescription.medicine?.name ?? prescription.medicine_name ?? "—";
    const printDate = new Date().toLocaleDateString("id-ID", {day: "numeric", month: "long", year: "numeric"});
    const rxNumber = `RX-${prescription.id?.slice(-8).toUpperCase()}`;

    return (
        <Document title={`Resep - ${medicineName} - ${patient?.full_name ?? ""}`}>
            <Page size="A4" style={pdfStyles.page}>

                {/* KOP */}
                <View style={pdfStyles.headerRow}>
                    <View style={pdfStyles.logoBox}>
                        <Text style={pdfStyles.logoText}>+</Text>
                    </View>
                    <View>
                    <Text style={pdfStyles.clinicName}>{prescription?.tenant?.name}</Text>
                        <Text style={pdfStyles.clinicSub}>Jl. Kesehatan No. 1, Jakarta Selatan Telp: (021)
                            555-0100</Text>
                        <Text style={pdfStyles.clinicSub}>SIP: 503/KL/DKK/2024 Buka: Senin-Sabtu 08.00-21.00</Text>
                    </View>
                </View>

                {/* JUDUL */}
                <View style={pdfStyles.titleWrap}>
                    <Text style={pdfStyles.titleText}>RESEP OBAT</Text>
                    <Text style={pdfStyles.rxNumber}>No. Resep: {rxNumber}</Text>
                </View>

                {/* INFO PASIEN & DOKTER */}
                <View style={pdfStyles.infoGrid}>
                    <View style={pdfStyles.infoCol}>
                        <Text style={pdfStyles.infoLabel}>Data Pasien</Text>
                        <View style={pdfStyles.infoRow}>
                            <Text style={pdfStyles.infoKey}>Nama</Text>
                            <Text style={pdfStyles.infoValBold}>: {prescription.outpatient_visit.patient?.full_name ?? "—"}</Text>
                        </View>
                        <View style={pdfStyles.infoRow}>
                            <Text style={pdfStyles.infoKey}>No. MR</Text>
                            <Text style={pdfStyles.infoVal}>: {prescription.outpatient_visit.patient?.medical_record_number ?? "—"}</Text>
                        </View>
                        <View style={pdfStyles.infoRow}>
                            <Text style={pdfStyles.infoKey}>Keluhan</Text>
                            <Text style={pdfStyles.infoVal}>: {visit?.complain ?? "—"}</Text>
                        </View>
                    </View>
                    <View style={pdfStyles.infoCol}>
                        <Text style={pdfStyles.infoLabel}>Data Dokter & Tanggal</Text>
                        <View style={pdfStyles.infoRow}>
                            <Text style={pdfStyles.infoKey}>Dokter</Text>
                            <Text style={pdfStyles.infoValBold}>: {prescription.outpatient_visit?.doctor?.name ?? "—"}</Text>
                        </View>
                        <View style={pdfStyles.infoRow}>
                            <Text style={pdfStyles.infoKey}>Tanggal</Text>
                            <Text style={pdfStyles.infoVal}>: {formatDate(prescription.created_at)}</Text>
                        </View>
                        <View style={pdfStyles.infoRow}>
                            <Text style={pdfStyles.infoKey}>Status</Text>
                            <Text
                                style={pdfStyles.infoVal}>: {statusMeta[prescription.status]?.label ?? prescription.status}</Text>
                        </View>
                    </View>
                </View>

                {/* DETAIL OBAT */}
                <View style={pdfStyles.table}>
                    <Text style={pdfStyles.sectionLabel}>Detail Obat</Text>
                    <View style={pdfStyles.tableHead}>
                        {["Nama Obat", "Dosis", "Frekuensi", "Durasi", "Rute"].map((h) => (
                            <Text key={h} style={pdfStyles.thCell}>{h}</Text>
                        ))}
                    </View>
                    <View style={pdfStyles.tableRow}>
                        <Text style={pdfStyles.tdCellBold}>{medicineName}</Text>
                        <Text style={pdfStyles.tdCell}>{prescription.dosage ?? "—"}</Text>
                        <Text
                            style={pdfStyles.tdCell}>{frequencyLabel[prescription.frequency] ?? prescription.frequency ?? "—"}</Text>
                        <Text style={pdfStyles.tdCell}>{prescription.duration ?? "—"}</Text>
                        <Text
                            style={pdfStyles.tdCell}>{routeLabel[prescription.route] ?? prescription.route ?? "—"}</Text>
                    </View>
                    {prescription.notes && (
                        <View style={pdfStyles.notesBox}>
                            <Text>
                                <Text style={{fontFamily: "Helvetica-Bold"}}>Catatan: </Text>
                                {prescription.notes}
                            </Text>
                        </View>
                    )}
                </View>

                {/* INSTRUKSI */}
                <View style={pdfStyles.instrBox}>
                    <Text style={pdfStyles.instrTitle}>Instruksi Penggunaan:</Text>
                    <Text style={pdfStyles.instrText}>
                        Minum obat sesuai dosis yang tertera. Habiskan obat meskipun kondisi sudah membaik.{"\n"}
                        Simpan di tempat sejuk dan kering, jauhkan dari jangkauan anak-anak.{"\n"}
                        Segera hubungi dokter jika terjadi efek samping yang tidak diinginkan.
                    </Text>
                </View>

                {/* TANDA TANGAN */}
                <View style={pdfStyles.ttdGrid}>
                    <View style={pdfStyles.ttdCol}>
                        <Text style={pdfStyles.ttdLabel}>Apoteker / Petugas Farmasi</Text>
                        <View style={pdfStyles.ttdLine}>
                            <Text>(.................................)</Text>
                        </View>
                    </View>
                    <View style={pdfStyles.ttdCol}>
                        <Text style={pdfStyles.ttdLabelSm}>Jakarta, {printDate}</Text>
                        <Text style={pdfStyles.ttdLabelMd}>Dokter Pemeriksa</Text>
                        <View style={pdfStyles.ttdLine}>
                            <Text
                                style={pdfStyles.ttdBold}>{doctor?.name ?? "(.................................)"}</Text>
                        </View>
                    </View>
                </View>

                {/* FOOTER */}
                <Text style={pdfStyles.footer}>
                    Dokumen ini dicetak secara elektronik dari sistem rekam medis {rxNumber} {printDate}
                </Text>

            </Page>
        </Document>
    );
}

/* ─── PDF Modal ──────────────────────────────────────────────── */
function PDFModal({prescription, onClose}) {
    const [downloading, setDownloading] = useState(false);
    const medicineName = prescription.medicine?.name ?? prescription.medicine_name ?? "resep";
    const rxNumber = `RX-${prescription.id?.slice(-8).toUpperCase()}`;

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const blob = await pdf(<ResepPDFDocument prescription={prescription}/>).toBlob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${rxNumber}-${medicineName}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col" style={{height: "90vh"}}>
                {/* Toolbar */}
                <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
                    <span className="font-semibold text-sm">Preview PDF Resep</span>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            className="gap-1.5 bg-teal-500 hover:bg-teal-600"
                            onClick={handleDownload}
                            disabled={downloading}
                        >
                            <Printer className="w-3.5 h-3.5"/>
                            {downloading ? "Menyiapkan..." : "Download PDF"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={onClose}>
                            <X className="w-3.5 h-3.5"/>
                        </Button>
                    </div>
                </div>

                {/* PDF Viewer — built-in toolbar browser bisa print/download langsung */}
                <div className="flex-1 overflow-hidden rounded-b-xl">
                    <PDFViewer width="100%" height="100%" showToolbar style={{border: "none"}}>
                        <ResepPDFDocument prescription={prescription}/>
                    </PDFViewer>
                </div>
            </div>
        </div>
    );
}

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

/* ─── Prescription Card ─────────────────────────────────────── */
function PrescriptionCard({prescription, onUpdateStatus, index}) {
    const [expanded, setExpanded] = useState(false);
    const [showPDF, setShowPDF] = useState(false);
    const visit = prescription.outpatient_visit;
    const patient = visit?.patient;
    const doctor = visit?.doctor;
    const medicineName = prescription.medicine?.name ?? prescription.medicine_name ?? "—";
    const bar = accentBar[prescription.status] ?? accentBar.pending;

    return (
        <>
            {showPDF && (
                <PDFModal prescription={prescription} onClose={() => setShowPDF(false)}/>
            )}

            <div style={{animation: "rx-fadeup 0.3s ease both", animationDelay: `${index * 60}ms`}}>
                <Card
                    className="overflow-hidden border border-border/60 hover:border-teal-300 hover:shadow-md transition-all duration-200">
                    <div className={`h-1 w-full bg-gradient-to-r ${bar}`}/>

                    <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div className="flex gap-4 min-w-0 flex-1">
                                <div
                                    className="flex items-center justify-center w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 shrink-0 transition-transform duration-200 hover:scale-110">
                                    <Pill className="w-5 h-5 text-teal-500"/>
                                </div>

                                <div className="space-y-1 min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-semibold text-base">{medicineName}</h3>
                                        <StatusBadge status={prescription.status}/>
                                    </div>

                                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                        {prescription.dosage && <span className="flex items-center gap-1"><Hash
                                            className="w-3 h-3"/>{prescription.dosage}</span>}
                                        {prescription.frequency && <span className="flex items-center gap-1"><Repeat2
                                            className="w-3 h-3"/>{frequencyLabel[prescription.frequency] ?? prescription.frequency}</span>}
                                        {prescription.duration && <span className="flex items-center gap-1"><Timer
                                            className="w-3 h-3"/>{prescription.duration}</span>}
                                        {prescription.route && <span className="flex items-center gap-1"><Route
                                            className="w-3 h-3"/>{routeLabel[prescription.route] ?? prescription.route}</span>}
                                        {prescription.quantity && <span className="flex items-center gap-1"><Package
                                            className="w-3 h-3"/>{prescription.quantity} unit</span>}
                                    </div>

                                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-0.5">
                                        {patient && <span className="flex items-center gap-1"><User
                                            className="w-3 h-3"/>{patient.full_name}</span>}
                                        {doctor && <span className="flex items-center gap-1"><Stethoscope
                                            className="w-3 h-3"/>{doctor.name}</span>}
                                        {prescription.created_at &&
                                            <span className="flex items-center gap-1"><CalendarDays
                                                className="w-3 h-3"/>{formatDate(prescription.created_at)}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* actions */}
                            <div className="flex sm:flex-col gap-2 shrink-0">
                                {prescription.status === "draft" && (
                                    <Button size="sm"
                                            className="gap-1.5 text-xs h-8 bg-yellow-500 hover:bg-yellow-600 active:scale-95 transition-all"
                                            onClick={() => onUpdateStatus(prescription.id, "pending")}>
                                        <Clock className="w-3.5 h-3.5"/> Ajukan
                                    </Button>
                                )}
                                {prescription.status === "pending" && (
                                    <Button size="sm"
                                            className="gap-1.5 text-xs h-8 bg-teal-500 hover:bg-teal-600 active:scale-95 transition-all"
                                            onClick={() => onUpdateStatus(prescription.id, "processing")}>
                                        <FlaskConical className="w-3.5 h-3.5"/> Proses
                                    </Button>
                                )}
                                {prescription.status === "processing" && (
                                    <Button size="sm"
                                            className="gap-1.5 text-xs h-8 bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all"
                                            onClick={() => onUpdateStatus(prescription.id, "dispensed")}>
                                        <PackageCheck className="w-3.5 h-3.5"/> Serahkan
                                    </Button>
                                )}
                                <Button variant="outline" size="sm"
                                        className="gap-1.5 text-xs h-8 active:scale-95 transition-all"
                                        onClick={() => setExpanded((p) => !p)}>
                                    <Eye className="w-3.5 h-3.5"/>
                                    {expanded ? "Tutup" : "Detail"}
                                    <ChevronDown className="w-3 h-3" style={{
                                        transition: "transform 0.3s ease",
                                        transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                                    }}/>
                                </Button>
                                <Button variant="outline" size="sm"
                                        className="gap-1.5 text-xs h-8 active:scale-95 transition-all"
                                        onClick={() => setShowPDF(true)}>
                                    <Printer className="w-3.5 h-3.5"/> Cetak
                                </Button>
                            </div>
                        </div>

                        <Collapse open={expanded}>
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
                                        {patient && <p><span
                                            className="text-muted-foreground">Pasien: </span>{patient.full_name}</p>}
                                        {doctor &&
                                            <p><span className="text-muted-foreground">Dokter: </span>{doctor.name}</p>}
                                        {visit.complain &&
                                            <p><span className="text-muted-foreground">Keluhan: </span>{visit.complain}
                                            </p>}
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
        </div>
    );
}

export default PrescriptionPage;