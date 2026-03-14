import {useEffect, useState} from "react";
import {useParams, useNavigate} from "@tanstack/react-router";
import {useForm} from "react-hook-form";
import {
    BedDouble, Plus, ArrowLeft, DoorOpen,
} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {useRoomStore} from "@/store/roomStore.js";
import {useBedStore} from "@/store/bedStore.js";
import {BedListCollapsible} from "@/pages/facilities/inpatient/ward/components/bedlist-collapsible.jsx";
import {BedModal, BedDeleteModal} from "@/pages/facilities/inpatient/room/modal/index.jsx";

function RoomPage(opts) {
    const {roomId} = useParams(opts);
    const navigate = useNavigate();

    const {showRoom, roomStats, bedsPagination} = useRoomStore();
    const bed = useBedStore();

    const [room, setRoom] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [pageLoading, setPageLoading] = useState(false);

    // ── Bed form ─────────────────────────────────────────────────────────────
    const {
        register: registerBed,
        handleSubmit: handleSubmitBed,
        reset: resetBed,
        formState: {errors: bedErrors, isSubmitting: bedSubmitting},
    } = useForm({
        mode: "all",
        defaultValues: {bed_number: ""},
    });

    // ── Load room ─────────────────────────────────────────────────────────────
    const loadRoom = async (page = 1) => {
        setPageLoading(true);
        const data = await showRoom(roomId, page);
        if (data) setRoom(data);
        setPageLoading(false);
    };

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            await loadRoom(1);
            setIsLoading(false);
        })();
    }, [roomId]);

    // ── Sync bed form ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (bed.bedValue) {
            resetBed({bed_number: bed.bedValue.bed_number || ""});
        } else {
            resetBed({bed_number: ""});
        }
    }, [bed.openModal]);

    // ── Submit bed ────────────────────────────────────────────────────────────
    const onBedSubmit = async (data) => {
        const payload = {...data, room_id: Number(roomId)};
        if (bed.bedValue?.id) await bed.updateBed(bed.bedValue.id, payload);
        else await bed.createBed(payload);
        await loadRoom(bedsPagination?.current_page ?? 1);
    };

    // ── Delete bed ────────────────────────────────────────────────────────────
    const onBedDelete = async () => {
        await bed.deleteBed(bed.bedValue.id);
        await loadRoom(bedsPagination?.current_page ?? 1);
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="h-10 w-48 bg-muted animate-pulse rounded-lg"/>
                <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted animate-pulse rounded-lg"/>)}
                </div>
                <div className="h-64 bg-muted/30 animate-pulse rounded-lg"/>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
                <DoorOpen className="w-12 h-12 opacity-30"/>
                <p className="text-sm">Ruangan tidak ditemukan.</p>
                <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2"/> Kembali
                </Button>
            </div>
        );
    }

    const beds = room.beds ?? [];

    return (
        <>
            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                <div className="space-y-1">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-1"
                    >
                        <ArrowLeft className="w-4 h-4"/> Kembali ke Ruang Rawat
                    </button>
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5">
                            <DoorOpen className="w-6 h-6 text-primary"/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-teal-500">
                                {room.name}
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                No. {room.room_number} · Tipe: {room.room_type?.name ?? "-"} · Lantai {room.ward?.floor}
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => bed.setOpenModal()}
                    size="lg"
                >
                    <Plus className="w-4 h-4"/> Tambah Tempat Tidur
                </Button>
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                    {label: "Total", value: roomStats?.total ?? beds.length, color: "bg-slate-100 text-slate-700"},
                    {label: "Tersedia", value: roomStats?.available ?? 0, color: "bg-emerald-50 text-emerald-700"},
                    {label: "Terisi", value: roomStats?.occupied ?? 0, color: "bg-red-50 text-red-700"},
                ].map(s => (
                    <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
                        <p className="text-3xl font-bold">{s.value}</p>
                        <p className="text-xs font-medium mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* ── Bed list ── */}
            {pageLoading ? (
                <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="rounded-lg border h-14 bg-muted animate-pulse"/>
                    ))}
                </div>
            ) : (
                <BedListCollapsible
                    beds={beds}
                    onEdit={(b) => bed.setOpenModal(b.id)}
                    onDelete={(b) => bed.setOpenDeleteModal(b.id)}
                />
            )}

            {/* ── Pagination ── */}
            {bedsPagination && bedsPagination.last_page > 1 && (
                <div className="flex items-center justify-center gap-3 pt-3">
                    <Button
                        type="button" variant="outline" size="sm"
                        disabled={bedsPagination.current_page === 1 || pageLoading}
                        onClick={() => loadRoom(bedsPagination.current_page - 1)}
                    >
                        ←
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        {bedsPagination.current_page} / {bedsPagination.last_page}
                    </span>
                    <Button
                        type="button" variant="outline" size="sm"
                        disabled={bedsPagination.current_page === bedsPagination.last_page || pageLoading}
                        onClick={() => loadRoom(bedsPagination.current_page + 1)}
                    >
                        →
                    </Button>
                </div>
            )}

            {/* ── Modals ── */}
            <BedModal
                open={bed.openModal}
                onOpenChange={bed.setOpenModal}
                bedValue={bed.bedValue}
                onSubmit={handleSubmitBed(onBedSubmit)}
                isLoading={bedSubmitting}
                registerBed={registerBed}
                bedErrors={bedErrors}
            />
            <BedDeleteModal
                open={bed.openDeleteModal}
                onOpenChange={bed.setOpenDeleteModal}
                bedValue={bed.bedValue}
                onSubmit={onBedDelete}
                isLoading={bed.deleteLoading}
            />
        </>
    );
}

export default RoomPage;