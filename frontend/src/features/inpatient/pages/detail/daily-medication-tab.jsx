import { useEffect, useState, useCallback } from "react";
import {
    Pill, Plus, X, Loader2,
    Pencil, Trash2, Ban, PackageCheck,
    AlertCircle, Calendar, FlaskConical,
    RotateCcw, AlertTriangle,
} from "lucide-react";
import { useInpatientDailyMedicationStore } from "@features/inpatient";
import { AsyncSelect } from "@shared/components/common/async-select.jsx";
import { TableCell, TableRow } from "@shared/components/ui/table.jsx";
import DataTable from "@shared/components/common/data-table.jsx";
import { Button } from "@shared/components/ui/button.jsx";
import apiCall from "@shared/services/apiCall.js";

/* ─── Constants ─────────────────────────────────────────── */
const ROUTES      = ["Oral", "IV", "IM", "SC", "Sublingual", "Topikal", "Inhalasi", "Rektal"];
const FREQUENCIES = ["1x sehari", "2x sehari", "3x sehari", "4x sehari", "Setiap 6 jam", "Setiap 8 jam", "Setiap 12 jam", "Jika perlu (prn)"];

const STATUS_CFG = {
    draft:     { label: "Draft",     cls: "bg-amber-50 text-amber-700 border-amber-200",   dot: "bg-amber-400"  },
    dispensed: { label: "Diberikan", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
    cancelled: { label: "Dibatalkan",cls: "bg-rose-50 text-rose-700 border-rose-200",      dot: "bg-rose-400"   },
};

/* ─── Helpers ────────────────────────────────────────────── */
const fmt = (d, withTime = false) =>
    d ? new Date(d).toLocaleDateString("id-ID", {
        day: "numeric", month: "short", year: "numeric",
        ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    }) : "—";

/* ─── AsyncSelect fetch fn ───────────────────────────────── */
const fetchMedicinesWithStock = async (search) => {
    const resp = await apiCall.get("/api/v1/pharmacy/medicines/search-with-stock", {
        params: { search, limit: 20 },
    });
    // resp.data is already [{value, label, base_unit, total_stock, sku}]
    return resp.data;
};

/* ─── Status Badge ───────────────────────────────────────── */
function StatusBadge({ status }) {
    const cfg = STATUS_CFG[status] ?? STATUS_CFG.draft;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${cfg.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
            {cfg.label}
        </span>
    );
}

/* ─── Stock Badge (shown in dropdown option) ─────────────── */
function StockBadge({ stock, unit }) {
    const low = stock <= 10;
    return (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${
            low ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
        }`}>
            {stock} {unit}
        </span>
    );
}

/* ─── Confirm Dialog ─────────────────────────────────────── */
function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel, confirmCls, loading }) {
    if (!open) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(15,23,42,0.5)", backdropFilter: "blur(2px)" }}
            onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
                <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                    </div>
                    <div>
                        <p className="text-[15px] font-bold text-slate-800 leading-tight">{title}</p>
                        <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">{description}</p>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                    <button onClick={onClose} disabled={loading}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40">
                        Batal
                    </button>
                    <button onClick={onConfirm} disabled={loading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white text-[13px] font-semibold transition-all disabled:opacity-40 active:scale-[0.98] ${confirmCls}`}>
                        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Medication Form Modal ──────────────────────────────── */
function MedicationFormModal({ open, onClose, onSuccess, admissionId, initialData = null }) {
    const { createMedication, updateMedication } = useInpatientDailyMedicationStore();

    const isEdit = !!initialData;
    const [loading, setLoading] = useState(false);

    // Selected medicine option — full object {value, label, base_unit, total_stock}
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [medicineId, setMedicineId] = useState("");

    const [form, setForm] = useState({
        dosage: "", frequency: "", route: "", quantity: "",
        given_date: new Date().toISOString().split("T")[0],
        notes: "",
    });
    const [errors, setErrors] = useState({});

    // Stock warning: quantity > available stock
    const stockWarning = (() => {
        if (!selectedMedicine || !form.quantity) return null;
        const qty = Number(form.quantity);
        const avail = selectedMedicine.total_stock ?? 0;
        if (qty > avail) return `Stok tidak cukup. Tersedia: ${avail} ${selectedMedicine.base_unit ?? ""}.`;
        if (avail <= 10) return `Stok menipis: ${avail} ${selectedMedicine.base_unit ?? ""} tersisa.`;
        return null;
    })();

    const isStockInsufficient =
        selectedMedicine && form.quantity &&
        Number(form.quantity) > (selectedMedicine.total_stock ?? 0);

    useEffect(() => {
        if (!open) return;
        if (isEdit) {
            setMedicineId(initialData.medicine?.id ?? "");
            // Reconstruct option from existing data (no stock info on edit — just show name)
            setSelectedMedicine(initialData.medicine
                ? { value: initialData.medicine.id, label: initialData.medicine.name,
                    base_unit: initialData.medicine.base_unit, total_stock: null }
                : null
            );
            setForm({
                dosage:     initialData.dosage ?? "",
                frequency:  initialData.frequency ?? "",
                route:      initialData.route ?? "",
                quantity:   initialData.quantity ?? "",
                given_date: initialData.given_date ?? new Date().toISOString().split("T")[0],
                notes:      initialData.notes ?? "",
            });
        } else {
            setMedicineId("");
            setSelectedMedicine(null);
            setForm({ dosage: "", frequency: "", route: "", quantity: "",
                given_date: new Date().toISOString().split("T")[0], notes: "" });
        }
        setErrors({});
    }, [open, isEdit]);

    const setField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
    };

    const handleMedicineChange = (val, option) => {
        setMedicineId(val);
        setSelectedMedicine(option ?? null);
        if (errors.medicine_id) setErrors((prev) => ({ ...prev, medicine_id: null }));
    };

    const validate = () => {
        const e = {};
        if (!medicineId)              e.medicine_id = "Pilih obat terlebih dahulu.";
        if (!form.dosage.trim())       e.dosage      = "Dosis wajib diisi.";
        if (!form.frequency.trim())    e.frequency   = "Frekuensi wajib dipilih.";
        if (!form.route.trim())        e.route       = "Rute pemberian wajib dipilih.";
        if (!form.quantity || Number(form.quantity) < 1) e.quantity = "Jumlah minimal 1.";
        if (!form.given_date)          e.given_date  = "Tanggal pemberian wajib diisi.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        if (isStockInsufficient) return; // extra guard
        setLoading(true);
        const payload = {
            medicine_id: medicineId,
            dosage:      form.dosage,
            frequency:   form.frequency,
            route:       form.route,
            quantity:    Number(form.quantity),
            given_date:  form.given_date,
            notes:       form.notes || null,
        };
        const result = isEdit
            ? await updateMedication(admissionId, initialData.id, payload)
            : await createMedication(admissionId, payload);
        setLoading(false);
        if (result?.success) { onSuccess?.(); onClose(); }
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(15,23,42,0.5)", backdropFilter: "blur(2px)" }}
            onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}
        >
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden"
                 style={{ maxHeight: "92vh" }}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                            <Pill className="w-4 h-4 text-teal-600" />
                        </div>
                        <div>
                            <p className="text-[15px] font-bold text-slate-800 leading-tight">
                                {isEdit ? "Edit Resep Obat" : "Tambah Resep Obat"}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Obat harian rawat inap</p>
                        </div>
                    </div>
                    <Button onClick={onClose} disabled={loading}
                            className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

                    {/* ── Medicine AsyncSelect ── */}
                    <div>
                        <label className="text-[12px] font-semibold text-slate-700 mb-1.5 block">
                            Obat <span className="text-rose-500">*</span>
                        </label>
                        <AsyncSelect
                            fetchFn={fetchMedicinesWithStock}
                            value={medicineId}
                            onChange={(val) => {
                                // AsyncSelect calls onChange(value) — we need the full option
                                // We intercept via renderOption cache trick below
                                setMedicineId(val);
                                if (errors.medicine_id) setErrors((p) => ({ ...p, medicine_id: null }));
                            }}
                            placeholder="Ketik nama obat..."
                            debounce={400}
                            minChars={0}
                            defaultLabel={selectedMedicine?.label ?? null}
                            renderOption={(opt) => (
                                <div className="flex items-center justify-between gap-3 flex-1 min-w-0"
                                     onClick={() => {
                                         // Capture full option on click
                                         setSelectedMedicine(opt);
                                     }}
                                >
                                    <div className="min-w-0">
                                        <p className="text-[13px] font-medium text-slate-800 truncate">{opt.label}</p>
                                        <p className="text-[10px] text-slate-400">{opt.sku}</p>
                                    </div>
                                    <StockBadge stock={opt.total_stock ?? 0} unit={opt.base_unit ?? ""} />
                                </div>
                            )}
                            renderValue={(opt) => (
                                <span className="text-[13px] text-slate-800">{opt.label}</span>
                            )}
                            className={errors.medicine_id ? "ring-1 ring-rose-400 rounded-md" : ""}
                        />
                        {errors.medicine_id && (
                            <p className="text-[11px] text-rose-500 mt-1">{errors.medicine_id}</p>
                        )}

                        {/* Stock warning / insufficient */}
                        {stockWarning && (
                            <div className={`flex items-center gap-2 mt-2 px-3 py-2 rounded-xl border text-[12px] font-medium ${
                                isStockInsufficient
                                    ? "bg-rose-50 border-rose-200 text-rose-700"
                                    : "bg-amber-50 border-amber-200 text-amber-700"
                            }`}>
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                {stockWarning}
                            </div>
                        )}
                    </div>

                    {/* Dosage + Frequency */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[12px] font-semibold text-slate-700 mb-1.5 block">
                                Dosis <span className="text-rose-500">*</span>
                            </label>
                            <input value={form.dosage} onChange={(e) => setField("dosage", e.target.value)}
                                   placeholder="Contoh: 500mg"
                                   className={`w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none transition-colors ${errors.dosage ? "border-rose-400" : "border-slate-200 focus:border-teal-400"}`}
                            />
                            {errors.dosage && <p className="text-[11px] text-rose-500 mt-1">{errors.dosage}</p>}
                        </div>
                        <div>
                            <label className="text-[12px] font-semibold text-slate-700 mb-1.5 block">
                                Frekuensi <span className="text-rose-500">*</span>
                            </label>
                            <select value={form.frequency} onChange={(e) => setField("frequency", e.target.value)}
                                    className={`w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-[13px] text-slate-700 outline-none transition-colors ${errors.frequency ? "border-rose-400" : "border-slate-200 focus:border-teal-400"}`}>
                                <option value="">Pilih frekuensi</option>
                                {FREQUENCIES.map((f) => <option key={f} value={f}>{f}</option>)}
                            </select>
                            {errors.frequency && <p className="text-[11px] text-rose-500 mt-1">{errors.frequency}</p>}
                        </div>
                    </div>

                    {/* Route + Quantity */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[12px] font-semibold text-slate-700 mb-1.5 block">
                                Rute Pemberian <span className="text-rose-500">*</span>
                            </label>
                            <select value={form.route} onChange={(e) => setField("route", e.target.value)}
                                    className={`w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-[13px] text-slate-700 outline-none transition-colors ${errors.route ? "border-rose-400" : "border-slate-200 focus:border-teal-400"}`}>
                                <option value="">Pilih rute</option>
                                {ROUTES.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                            {errors.route && <p className="text-[11px] text-rose-500 mt-1">{errors.route}</p>}
                        </div>
                        <div>
                            <label className="text-[12px] font-semibold text-slate-700 mb-1.5 block">
                                Jumlah{selectedMedicine ? ` (stok: ${selectedMedicine.total_stock ?? "?"} ${selectedMedicine.base_unit ?? ""})` : ""} <span className="text-rose-500">*</span>
                            </label>
                            <input type="number" min={1} value={form.quantity}
                                   onChange={(e) => setField("quantity", e.target.value)}
                                   placeholder="0"
                                   className={`w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none transition-colors ${
                                       errors.quantity || isStockInsufficient ? "border-rose-400" : "border-slate-200 focus:border-teal-400"
                                   }`}
                            />
                            {errors.quantity && <p className="text-[11px] text-rose-500 mt-1">{errors.quantity}</p>}
                        </div>
                    </div>

                    {/* Given date */}
                    <div>
                        <label className="text-[12px] font-semibold text-slate-700 mb-1.5 block">
                            Tanggal Pemberian <span className="text-rose-500">*</span>
                        </label>
                        <input type="date" value={form.given_date}
                               onChange={(e) => setField("given_date", e.target.value)}
                               className={`w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-[13px] text-slate-700 outline-none transition-colors ${errors.given_date ? "border-rose-400" : "border-slate-200 focus:border-teal-400"}`}
                        />
                        {errors.given_date && <p className="text-[11px] text-rose-500 mt-1">{errors.given_date}</p>}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="text-[12px] font-semibold text-slate-700 mb-1.5 block">Catatan</label>
                        <textarea value={form.notes} onChange={(e) => setField("notes", e.target.value)}
                                  rows={3} placeholder="Instruksi tambahan untuk perawat / apoteker..."
                                  className="w-full bg-slate-50 border border-slate-200 focus:border-teal-400 rounded-xl px-3.5 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none resize-none transition-colors"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-2 shrink-0">
                    {isStockInsufficient && (
                        <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            Stok tidak mencukupi
                        </p>
                    )}
                    <div className="flex items-center gap-2 ml-auto">
                        <button onClick={onClose} disabled={loading}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40">
                            Batal
                        </button>
                        <button onClick={handleSubmit} disabled={loading || isStockInsufficient}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-500 text-white text-[13px] font-semibold hover:bg-teal-600 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            {isEdit ? "Simpan Perubahan" : "Tambah Obat"}
                        </button>
                    </div>
                </div>

                {loading && (
                    <div className="absolute inset-0 bg-white/70 rounded-2xl flex items-center justify-center">
                        <Loader2 className="w-7 h-7 text-teal-500 animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─── Main Component ─────────────────────────────────────── */
function InpatientDailyMedicationTab({ admissionId, admissionStatus }) {
    const {
        isLoading, medications,
        search, setSearch,
        statusFilter, setStatusFilter,
        givenDateFilter, setGivenDateFilter,
        currentPage, setCurrentPage,
        fetchMedications, dispenseMedication, cancelMedication, deleteMedication,
    } = useInpatientDailyMedicationStore();

    const [formOpen, setFormOpen]     = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [confirm, setConfirm]       = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const reload = useCallback(() => {
        fetchMedications(admissionId, { perPage: 15 });
    }, [admissionId]);

    useEffect(() => { reload(); }, [admissionId, currentPage, search, statusFilter, givenDateFilter]);

    const handleAction = async () => {
        if (!confirm) return;
        setActionLoading(true);
        let result;
        if (confirm.type === "dispense") result = await dispenseMedication(admissionId, confirm.id);
        else if (confirm.type === "cancel") result = await cancelMedication(admissionId, confirm.id);
        else if (confirm.type === "delete") result = await deleteMedication(admissionId, confirm.id);
        setActionLoading(false);
        if (result?.success) { setConfirm(null); reload(); }
    };

    const canWrite = admissionStatus === "admitted";

    const columns = [
        { key: "given_date", label: "Tanggal",  width: "12%" },
        { key: "medicine",   label: "Obat",     width: "22%" },
        { key: "detail",     label: "Detail",   width: "28%" },
        { key: "quantity",   label: "Jumlah",   width: "8%"  },
        { key: "status",     label: "Status",   width: "13%" },
        { key: "prescriber", label: "Dokter",   width: "12%" },
        { key: "actions",    label: "Aksi",     width: "10%", align: "right" },
    ];

    const rows = medications?.data ?? (Array.isArray(medications) ? medications : []);
    const pagination = medications?.from ? {
        from: medications.from, to: medications.to,
        total: medications.total, current_page: medications.current_page,
        last_page: medications.last_page,
    } : null;

    const renderRow = (row) => (
        <TableRow key={row.id} className="hover:bg-slate-50 border-b border-slate-50 last:border-none">
            <TableCell className="py-3 px-5">
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-slate-300 shrink-0" />
                    <span className="text-[12px] text-slate-500 font-mono">{fmt(row.given_date)}</span>
                </div>
            </TableCell>
            <TableCell className="py-3 px-5">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                        <Pill className="w-3.5 h-3.5 text-teal-500" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-slate-800 leading-tight line-clamp-1">{row.medicine?.name ?? "—"}</p>
                        <p className="text-[10px] text-slate-400">{row.medicine?.base_unit ?? ""}</p>
                    </div>
                </div>
            </TableCell>
            <TableCell className="py-3 px-5">
                <div className="space-y-0.5">
                    <p className="text-[12px] text-slate-700">
                        <span className="font-medium">{row.dosage}</span>{" · "}
                        <span className="text-slate-500">{row.frequency}</span>
                    </p>
                    <div className="flex items-center gap-1">
                        <FlaskConical className="w-3 h-3 text-slate-300" />
                        <span className="text-[11px] text-slate-400">{row.route}</span>
                    </div>
                    {row.notes && <p className="text-[11px] text-slate-400 italic line-clamp-1">{row.notes}</p>}
                </div>
            </TableCell>
            <TableCell className="py-3 px-5">
                <span className="text-[13px] font-semibold text-slate-700">{row.quantity}</span>
            </TableCell>
            <TableCell className="py-3 px-5">
                <StatusBadge status={row.status?.value ?? row.status} />
                {row.dispensed_at && (
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">{fmt(row.dispensed_at)}</p>
                )}
            </TableCell>
            <TableCell className="py-3 px-5">
                <p className="text-[12px] text-slate-600 line-clamp-1">{row.prescribed_by?.name ?? "—"}</p>
            </TableCell>
            <TableCell className="py-3 px-5">
                <div className="flex items-center justify-end gap-1">
                    {(row.status?.value ?? row.status) === "draft" && canWrite && (
                        <>
                            <button onClick={() => setConfirm({ type: "dispense", id: row.id, name: row.medicine?.name })}
                                    title="Berikan Obat"
                                    className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 transition-colors">
                                <PackageCheck className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => { setEditTarget(row); setFormOpen(true); }}
                                    title="Edit"
                                    className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 transition-colors">
                                <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setConfirm({ type: "cancel", id: row.id, name: row.medicine?.name })}
                                    title="Batalkan"
                                    className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 transition-colors">
                                <Ban className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setConfirm({ type: "delete", id: row.id, name: row.medicine?.name })}
                                    title="Hapus"
                                    className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-500 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </>
                    )}
                    {(row.status?.value ?? row.status) !== "draft" && (
                        <span className="text-[11px] text-slate-300">—</span>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );

    const ACTION_CFG = {
        dispense: { title: "Berikan Obat",   description: (n) => `Konfirmasi pemberian obat "${n}"? Stok akan dikurangi.`, confirmLabel: "Berikan",        confirmCls: "bg-emerald-500 hover:bg-emerald-600" },
        cancel:   { title: "Batalkan Resep", description: (n) => `Batalkan resep obat "${n}"?`,                            confirmLabel: "Batalkan Resep", confirmCls: "bg-amber-500 hover:bg-amber-600"   },
        delete:   { title: "Hapus Resep",    description: (n) => `Hapus resep obat "${n}"? Data akan dihapus permanen.`,   confirmLabel: "Hapus",          confirmCls: "bg-rose-500 hover:bg-rose-600"     },
    };
    const activeCfg = confirm ? ACTION_CFG[confirm.type] : null;

    return (
        <>
            <ConfirmDialog
                open={!!confirm}
                onClose={() => !actionLoading && setConfirm(null)}
                onConfirm={handleAction}
                loading={actionLoading}
                title={activeCfg?.title ?? ""}
                description={activeCfg?.description(confirm?.name) ?? ""}
                confirmLabel={activeCfg?.confirmLabel ?? ""}
                confirmCls={activeCfg?.confirmCls ?? ""}
            />

            <MedicationFormModal
                open={formOpen}
                onClose={() => { setFormOpen(false); setEditTarget(null); }}
                onSuccess={reload}
                admissionId={admissionId}
                initialData={editTarget}
            />

            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <Pill className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.08em]">Obat Harian</span>
                        {rows.length > 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                {medications?.total ?? rows.length}
                            </span>
                        )}
                    </div>
                    {canWrite && (
                        <button onClick={() => { setEditTarget(null); setFormOpen(true); }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500 text-white text-[12px] font-semibold hover:bg-teal-600 active:scale-[0.98] transition-all">
                            <Plus className="w-3.5 h-3.5" /> Tambah Obat
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 flex-wrap px-5 py-3 border-b border-slate-50 bg-slate-50/50">
                    <select value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                            className="text-[12px] border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-600 outline-none focus:border-teal-400">
                        <option value="">Semua status</option>
                        <option value="draft">Draft</option>
                        <option value="dispensed">Diberikan</option>
                        <option value="cancelled">Dibatalkan</option>
                    </select>
                    <input type="date" value={givenDateFilter}
                           onChange={(e) => { setGivenDateFilter(e.target.value); setCurrentPage(1); }}
                           className="text-[12px] border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-600 outline-none focus:border-teal-400"
                    />
                    {(statusFilter || givenDateFilter) && (
                        <button onClick={() => { setStatusFilter(""); setGivenDateFilter(""); setCurrentPage(1); }}
                                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-500 transition-colors">
                            <RotateCcw className="w-3 h-3" /> Reset
                        </button>
                    )}
                </div>

                <DataTable
                    title=""
                    columns={columns}
                    data={rows}
                    isLoading={isLoading}
                    pagination={pagination}
                    onPageChange={setCurrentPage}
                    currentPage={currentPage}
                    onSearch={(val) => { setSearch(val); setCurrentPage(1); }}
                    search={search}
                    searchPlaceholder="Cari nama obat..."
                    emptyStateIcon={Pill}
                    emptyStateText="Belum ada resep obat harian"
                    renderRow={renderRow}
                    showSearch={true}
                />
            </div>
        </>
    );
}

export default InpatientDailyMedicationTab;