import {useInpatientAdmissionStore} from "@features/inpatient";
import {useRoomStore} from "@features/facilities";
import InpatientDailyMedicationTab from "@features/inpatient/pages/detail/daily-medication-tab.jsx";
import InpatientDailyCareTab from "@features/inpatient/pages/detail/daily-care-tab.jsx";
import {useNavigate, useParams} from "@tanstack/react-router";
import {useEffect, useState, useCallback, useMemo} from "react";
import Layout from "@features/dashboard/pages/layout.jsx";
import {TableCell, TableRow} from "@shared/components/ui/table";
import {
    ArrowLeft, User, BedDouble, Activity,
    Calendar, MapPin, Phone, Briefcase, HeartPulse,
    Thermometer, Wind, Droplets,
    ArrowRightLeft, X, ChevronRight, Check,
    Search, AlertCircle, Loader2, Building2, Layers,
    History, LogIn, LogOut, MoveRight,
} from "lucide-react";
import {Button} from "@shared/components/ui/button.jsx";
import apiCall from "@shared/services/apiCall.js";

/* ─── Status ─────────────────────────────────────────────────── */
const STATUS_MAP = {
    admitted: {label: "Dirawat", dot: true, cls: "bg-emerald-50 text-emerald-700 border-emerald-200"},
    discharged: {label: "Pulang", dot: false, cls: "bg-slate-100  text-slate-600   border-slate-200"},
    cancelled: {label: "Dibatalkan", dot: false, cls: "bg-rose-50    text-rose-700    border-rose-200"},
};

/* ─── Helpers ────────────────────────────────────────────────── */
const fmt = (d, time = false) =>
    d ? new Date(d).toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric",
        ...(time ? {hour: "2-digit", minute: "2-digit"} : {}),
    }) : null;

const calcAge = (dob) =>
    dob ? Math.floor((Date.now() - new Date(dob)) / (1000 * 60 * 60 * 24 * 365.25)) + " tahun" : null;

const ini = (name) =>
    name?.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase() ?? "?";

/* ─── Shared atoms ───────────────────────────────────────────── */

function SectionLabel({icon: Icon, children, action}) {
    return (
        <div className="flex items-center justify-between gap-2 px-5 py-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-teal-500 shrink-0"/>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.08em]">{children}</span>
            </div>
            {action}
        </div>
    );
}

function InfoRow({icon: Icon, label, value, mono = false, span = false}) {
    if (!value) return null;
    return (
        <div
            className={`flex items-start gap-3 px-5 py-3 border-b border-slate-50 last:border-none ${span ? "col-span-2" : ""}`}>
            <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-3.5 h-3.5 text-slate-400"/>
            </div>
            <div className="min-w-0">
                <p className="text-[10px] text-slate-400 mb-0.5">{label}</p>
                <p className={`text-[13px] font-medium text-slate-800 break-all leading-snug ${mono ? "font-mono" : ""}`}>{value}</p>
            </div>
        </div>
    );
}

function AdmItem({icon: Icon, bg, color, label, value, dim = false}) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3">
            <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                <Icon className={`w-3.5 h-3.5 ${color}`}/>
            </div>
            <div>
                <p className="text-[10px] text-slate-400 mb-0.5">{label}</p>
                <p className={`text-[13px] font-medium leading-snug ${dim ? "text-slate-400 italic" : "text-slate-800"}`}>{value}</p>
            </div>
        </div>
    );
}

function VitalCard({icon: Icon, label, value, unit}) {
    if (!value) return null;
    return (
        <div
            className="flex flex-col justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 gap-3 min-h-[108px]">
            <div
                className="w-8 h-8 rounded-xl bg-white border border-teal-100 flex items-center justify-center shadow-sm">
                <Icon className="w-3.5 h-3.5 text-teal-500"/>
            </div>
            <div>
                <p className="text-[10px] text-slate-400 mb-1">{label}</p>
                <p className="text-2xl font-semibold text-slate-800 leading-none tracking-tight">
                    {value}
                    <span className="text-xs font-normal text-slate-400 ml-1">{unit}</span>
                </p>
            </div>
        </div>
    );
}

