import { useEffect, useState, useCallback } from "react";
import {
    FileText, Plus, X, Pencil, Trash2,
    Loader2, AlertCircle, Calendar, User,
} from "lucide-react";
import { useInpatientDailyCareStore } from "@/store/inpatientDailyCareStore.js";
import { TableCell, TableRow } from "@/components/ui/table.jsx";
import DataTable from "@/components/common/data-table.jsx";
import { Button } from "@/components/ui/button.jsx";

/* ─── Helpers ────────────────────────────────────────────────── */
const fmt = (d, withTime = false) =>
    d
        ? new Date(d).toLocaleDateString("id-ID", {
            day: "numeric", month: "short", year: "numeric",
            ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
        })
        : "—";

/* ─── Confirm Dialog ─────────────────────────────────────────── */
function ConfirmDialog({ open, onClose, onConfirm, loading }) {
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
                        <p className="text-[15px] font-bold text-slate-800 leading-tight">Hapus Catatan</p>
                        <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                            Catatan perawatan ini akan dihapus permanen. Lanjutkan?
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[13px] font-semibold transition-all disabled:opacity-40 active:scale-[0.98]"
                    >
                        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Form Modal ─────────────────────────────────────────────── */
function DailyCareFormModal({ open, onClose, onSuccess, admissionId, initialData = null }) {
    const { createDailyCare, updateDailyCare } = useInpatientDailyCareStore();

    const isEdit = !!initialData;
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState("");
    const [recordedAt, setRecordedAt] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) return;
        if (isEdit) {
            setNotes(initialData.notes ?? "");
            setRecordedAt(
                initialData.recorded_at
                    ? new Date(initialData.recorded_at).toISOString().slice(0, 16)
                    : ""
            );
        } else {
            setNotes("");
            setRecordedAt(new Date().toISOString().slice(0, 16));
        }
        setError("");
    }, [open, isEdit]);

    const handleSubmit = async () => {
        if (!notes.trim()) { setError("Catatan perawatan wajib diisi."); return; }
        setError("");
        setLoading(true);
        const payload = {
            notes: notes.trim(),
            recorded_at: recordedAt || null,
        };
        const result = isEdit
            ? await updateDailyCare(admissionId, initialData.id, payload)
            : await createDailyCare(admissionId, payload);
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
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden"
                style={{ maxHeight: "90vh" }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-teal-600" />
                        </div>
                        <div>
                            <p className="text-[15px] font-bold text-slate-800 leading-tight">
                                {isEdit ? "Edit Catatan Perawatan" : "Tambah Catatan Perawatan"}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Rawat inap harian</p>
                        </div>
                    </div>
                    <Button
                        onClick={onClose}
                        disabled={loading}
                        className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

                    {/* Recorded at */}
                    <div>
                        <label className="text-[12px] font-semibold text-slate-700 mb-1.5 block">
                            Waktu Pencatatan
                        </label>
                        <input
                            type="datetime-local"
                            value={recordedAt}
                            onChange={(e) => setRecordedAt(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 focus:border-teal-400 rounded-xl px-3 py-2.5 text-[13px] text-slate-700 outline-none transition-colors"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">Kosongkan untuk menggunakan waktu sekarang.</p>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="text-[12px] font-semibold text-slate-700 mb-1.5 block">
                            Catatan Perawatan <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => { setNotes(e.target.value); setError(""); }}
                            rows={6}
                            placeholder="Tulis catatan perkembangan pasien, tindakan yang dilakukan, instruksi lanjutan..."
                            className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none resize-none transition-colors ${error ? "border-rose-400" : "border-slate-200 focus:border-teal-400"}`}
                        />
                        {error && <p className="text-[11px] text-rose-500 mt-1">{error}</p>}
                        <p className="text-[11px] text-slate-400 mt-1 text-right">{notes.length} / 2000</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-500 text-white text-[13px] font-semibold hover:bg-teal-600 active:scale-[0.98] disabled:opacity-40 transition-all"
                    >
                        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        {isEdit ? "Simpan Perubahan" : "Tambah Catatan"}
                    </button>
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

/* ─── Main Tab Component ─────────────────────────────────────── */
function InpatientDailyCareTab({ admissionId, admissionStatus }) {
    const {
        isLoading, dailyCares,
        search, setSearch,
        currentPage, setCurrentPage,
        fetchDailyCares, deleteDailyCare,
    } = useInpatientDailyCareStore();

    const [formOpen, setFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const reload = useCallback(() => {
        fetchDailyCares(admissionId, { perPage: 10 });
    }, [admissionId]);

    useEffect(() => { reload(); }, [admissionId, currentPage, search]);

    const handleDelete = async () => {
        setDeleteLoading(true);
        const result = await deleteDailyCare(admissionId, deleteTarget.id);
        setDeleteLoading(false);
        if (result?.success) { setDeleteTarget(null); reload(); }
    };

    const canWrite = admissionStatus === "admitted";

    const columns = [
        { key: "recorded_at", label: "Waktu",   width: "20%" },
        { key: "notes",       label: "Catatan", width: "55%" },
        { key: "doctor",      label: "Dokter",  width: "18%" },
        { key: "actions",     label: "Aksi",    width: "7%", align: "right" },
    ];

    const rows = dailyCares?.data ?? (Array.isArray(dailyCares) ? dailyCares : []);
    const pagination = dailyCares?.from
        ? {
            from: dailyCares.from, to: dailyCares.to,
            total: dailyCares.total, current_page: dailyCares.current_page,
            last_page: dailyCares.last_page,
        }
        : null;

    const renderRow = (row) => (
        <TableRow key={row.id} className="hover:bg-slate-50 border-b border-slate-50 last:border-none">
            {/* Waktu */}
            <TableCell className="py-3 px-5">
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-slate-300 shrink-0" />
                    <span className="text-[11px] text-slate-500 font-mono whitespace-nowrap">
                        {fmt(row.recorded_at ?? row.created_at, true)}
                    </span>
                </div>
            </TableCell>

            {/* Catatan */}
            <TableCell className="py-3 px-5">
                <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-3 whitespace-pre-line">
                    {row.notes ?? "—"}
                </p>
            </TableCell>

            {/* Dokter */}
            <TableCell className="py-3 px-5">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                        <User className="w-3 h-3 text-indigo-400" />
                    </div>
                    <span className="text-[12px] text-slate-600 line-clamp-1">
                        {row.doctor?.name ?? "—"}
                    </span>
                </div>
            </TableCell>

            {/* Aksi */}
            <TableCell className="py-3 px-5">
                {canWrite && (
                    <div className="flex items-center justify-end gap-1">
                        <button
                            onClick={() => { setEditTarget(row); setFormOpen(true); }}
                            title="Edit"
                            className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => setDeleteTarget(row)}
                            title="Hapus"
                            className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-500 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
            </TableCell>
        </TableRow>
    );

    return (
        <>
            <ConfirmDialog
                open={!!deleteTarget}
                onClose={() => !deleteLoading && setDeleteTarget(null)}
                onConfirm={handleDelete}
                loading={deleteLoading}
            />

            <DailyCareFormModal
                open={formOpen}
                onClose={() => { setFormOpen(false); setEditTarget(null); }}
                onSuccess={reload}
                admissionId={admissionId}
                initialData={editTarget}
            />

            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.08em]">
                            Perawatan Harian
                        </span>
                        {rows.length > 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                {dailyCares?.total ?? rows.length}
                            </span>
                        )}
                    </div>
                    {canWrite && (
                        <button
                            onClick={() => { setEditTarget(null); setFormOpen(true); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500 text-white text-[12px] font-semibold hover:bg-teal-600 active:scale-[0.98] transition-all"
                        >
                            <Plus className="w-3.5 h-3.5" /> Tambah Catatan
                        </button>
                    )}
                </div>

                {/* Table */}
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
                    searchPlaceholder="Cari catatan perawatan..."
                    emptyStateIcon={FileText}
                    emptyStateText="Belum ada catatan perawatan harian"
                    renderRow={renderRow}
                    showSearch={true}
                />
            </div>
        </>
    );
}

export default InpatientDailyCareTab;