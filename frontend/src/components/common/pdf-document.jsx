/**
 * ClinicalPDFDocument & PDFModal
 * Generic PDF template untuk semua halaman klinik.
 *
 * Cara pakai:
 *
 * import { PDFModal } from "@/components/common/clinical-pdf.jsx";
 *
 * <PDFModal
 *   open={!!printTarget}
 *   onClose={() => setPrintTarget(null)}
 *   fileName="resep-obat.pdf"
 *   title="Resep Obat"
 *   patient={{ full_name, medical_record_number, complaint }}
 *   doctor={{ name }}
 *   table={{
 *     columns: ["Nama Obat", "Dosis", "Frekuensi", "Durasi", "Rute"],
 *     rows: [["Cefixime 200mg", "1 tab", "3x1", "5 hari", "Oral"]]
 *   }}
 *   notes="Habiskan obat."
 *   instructions="Minum sesuai dosis..."
 *   sections={[
 *     {
 *       label: "Info Tambahan",
 *       rows: [{ key: "Batch", value: "BATCH-001" }]
 *     }
 *   ]}
 *   showSignature     // default true
 *   signerLeft="Apoteker / Petugas Farmasi"
 *   signerRight       // default nama dokter
 * />
 */

import {useState} from "react";
import {
    Document, Page, Text, View, StyleSheet, PDFViewer, pdf,
} from "@react-pdf/renderer";
import {Button} from "@/components/ui/button.jsx";
import {Printer, X, Download} from "lucide-react";

/* ─── Clinic config — ganti sesuai kebutuhan ─────────────────── */
const CLINIC = {
    name:    "Klinik Sehat Bersama",
    address: "Jl. Kesehatan No. 1, Jakarta Selatan  |  Telp: (021) 555-0100",
    sip:     "SIP: 503/KL/DKK/2024  |  Buka: Senin-Sabtu 08.00-21.00",
};