function FilterTab({active, onClick, children}) {
    return (
        <button
            onClick={onClick}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors border
                ${active
                ? "bg-teal-500 text-white border-teal-500"
                : "bg-white text-slate-500 border-slate-200 hover:border-teal-300 hover:text-teal-600"
            }`}
        >
            {children}
        </button>
    );
}

/* ─── Bed Transfer Modal ─────────────────────────────────────── */

const TRANSFER_REASONS = [
    "Kebutuhan medis / kondisi memburuk",
    "Permintaan pasien / keluarga",
    "Pindah kelas perawatan",
    "Ruangan perlu sanitasi",
    "Lainnya",
];

/**
 * Flatten rooms API response into a flat bed list.
 *
 * Real API shape (confirmed from response):
 *   room.id, room.name, room.room_number
 *   room.ward        → { id, name, floor } | null
 *   room.room_type   → { id, name }        | null   ← may be null
 *   room.beds[]      → { id, bed_number, status }
 */
function flattenBeds(roomsData = [], excludeBedId) {
    return roomsData.flatMap((room) =>
        (room.beds ?? [])
            .filter((bed) => bed.id !== excludeBedId && bed.status === "available")
            .map((bed) => ({
                id: bed.id,
                bedNumber: bed.bed_number,
                status: bed.status,
                roomId: room.id,
                roomName: room.name,
                roomNumber: room.room_number,
                wardId: room.ward?.id ?? null,
                wardName: room.ward?.name ?? null,
                wardFloor: room.ward?.floor ?? null,
                // room_type is nullable in the API — handle gracefully
                roomTypeId: room.room_type?.id ?? null,
                roomTypeName: room.room_type?.name ?? null,
            }))
    );
}

function BedTransferModal({
                              open, onClose,
                              currentBedId, currentBedNumber,
                              patientName, admissionId,
                              onSuccess,
                          }) {
    // We use the store only for the initial fetch trigger + isLoading flag.
    // Pages are accumulated locally so "load more" doesn't wipe page 1.
    const {fetchRoom, rooms, isLoading: roomsLoading, setCurrentPage: setRoomPage} = useRoomStore();

    const [step, setStep] = useState(1);
    const [wardFilter, setWardFilter] = useState("all");
    const [roomTypeFilter, setRoomTypeFilter] = useState("all");
    const [bedSearch, setBedSearch] = useState("");
    const [selectedBed, setSelectedBed] = useState(null);
    const [reason, setReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    // Local accumulator — holds ALL rooms fetched so far across pages
    const [accRooms, setAccRooms] = useState([]);
    const [fetchedPage, setFetchedPage] = useState(0);
    const [lastPage, setLastPage] = useState(1);

    // Open: reset everything and fetch page 1
    useEffect(() => {
        if (!open) return;
        setStep(1);
        setSelectedBed(null);
        setReason("");
        setCustomReason("");
        setSubmitting(false);
        setDone(false);
        setBedSearch("");
        setWardFilter("all");
        setRoomTypeFilter("all");
        setAccRooms([]);
        setFetchedPage(0);
        setLastPage(1);
        setRoomPage(1);
        fetchRoom();
    }, [open]);

    // Accumulate incoming rooms data whenever the store updates
    useEffect(() => {
        if (!rooms?.data || !open) return;
        const incomingPage = rooms.current_page ?? 1;
        // Only append if this page hasn't been added yet
        if (incomingPage > fetchedPage) {
            setAccRooms((prev) => [...prev, ...rooms.data]);
            setFetchedPage(incomingPage);
            setLastPage(rooms.last_page ?? 1);
        }
    }, [rooms]);

    const handleLoadMore = () => {
        const nextPage = fetchedPage + 1;
        setRoomPage(nextPage);
        fetchRoom();
    };

    /* ── Derived data ── */

    const allBeds = useMemo(
        () => flattenBeds(accRooms, currentBedId),
        [accRooms, currentBedId]
    );

    // Unique wards
    const wardOptions = useMemo(() => {
        const seen = new Map();
        allBeds.forEach((b) => {
            if (b.wardId && !seen.has(b.wardId))
                seen.set(b.wardId, {id: b.wardId, name: b.wardName, floor: b.wardFloor});
        });
        return Array.from(seen.values());
    }, [allBeds]);

    // Unique room types (only non-null entries — now always populated per new API data)
    const roomTypeOptions = useMemo(() => {
        const seen = new Map();
        allBeds.forEach((b) => {
            if (b.roomTypeId && !seen.has(b.roomTypeId))
                seen.set(b.roomTypeId, {id: b.roomTypeId, name: b.roomTypeName});
        });
        return Array.from(seen.values());
    }, [allBeds]);

    const filteredBeds = useMemo(() => {
        const q = bedSearch.toLowerCase();
        return allBeds.filter((b) => {
            const matchWard = wardFilter === "all" || b.wardId === wardFilter;
            const matchRoomType = roomTypeFilter === "all" || b.roomTypeId === roomTypeFilter;
            const matchSearch = !q
                || b.bedNumber.toLowerCase().includes(q)
                || b.roomName.toLowerCase().includes(q)
                || (b.wardName ?? "").toLowerCase().includes(q)
                || (b.roomTypeName ?? "").toLowerCase().includes(q);
            return matchWard && matchRoomType && matchSearch;
        });
    }, [allBeds, wardFilter, roomTypeFilter, bedSearch]);

    const hasMorePages = fetchedPage < lastPage;
    const canSubmit = !!reason && (reason !== "Lainnya" || customReason.trim().length > 0);
    const effectiveReason = reason === "Lainnya" ? customReason.trim() : reason;

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await apiCall.post(`/api/v1/inpatient-admissions/${admissionId}/transfer-bed`, {
                bed_id: selectedBed.id,
                transfer_reason: effectiveReason,  // ⚠️ ini juga — bukan 'reason'
            });
            await new Promise((r) => setTimeout(r, 1400));
            setDone(true);
            setTimeout(() => {
                onSuccess?.();
                onClose();
            }, 1800);
        } catch {
            setSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{backgroundColor: "rgba(15,23,42,0.5)", backdropFilter: "blur(2px)"}}
            onClick={(e) => {
                if (e.target === e.currentTarget && !submitting) onClose();
            }}
        >
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[620px] flex flex-col overflow-hidden"
                style={{maxHeight: "90vh"}}
            >
                {/* ── Modal header ── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                            <ArrowRightLeft className="w-4 h-4 text-teal-600"/>
                        </div>
                        <div>
                            <p className="text-[15px] font-bold text-slate-800 leading-tight">Pindah Tempat Tidur</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{patientName ?? "—"}</p>
                        </div>
                    </div>
                    <Button
                        onClick={onClose}
                        disabled={submitting}
                        className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors disabled:opacity-40"
                    >
                        <X className="w-4 h-4"/>
                    </Button>
                </div>

                {/* ── Step indicator ── */}
                <div className="flex items-center gap-2 px-6 py-2.5 border-b border-slate-100 bg-slate-50/70 shrink-0">
                    {["Pilih Tempat Tidur", "Konfirmasi"].map((label, i) => {
                        const s = i + 1;
                        const active = step === s && !done;
                        const complete = step > s || done;
                        return (
                            <div key={s} className="flex items-center gap-2">
                                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300"/>}
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors
                                        ${complete || active ? "bg-teal-500 text-white" : "bg-slate-200 text-slate-500"}`}>
                                        {complete && !active ? <Check className="w-3 h-3"/> : s}
                                    </div>
                                    <span
                                        className={`text-[12px] font-medium ${active ? "text-slate-800" : "text-slate-400"}`}>
                                        {label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ══ Step 1: Pick a bed ══ */}
                {step === 1 && !done && (
                    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">

                        {/* Current bed banner */}
                        <div
                            className="flex items-center gap-2 px-6 py-2.5 bg-amber-50 border-b border-amber-100 shrink-0">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0"/>
                            <p className="text-[12px] text-amber-700">
                                Tempat tidur saat ini:{" "}
                                <span className="font-semibold">{currentBedNumber ?? "—"}</span>
                            </p>
                        </div>

                        {/* Search + filters */}
                        <div className="px-5 pt-3 pb-3 space-y-3 border-b border-slate-100 shrink-0">
                            {/* Search */}
                            <div
                                className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0"/>
                                <input
                                    value={bedSearch}
                                    onChange={(e) => setBedSearch(e.target.value)}
                                    placeholder="Cari nomor bed, ruangan, atau ward..."
                                    className="flex-1 bg-transparent text-[13px] text-slate-700 placeholder:text-slate-400 outline-none"
                                />
                                {bedSearch && (
                                    <button onClick={() => setBedSearch("")}
                                            className="text-slate-400 hover:text-slate-600">
                                        <X className="w-3.5 h-3.5"/>
                                    </button>
                                )}
                            </div>

                            {/* Ward filter */}
                            {wardOptions.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                        <Building2 className="w-3 h-3"/> Ward
                                    </p>
                                    <div className="flex gap-1.5 flex-wrap">
                                        <FilterTab active={wardFilter === "all"} onClick={() => setWardFilter("all")}>
                                            Semua
                                        </FilterTab>
                                        {wardOptions.map((w) => (
                                            <FilterTab key={w.id} active={wardFilter === w.id}
                                                       onClick={() => setWardFilter(w.id)}>
                                                {w.name}{w.floor ? ` · Lt. ${w.floor}` : ""}
                                            </FilterTab>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Room type filter — only rendered when API returns non-null room_type entries */}
                            {roomTypeOptions.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                        <Layers className="w-3 h-3"/> Tipe Kamar
                                    </p>
                                    <div className="flex gap-1.5 flex-wrap">
                                        <FilterTab active={roomTypeFilter === "all"}
                                                   onClick={() => setRoomTypeFilter("all")}>
                                            Semua
                                        </FilterTab>
                                        {roomTypeOptions.map((t) => (
                                            <FilterTab key={t.id} active={roomTypeFilter === t.id}
                                                       onClick={() => setRoomTypeFilter(t.id)}>
                                                {t.name}
                                            </FilterTab>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bed grid */}
                        <div className="overflow-y-auto flex-1 p-4">
                            {roomsLoading && allBeds.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                                    <Loader2 className="w-6 h-6 animate-spin text-teal-400"/>
                                    <p className="text-[13px]">Memuat data kamar...</p>
                                </div>
                            ) : filteredBeds.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400">
                                    <BedDouble className="w-8 h-8 opacity-25"/>
                                    <p className="text-[13px]">Tidak ada tempat tidur tersedia</p>
                                    {(bedSearch || wardFilter !== "all" || roomTypeFilter !== "all") && (
                                        <button
                                            onClick={() => {
                                                setBedSearch("");
                                                setWardFilter("all");
                                                setRoomTypeFilter("all");
                                            }}
                                            className="text-[12px] text-teal-500 hover:underline mt-1"
                                        >
                                            Reset filter
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                        {filteredBeds.map((bed) => {
                                            const isSelected = selectedBed?.id === bed.id;
                                            return (
                                                <button
                                                    key={bed.id}
                                                    onClick={() => setSelectedBed(bed)}
                                                    className={`relative text-left p-3.5 rounded-xl border-2 transition-all
                                                        ${isSelected
                                                        ? "border-teal-500 bg-teal-50 shadow-sm"
                                                        : "border-slate-100 bg-white hover:border-teal-200 hover:bg-slate-50"
                                                    }`}
                                                >
                                                    {isSelected && (
                                                        <div
                                                            className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-teal-500 flex items-center justify-center">
                                                            <Check className="w-2.5 h-2.5 text-white"/>
                                                        </div>
                                                    )}

                                                    {/* Bed number */}
                                                    <div className="flex items-center gap-1.5 mb-1.5">
                                                        <BedDouble
                                                            className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-teal-500" : "text-slate-400"}`}/>
                                                        <span
                                                            className={`text-[14px] font-bold leading-none ${isSelected ? "text-teal-700" : "text-slate-800"}`}>
                                                            {bed.bedNumber}
                                                        </span>
                                                    </div>

                                                    {/* Room name */}
                                                    <p className="text-[11px] text-slate-600 font-medium mb-0.5 line-clamp-1">{bed.roomName}</p>

                                                    {/* Ward */}
                                                    {bed.wardName && (
                                                        <p className="text-[10px] text-slate-400 mb-2 line-clamp-1">
                                                            {bed.wardName}{bed.wardFloor ? ` · Lt. ${bed.wardFloor}` : ""}
                                                        </p>
                                                    )}

                                                    {/* Badges */}
                                                    <div className="flex items-center gap-1 flex-wrap">
                                                        {bed.roomTypeName && (
                                                            <span
                                                                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                                {bed.roomTypeName}
                                                            </span>
                                                        )}
                                                        <span
                                                            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                            Tersedia
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Load more pages */}
                                    {hasMorePages && (
                                        <div className="flex justify-center mt-4">
                                            <button
                                                onClick={handleLoadMore}
                                                disabled={roomsLoading}
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-[12px] font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                                            >
                                                {roomsLoading
                                                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin"/> Memuat...</>
                                                    : <>Muat lebih banyak · hal. {fetchedPage + 1}/{lastPage}</>
                                                }
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between shrink-0">
                            <p className="text-[12px] text-slate-400">
                                {selectedBed
                                    ? <span>Dipilih: <span
                                        className="font-semibold text-slate-700">{selectedBed.bedNumber}</span> — {selectedBed.roomName}</span>
                                    : `${filteredBeds.length} bed tersedia`
                                }
                            </p>
                            <button
                                disabled={!selectedBed}
                                onClick={() => setStep(2)}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-500 text-white text-[13px] font-semibold transition-all disabled:opacity-40 hover:bg-teal-600 active:scale-[0.98]"
                            >
                                Lanjut <ChevronRight className="w-3.5 h-3.5"/>
                            </button>
                        </div>
                    </div>
                )}

                {/* ══ Step 2: Confirm ══ */}
                {step === 2 && !done && (
                    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

                            {/* Summary card */}
                            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                                    Ringkasan Perpindahan
                                </p>
                                <div className="flex items-stretch gap-3">
                                    <div className="flex-1 bg-white rounded-xl border border-slate-200 p-3 text-center">
                                        <p className="text-[10px] text-slate-400 mb-1">Dari</p>
                                        <p className="text-[16px] font-bold text-slate-800">{currentBedNumber ?? "—"}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">Tempat tidur saat ini</p>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <div
                                            className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                                            <ArrowRightLeft className="w-3.5 h-3.5 text-teal-600"/>
                                        </div>
                                    </div>
                                    <div
                                        className="flex-1 bg-teal-50 rounded-xl border border-teal-200 p-3 text-center">
                                        <p className="text-[10px] text-teal-500 mb-1">Ke</p>
                                        <p className="text-[16px] font-bold text-teal-700">{selectedBed?.bedNumber}</p>
                                        <p className="text-[10px] text-teal-500 mt-0.5 line-clamp-1">{selectedBed?.roomName}</p>
                                    </div>
                                </div>

                                {/* Meta: ward + room type */}
                                <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                                    {selectedBed?.wardName && (
                                        <span
                                            className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600">
                                            <Building2 className="w-3 h-3 text-slate-400"/>
                                            {selectedBed.wardName}
                                            {selectedBed.wardFloor ? ` · Lt. ${selectedBed.wardFloor}` : ""}
                                        </span>
                                    )}
                                    {selectedBed?.roomTypeName && (
                                        <span
                                            className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700">
                                            <Layers className="w-3 h-3"/>
                                            {selectedBed.roomTypeName}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Reason */}
                            <div>
                                <p className="text-[12px] font-semibold text-slate-700 mb-2.5">
                                    Alasan Pemindahan <span className="text-rose-500">*</span>
                                </p>
                                <div className="space-y-2">
                                    {TRANSFER_REASONS.map((r) => (
                                        <label
                                            key={r}
                                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors
                                                ${reason === r
                                                ? "border-teal-400 bg-teal-50"
                                                : "border-slate-200 bg-white hover:border-slate-300"
                                            }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                                                ${reason === r ? "border-teal-500 bg-teal-500" : "border-slate-300"}`}>
                                                {reason === r && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
                                            </div>
                                            <input type="radio" className="sr-only" checked={reason === r}
                                                   onChange={() => setReason(r)}/>
                                            <span
                                                className={`text-[13px] ${reason === r ? "font-medium text-teal-800" : "text-slate-600"}`}>
                                                {r}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {reason === "Lainnya" && (
                                    <textarea
                                        value={customReason}
                                        onChange={(e) => setCustomReason(e.target.value)}
                                        placeholder="Jelaskan alasan pemindahan..."
                                        rows={3}
                                        className="mt-2.5 w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-teal-400 resize-none transition-colors"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div
                            className="px-6 py-4 border-t border-slate-100 flex items-center justify-between shrink-0 gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                <ArrowLeft className="w-3.5 h-3.5"/> Kembali
                            </button>
                            <button
                                disabled={!canSubmit}
                                onClick={handleSubmit}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-500 text-white text-[13px] font-semibold transition-all disabled:opacity-40 hover:bg-teal-600 active:scale-[0.98]"
                            >
                                Konfirmasi Pindah <ArrowRightLeft className="w-3.5 h-3.5"/>
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Submitting overlay ── */}
                {submitting && !done && (
                    <div
                        className="absolute inset-0 bg-white/85 flex flex-col items-center justify-center gap-3 rounded-2xl z-10">
                        <Loader2 className="w-7 h-7 text-teal-500 animate-spin"/>
                        <p className="text-[13px] font-medium text-slate-600">Memproses pemindahan...</p>
                    </div>
                )}

                {/* ── Done ── */}
                {done && (
                    <div className="flex flex-col items-center justify-center py-14 px-6 gap-4">
                        <div
                            className="w-16 h-16 rounded-full bg-teal-50 border-2 border-teal-200 flex items-center justify-center">
                            <Check className="w-8 h-8 text-teal-500"/>
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-[16px] font-bold text-slate-800">Pemindahan Berhasil</p>
                            <p className="text-[13px] text-slate-400">
                                {patientName} dipindahkan ke bed{" "}
                                <span className="font-semibold text-teal-600">{selectedBed?.bedNumber}</span>
                                {selectedBed?.roomName ? ` – ${selectedBed.roomName}` : ""}
                            </p>
                            {selectedBed?.wardName && (
                                <p className="text-[12px] text-slate-400">{selectedBed.wardName}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─── Page ───────────────────────────────────────────────────── */
function InpatientDetailPage(opts) {
    const {id} = useParams(opts);
    const navigate = useNavigate();
    const {
        showInpatientAdmission, inpatientAdmissionValue, isLoading,
        setCurrentPage, search, setSearch, currentPage,
    } = useInpatientAdmissionStore();

    const [transferOpen, setTransferOpen] = useState(false);

    useEffect(() => {
        showInpatientAdmission(id);
    }, [id]);

    const handleTransferSuccess = useCallback(() => {
        showInpatientAdmission(id);
    }, [id]);

    const data = inpatientAdmissionValue?.data;
    const {patient, doctor, vital_signs, active_bed, bed_assignments} = data ?? {};
    const vitals = vital_signs?.[0] ?? {};
    const dailyCares = inpatientAdmissionValue?.daily_cares;
    const statusCfg = STATUS_MAP[data?.status] ?? STATUS_MAP.admitted;

    const dailyCareColumns = () => [
        {key: "date", label: "Tanggal", width: "18%"},
        {key: "notes", label: "Catatan Perawatan", width: "55%"},
        {key: "doctor", label: "Dokter", width: "27%"},
    ];

    const renderDailyCareRow = (row) => (
        <TableRow key={row.id} className="hover:bg-slate-50 border-b border-slate-50 last:border-none">
            <TableCell className="text-[11px] text-slate-400 font-mono whitespace-nowrap py-3 px-5">
                {fmt(row.date) ?? "—"}
            </TableCell>
            <TableCell className="text-[13px] text-slate-500 py-3 px-5 leading-relaxed">
                <span className="line-clamp-2">{row.notes ?? "—"}</span>
            </TableCell>
            <TableCell className="text-[13px] font-medium text-slate-700 py-3 px-5">
                {row.doctor?.full_name_with_degrees ?? "—"}
            </TableCell>
        </TableRow>
    );

    return (
        <Layout>
            <BedTransferModal
                open={transferOpen}
                onClose={() => setTransferOpen(false)}
                currentBedId={active_bed?.bed?.id}
                currentBedNumber={active_bed?.bed?.bed_number}
                patientName={patient?.full_name}
                admissionId={id}
                onSuccess={handleTransferSuccess}
            />

            <div className="min-h-screen bg-slate-50/60 p-6">
                <div className="max-w-[1100px] mx-auto space-y-5">

                    {/* ── Header ── */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate({to: "/inpatient"})}
                            className="w-9 h-9 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4"/>
                        </button>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Detail Rawat Inap</h1>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                {patient?.medical_record_number ?? "—"}
                            </p>
                        </div>
                        <div className="flex items-center gap-2.5">
                            {data?.status === "admitted" && (
                                <button
                                    onClick={() => setTransferOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-teal-200 bg-teal-50 text-teal-700 text-[13px] font-semibold hover:bg-teal-100 hover:border-teal-300 transition-colors"
                                >
                                    <ArrowRightLeft className="w-3.5 h-3.5"/>
                                    Pindah Tempat Tidur
                                </button>
                            )}
                            {data && (
                                <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase border ${statusCfg.cls}`}>
                                    {statusCfg.dot && <span
                                        className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"/>}
                                    {statusCfg.label}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* ── Loading ── */}
                    {!data ? (
                        <div className="flex items-center justify-center py-32 gap-2 text-slate-400">
                            <Activity className="w-5 h-5 animate-pulse text-teal-400"/>
                            <span className="text-sm">Memuat data...</span>
                        </div>
                    ) : (
                        <div className="space-y-5">

                            {/* ── Row 1 ── */}
                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">

                                {/* Identitas Pasien */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                    <SectionLabel icon={User}>Identitas Pasien</SectionLabel>
                                    <div className="flex items-center gap-4 px-5 py-4 border-b border-slate-100">
                                        <div
                                            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-sm">
                                            {ini(patient?.full_name)}
                                        </div>
                                        <div>
                                            <p className="text-[17px] font-bold text-slate-800 tracking-tight leading-tight">{patient?.full_name}</p>
                                            <p className="text-xs text-slate-400 capitalize mt-1">{patient?.gender} · {calcAge(patient?.date_of_birth)}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <InfoRow icon={Calendar} label="Tanggal Lahir"
                                                 value={fmt(patient?.date_of_birth)}/>
                                        <InfoRow icon={MapPin} label="Kota Lahir" value={patient?.city_of_birth}/>
                                        <InfoRow icon={Phone} label="No. Telepon" value={patient?.phone}/>
                                        <InfoRow icon={Briefcase} label="Pekerjaan" value={patient?.job}/>
                                        <InfoRow icon={User} label="No. KTP" value={patient?.id_card_number} mono span/>
                                    </div>
                                </div>

                                {/* Informasi Admisi */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                    <SectionLabel
                                        icon={BedDouble}
                                        action={
                                            data?.status === "admitted" && (
                                                <button
                                                    onClick={() => setTransferOpen(true)}
                                                    className="flex items-center gap-1.5 text-[11px] font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                                                >
                                                    <ArrowRightLeft className="w-3 h-3"/> Pindah
                                                </button>
                                            )
                                        }
                                    >
                                        Informasi Admisi
                                    </SectionLabel>
                                    <div className="px-5 py-4 space-y-4">
                                        <AdmItem icon={Calendar} bg="bg-teal-50" color="text-teal-500"
                                                 label="Tanggal Masuk" value={fmt(data.admitted_at, true)}/>
                                        <AdmItem icon={Calendar} bg="bg-slate-50" color="text-slate-400"
                                                 label="Tanggal Keluar"
                                                 value={data.discharged_at ? fmt(data.discharged_at, true) : "Masih dirawat"}
                                                 dim={!data.discharged_at}/>
                                        <AdmItem icon={MapPin} bg="bg-teal-50" color="text-teal-500"
                                                 label="Sumber Masuk" value={data.admission_source}/>
                                        <AdmItem icon={Activity} bg="bg-amber-50" color="text-amber-500"
                                                 label="Diagnosis" value={data.diagnosis}/>
                                        <AdmItem icon={BedDouble} bg="bg-teal-50" color="text-teal-500"
                                                 label="Tempat Tidur" value={active_bed?.bed?.bed_number}/>
                                        <div className="h-px bg-slate-100"/>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[11px] font-bold text-indigo-600 shrink-0">
                                                {ini(doctor?.full_name_with_degrees)}
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-semibold text-slate-800 leading-tight">{doctor?.full_name_with_degrees}</p>
                                                <p className="text-[11px] text-slate-400 mt-0.5">{doctor?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Row 2: Vitals ── */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div
                                    className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <HeartPulse className="w-3.5 h-3.5 text-teal-500"/>
                                        <span
                                            className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.08em]">Tanda-Tanda Vital</span>
                                    </div>
                                    {vitals.created_at && (
                                        <span className="text-[10px] text-slate-400 font-mono">
                                            Dicatat: {fmt(vitals.created_at, true)}
                                        </span>
                                    )}
                                </div>
                                <div className="p-5">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                                        <VitalCard icon={Thermometer} label="Suhu" value={vitals.temperature}
                                                   unit="°C"/>
                                        <VitalCard icon={HeartPulse} label="Denyut Nadi" value={vitals.pulse_rate}
                                                   unit="bpm"/>
                                        <VitalCard icon={Wind} label="Laju Napas" value={vitals.respiratory_rate}
                                                   unit="/mnt"/>
                                        <VitalCard icon={Droplets} label="Sistolik" value={vitals.systolic}
                                                   unit="mmHg"/>
                                        <VitalCard icon={Droplets} label="Diastolik" value={vitals.diastolic}
                                                   unit="mmHg"/>
                                    </div>
                                </div>
                            </div>

                            {/* ── Row 3: Riwayat Penempatan Bed ── */}
                            {bed_assignments?.length > 0 && (
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div
                                        className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <History className="w-3.5 h-3.5 text-teal-500"/>
                                            <span
                                                className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.08em]">
                                                Riwayat Penempatan Tempat Tidur
                                            </span>
                                        </div>
                                        <span
                                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                            {bed_assignments.length} perpindahan
                                        </span>
                                    </div>

                                    <div className="px-5 py-4">
                                        <div className="relative">
                                            {/* Vertical timeline line */}
                                            <div className="absolute left-[15px] top-3 bottom-3 w-px bg-slate-100"/>

                                            <div className="space-y-0">
                                                {[...bed_assignments].reverse().map((assignment, idx) => {
                                                    const isActive = assignment.released_at === null;
                                                    const isFirst = idx === 0;
                                                    const totalIdx = bed_assignments.length - 1 - idx; // original index

                                                    return (
                                                        <div key={assignment.id} className="relative flex gap-4">
                                                            {/* Timeline dot */}
                                                            <div className="relative z-10 shrink-0 mt-3">
                                                                <div className={`w-[30px] h-[30px] rounded-full border-2 flex items-center justify-center
                                                                    ${isActive
                                                                    ? "bg-teal-50 border-teal-400"
                                                                    : "bg-white border-slate-200"
                                                                }`}>
                                                                    <BedDouble
                                                                        className={`w-3 h-3 ${isActive ? "text-teal-500" : "text-slate-400"}`}/>
                                                                </div>
                                                            </div>

                                                            {/* Content */}
                                                            <div
                                                                className={`flex-1 pb-5 ${idx === bed_assignments.length - 1 ? "pb-0" : ""}`}>
                                                                <div className={`rounded-xl border p-3.5 ${isActive
                                                                    ? "border-teal-200 bg-teal-50/50"
                                                                    : "border-slate-100 bg-slate-50/50"
                                                                }`}>
                                                                    {/* Header row */}
                                                                    <div
                                                                        className="flex items-center justify-between gap-2 mb-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border
                                                                                ${isActive
                                                                                ? "bg-teal-100 text-teal-700 border-teal-200"
                                                                                : "bg-slate-100 text-slate-500 border-slate-200"
                                                                            }`}>
                                                                                {isActive ? "Aktif" : `Bed ${totalIdx + 1}`}
                                                                            </span>
                                                                            <span
                                                                                className="text-[13px] font-bold text-slate-800 font-mono">
                                                                                {assignment.bed?.bed_number ?? "—"}
                                                                            </span>
                                                                        </div>
                                                                        {isActive && (
                                                                            <span
                                                                                className="inline-flex items-center gap-1 text-[10px] text-teal-600 font-semibold">
                                                                                <span
                                                                                    className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"/>
                                                                                Saat ini
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    {/* Dates row */}
                                                                    <div className="flex items-center gap-3 flex-wrap">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <div
                                                                                className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center">
                                                                                <LogIn
                                                                                    className="w-2.5 h-2.5 text-emerald-600"/>
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-[9px] text-slate-400 leading-none mb-0.5">Masuk</p>
                                                                                <p className="text-[11px] font-medium text-slate-700 font-mono">
                                                                                    {fmt(assignment.assigned_at, true) ?? "—"}
                                                                                </p>
                                                                            </div>
                                                                        </div>

                                                                        {assignment.released_at && (
                                                                            <>
                                                                                <MoveRight
                                                                                    className="w-3.5 h-3.5 text-slate-300 shrink-0"/>
                                                                                <div
                                                                                    className="flex items-center gap-1.5">
                                                                                    <div
                                                                                        className="w-5 h-5 rounded-md bg-rose-50 flex items-center justify-center">
                                                                                        <LogOut
                                                                                            className="w-2.5 h-2.5 text-rose-500"/>
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-[9px] text-slate-400 leading-none mb-0.5">Keluar</p>
                                                                                        <p className="text-[11px] font-medium text-slate-700 font-mono">
                                                                                            {fmt(assignment.released_at, true)}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>

                                                                    {/* Transfer reason */}
                                                                    {assignment.transfer_reason && (
                                                                        <div
                                                                            className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-start gap-1.5">
                                                                            <AlertCircle
                                                                                className="w-3 h-3 text-amber-400 mt-0.5 shrink-0"/>
                                                                            <p className="text-[11px] text-slate-500 italic leading-snug">
                                                                                {assignment.transfer_reason}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Row 4: Perawatan Harian ── */}
                            <InpatientDailyCareTab
                                admissionId={id}
                                admissionStatus={data?.status}
                            />

                            {/* ── Row 5: Obat Harian ── */}
                            <InpatientDailyMedicationTab
                                admissionId={id}
                                admissionStatus={data?.status}
                            />

                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default InpatientDetailPage;