/* ─── PDF StyleSheet ─────────────────────────────────────────── */
const S = StyleSheet.create({
    page:       { padding: "16mm 20mm", fontFamily: "Helvetica", fontSize: 10, color: "#1e293b", backgroundColor: "#fff" },

    // ── KOP ──
    header:     { flexDirection: "row", alignItems: "center", borderBottomWidth: 3, borderBottomColor: "#0d9488", paddingBottom: 10, marginBottom: 16, gap: 12 },
    logoBox:    { width: 48, height: 48, borderRadius: 8, backgroundColor: "#0d9488", alignItems: "center", justifyContent: "center" },
    logoText:   { color: "#fff", fontSize: 26, fontFamily: "Helvetica-Bold" },
    clinicName: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#0d9488" },
    clinicSub:  { fontSize: 8, color: "#555", marginTop: 2 },

    // ── Title ──
    titleWrap:  { alignItems: "center", marginBottom: 16 },
    titleText:  { fontSize: 14, fontFamily: "Helvetica-Bold", letterSpacing: 2 },
    docNumber:  { fontSize: 9, color: "#666", marginTop: 3 },

    // ── Info grid ──
    infoGrid:   { flexDirection: "row", gap: 10, backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 6, padding: 10, marginBottom: 14 },
    infoCol:    { flex: 1 },
    infoLabel:  { fontSize: 7, fontFamily: "Helvetica-Bold", color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
    infoRow:    { flexDirection: "row", marginBottom: 3 },
    infoKey:    { width: 55, color: "#64748b", fontSize: 9 },
    infoVal:    { flex: 1, fontSize: 9 },
    infoValB:   { flex: 1, fontSize: 9, fontFamily: "Helvetica-Bold" },

    // ── Section label ──
    sectionLbl: { fontSize: 7, fontFamily: "Helvetica-Bold", color: "#64748b", textTransform: "uppercase", letterSpacing: 1, borderBottomWidth: 1, borderBottomColor: "#e2e8f0", paddingBottom: 4, marginBottom: 8, marginTop: 4 },

    // ── Table ──
    tableWrap:  { marginBottom: 14 },
    tableHead:  { flexDirection: "row", backgroundColor: "#f1f5f9", borderWidth: 1, borderColor: "#e2e8f0" },
    tableRow:   { flexDirection: "row", borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: "#e2e8f0" },
    thCell:     { flex: 1, padding: "5px 7px", fontSize: 8, fontFamily: "Helvetica-Bold", borderRightWidth: 1, borderRightColor: "#e2e8f0" },
    tdCell:     { flex: 1, padding: 7, fontSize: 9, borderRightWidth: 1, borderRightColor: "#e2e8f0" },
    tdCellB:    { flex: 1, padding: 7, fontSize: 9, fontFamily: "Helvetica-Bold", borderRightWidth: 1, borderRightColor: "#e2e8f0" },

    // ── Extra sections (key-value rows) ──
    kvRow:      { flexDirection: "row", marginBottom: 3 },
    kvKey:      { width: 100, color: "#64748b", fontSize: 9 },
    kvVal:      { flex: 1, fontSize: 9 },

    // ── Notes ──
    notesBox:   { backgroundColor: "#fffbeb", borderWidth: 1, borderColor: "#fde68a", borderRadius: 4, padding: "7px 10px", marginBottom: 10, fontSize: 9 },
    notesB:     { fontFamily: "Helvetica-Bold" },

    // ── Instructions ──
    instrBox:   { backgroundColor: "#f0fdf4", borderWidth: 1, borderColor: "#bbf7d0", borderRadius: 6, padding: "9px 12px", marginBottom: 20 },
    instrTitle: { fontFamily: "Helvetica-Bold", color: "#166534", fontSize: 9, marginBottom: 4 },
    instrText:  { color: "#15803d", fontSize: 8.5, lineHeight: 1.5 },

    // ── Signature ──
    ttdGrid:    { flexDirection: "row", gap: 30, marginTop: 8 },
    ttdCol:     { flex: 1, alignItems: "center" },
    ttdRole:    { fontSize: 9, marginBottom: 50 },
    ttdLine:    { borderTopWidth: 1, borderTopColor: "#000", paddingTop: 4, fontSize: 9, width: "100%", textAlign: "center" },
    ttdName:    { fontFamily: "Helvetica-Bold" },
    ttdDate:    { fontSize: 9, marginBottom: 4 },
    ttdDoctor:  { fontSize: 9, marginBottom: 34 },

    // ── Footer ──
    footer:     { marginTop: 20, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#cbd5e1", textAlign: "center", fontSize: 7.5, color: "#94a3b8" },
});

/* ─── Helper ─────────────────────────────────────────────────── */
const today = () => new Date().toLocaleDateString("id-ID", {day: "numeric", month: "long", year: "numeric"});
const docId  = (title) => `${title.replace(/\s+/g, "-").toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

/* ─── ClinicalPDFDocument ────────────────────────────────────── */
/**
 * @param {string}   title              Judul dokumen, e.g. "Resep Obat"
 * @param {object}   [patient]          { full_name, medical_record_number, complaint }
 * @param {object}   [doctor]           { name }
 * @param {object}   [table]            { columns: string[], rows: string[][], firstColBold?: boolean }
 * @param {string}   [notes]            Teks catatan (optional)
 * @param {string}   [instructions]     Teks instruksi (optional)
 * @param {Array}    [sections]         Extra sections: [{ label, rows: [{key, value}] }]
 * @param {boolean}  [showSignature]    Default true
 * @param {string}   [signerLeft]       Label ttd kiri, default "Apoteker / Petugas Farmasi"
 * @param {string}   [signerRight]      Nama ttd kanan, default nama dokter
 * @param {string}   [docNumber]        Override nomor dokumen
 */
export function ClinicalPDFDocument({
                                        title = "Dokumen Klinik",
                                        patient,
                                        doctor,
                                        table,
                                        notes,
                                        instructions,
                                        sections = [],
                                        showSignature = true,
                                        signerLeft = "Apoteker / Petugas Farmasi",
                                        signerRight,
                                        docNumber,
                                    }) {
    const printDate = today();
    const rxNum     = docNumber ?? docId(title);
    const rightName = signerRight ?? doctor?.name ?? "(..................................)";

    return (
        <Document title={`${title} - ${patient?.full_name ?? ""}`}>
            <Page size="A4" style={S.page}>

                {/* ── KOP ── */}
                <View style={S.header}>
                    <View style={S.logoBox}>
                        <Text style={S.logoText}>+</Text>
                    </View>
                    <View>
                        <Text style={S.clinicName}>{CLINIC.name}</Text>
                        <Text style={S.clinicSub}>{CLINIC.address}</Text>
                        <Text style={S.clinicSub}>{CLINIC.sip}</Text>
                    </View>
                </View>

                {/* ── Title ── */}
                <View style={S.titleWrap}>
                    <Text style={S.titleText}>{title.toUpperCase()}</Text>
                    <Text style={S.docNumber}>No. Dokumen: {rxNum}</Text>
                </View>

                {/* ── Info Pasien + Dokter ── */}
                {(patient || doctor) && (
                    <View style={S.infoGrid}>
                        {patient && (
                            <View style={S.infoCol}>
                                <Text style={S.infoLabel}>Data Pasien</Text>
                                {[
                                    ["Nama",   patient.full_name,              true],
                                    ["No. MR", patient.medical_record_number,  false],
                                    ["Keluhan",patient.complaint ?? patient.complain, false],
                                ].filter(([, v]) => v).map(([k, v, bold]) => (
                                    <View key={k} style={S.infoRow}>
                                        <Text style={S.infoKey}>{k}</Text>
                                        <Text style={bold ? S.infoValB : S.infoVal}>: {v}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                        {(doctor || patient) && (
                            <View style={S.infoCol}>
                                <Text style={S.infoLabel}>Data Dokter & Tanggal</Text>
                                {[
                                    ["Dokter",  doctor?.name,  true],
                                    ["Tanggal", printDate,     false],
                                ].filter(([, v]) => v).map(([k, v, bold]) => (
                                    <View key={k} style={S.infoRow}>
                                        <Text style={S.infoKey}>{k}</Text>
                                        <Text style={bold ? S.infoValB : S.infoVal}>: {v}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                )}

                {/* ── Tabel utama ── */}
                {table && table.columns?.length > 0 && (
                    <View style={S.tableWrap}>
                        <Text style={S.sectionLbl}>Detail</Text>
                        <View style={S.tableHead}>
                            {table.columns.map((col, i) => (
                                <Text key={i} style={S.thCell}>{col}</Text>
                            ))}
                        </View>
                        {(table.rows ?? []).map((row, ri) => (
                            <View key={ri} style={S.tableRow}>
                                {row.map((cell, ci) => (
                                    <Text
                                        key={ci}
                                        style={ci === 0 && table.firstColBold !== false ? S.tdCellB : S.tdCell}
                                    >
                                        {cell ?? "—"}
                                    </Text>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {/* ── Extra sections (key-value) ── */}
                {sections.map((sec, si) => (
                    <View key={si}>
                        {sec.label && <Text style={S.sectionLbl}>{sec.label}</Text>}
                        {(sec.rows ?? []).map(({key, value}, ri) => (
                            <View key={ri} style={S.kvRow}>
                                <Text style={S.kvKey}>{key}</Text>
                                <Text style={S.kvVal}>: {value ?? "—"}</Text>
                            </View>
                        ))}
                    </View>
                ))}

                {/* ── Notes ── */}
                {notes && (
                    <View style={S.notesBox}>
                        <Text>
                            <Text style={S.notesB}>Catatan: </Text>
                            {notes}
                        </Text>
                    </View>
                )}

                {/* ── Instruksi ── */}
                {instructions && (
                    <View style={S.instrBox}>
                        <Text style={S.instrTitle}>Instruksi Penggunaan:</Text>
                        <Text style={S.instrText}>{instructions}</Text>
                    </View>
                )}

                {/* ── Tanda tangan ── */}
                {showSignature && (
                    <View style={S.ttdGrid}>
                        <View style={S.ttdCol}>
                            <Text style={S.ttdRole}>{signerLeft}</Text>
                            <View style={S.ttdLine}>
                                <Text>(..........................)</Text>
                            </View>
                        </View>
                        <View style={S.ttdCol}>
                            <Text style={S.ttdDate}>Jakarta, {printDate}</Text>
                            <Text style={S.ttdDoctor}>Dokter Pemeriksa</Text>
                            <View style={S.ttdLine}>
                                <Text style={S.ttdName}>{rightName}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* ── Footer ── */}
                <Text style={S.footer}>
                    Dokumen ini dicetak secara elektronik dari sistem rekam medis  |  {rxNum}  |  {printDate}
                </Text>

            </Page>
        </Document>
    );
}

/* ─── PDFModal ───────────────────────────────────────────────── */
/**
 * Wrapper modal untuk preview + download PDF.
 * Semua props diteruskan ke ClinicalPDFDocument.
 *
 * @param {boolean}  open        Tampilkan modal
 * @param {function} onClose     Callback tutup modal
 * @param {string}   [fileName]  Nama file download, default "dokumen.pdf"
 * @param {...}      rest        Semua props ClinicalPDFDocument
 */
export function PDFModal({open, onClose, fileName = "dokumen.pdf", ...docProps}) {
    const [downloading, setDownloading] = useState(false);

    if (!open) return null;

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const blob = await pdf(<ClinicalPDFDocument {...docProps}/>).toBlob();
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement("a");
            a.href     = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col"
                style={{height: "90vh"}}
            >
                {/* Toolbar */}
                <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
                    <span className="font-semibold text-sm">Preview PDF — {docProps.title ?? "Dokumen"}</span>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            className="gap-1.5 bg-teal-500 hover:bg-teal-600"
                            onClick={handleDownload}
                            disabled={downloading}
                        >
                            <Download className="w-3.5 h-3.5"/>
                            {downloading ? "Menyiapkan..." : "Download PDF"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={onClose}>
                            <X className="w-3.5 h-3.5"/>
                        </Button>
                    </div>
                </div>

                {/* PDF Viewer */}
                <div className="flex-1 overflow-hidden rounded-b-xl">
                    <PDFViewer width="100%" height="100%" showToolbar style={{border: "none"}}>
                        <ClinicalPDFDocument {...docProps}/>
                    </PDFViewer>
                </div>
            </div>
        </div>
    );
}