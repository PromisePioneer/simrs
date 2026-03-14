import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {
    BedDouble, Plus, DoorOpen, BedSingle,
    ChevronRight, User, Hash, Tag, Pencil, Trash2, Layers
} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {TableCell, TableRow} from "@/components/ui/table.jsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";
import {useRoomStore} from "@/store/roomStore.js";
import {useBedStore} from "@/store/bedStore.js";
import {BedStatusBadge} from "@/pages/facilities/inpatient/ward/components/bed-status-badge.jsx";
import {BedModal, BedDeleteModal} from "@/pages/facilities/inpatient/room/modal/index.jsx";
import {RoomDeleteModal, RoomModal} from "@/pages/facilities/inpatient/ward/modal/index.jsx";
import DataTable from "@/components/common/data-table.jsx";
import {format} from "date-fns";
import {Fragment} from "react";

// ── BedItem ───────────────────────────────────────────────────────────────
function BedItem({bed, onEdit, onDelete}) {
    const [open, setOpen] = useState(false);
    const activeAssignment = bed.bed_assignments?.[0] ?? null;
    const admission = activeAssignment?.inpatient_admission ?? null;
    const isOccupied = bed.status === "occupied";

    const s = {
        occupied: {
            wrap: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900",
            iconBg: "bg-red-100 dark:bg-red-900/40",
            icon: "text-red-600 dark:text-red-400"
        },
        reserved: {
            wrap: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900",
            iconBg: "bg-amber-100 dark:bg-amber-900/40",
            icon: "text-amber-600 dark:text-amber-400"
        },
        available: {
            wrap: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900",
            iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
            icon: "text-emerald-600 dark:text-emerald-400"
        },
    }[bed.status ?? "available"];

    return (
        <div className={`rounded-lg border overflow-hidden ${s.wrap}`}>
            <div
                className="flex items-center gap-2 px-2.5 py-2 select-none"
                style={{cursor: isOccupied ? "pointer" : "default"}}
                onClick={() => isOccupied && setOpen(p => !p)}
            >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${s.iconBg}`}>
                    <BedSingle className={`w-3 h-3 ${s.icon}`}/>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">{bed.bed_number}</p>
                    <BedStatusBadge status={bed.status ?? "available"}/>
                </div>
                <div className="flex items-center gap-0.5" onClick={e => e.stopPropagation()}>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm"
                                        className="h-5 w-5 p-0 hover:bg-white/60 dark:hover:bg-white/10"
                                        onClick={onEdit}>
                                    <Pencil className="w-2.5 h-2.5"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Edit</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm"
                                        className="h-5 w-5 p-0 hover:bg-red-100 hover:text-red-600"
                                        onClick={onDelete}>
                                    <Trash2 className="w-2.5 h-2.5"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Hapus</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    {isOccupied && (
                        <ChevronRight
                            className="w-3 h-3 text-muted-foreground ml-0.5 transition-transform duration-200"
                            style={{transform: open ? "rotate(90deg)" : "rotate(0deg)"}}
                        />
                    )}
                </div>
            </div>

            {/* Lazy mount — hanya render detail kalau pernah dibuka */}
            {open && admission && (
                <div
                    className="px-2.5 py-2.5 border-t border-red-200/50 dark:border-red-900/50 bg-white/50 dark:bg-black/10 space-y-2">
                    <div className="flex items-center gap-1.5">
                        <div
                            className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                            <User className="w-2.5 h-2.5 text-slate-600 dark:text-slate-300"/>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-foreground leading-none">
                                {admission.patient?.full_name ?? "—"}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                                {admission.patient?.medical_record_number}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                        {[
                            {label: "Diagnosis", value: admission.diagnosis},
                            {label: "Sumber", value: admission.admission_source},
                            {
                                label: "Status",
                                value: <Badge variant="outline"
                                              className="text-[10px] h-4 px-1.5">{admission.status}</Badge>
                            },
                            {
                                label: "Masuk",
                                value: activeAssignment?.assigned_at ? format(new Date(activeAssignment.assigned_at), "dd MMM yyyy HH:mm") : "—"
                            },
                        ].map(item => (
                            <div key={item.label}>
                                <p className="text-[10px] text-muted-foreground">{item.label}</p>
                                <div
                                    className="text-[10px] font-medium text-foreground mt-0.5">{item.value ?? "—"}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── RoomRow — komponen terpisah, punya state sendiri ──────────────────────
// Ini kunci utama: tiap row manage expanded state sendiri,
// tidak bergantung pada parent → parent tidak re-render saat expand
function RoomRow({r, index, from, onEdit, onDelete, onAddBed, onEditBed, onDeleteBed}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [hasExpanded, setHasExpanded] = useState(false); // lazy mount

    const beds = r.beds ?? [];
    const available = beds.filter(b => b.status === "available").length;
    const occupied = beds.filter(b => b.status === "occupied").length;

    const handleToggle = () => {
        if (!hasExpanded) setHasExpanded(true);
        setIsExpanded(p => !p);
    };

    return (
        <Fragment>
            <TableRow
                className="hover:bg-muted/30 transition-colors cursor-pointer select-none"
                onClick={handleToggle}
            >
                <TableCell className="text-sm text-muted-foreground w-12">
                    {from + index}
                </TableCell>

                <TableCell>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 flex items-center justify-center shrink-0 text-muted-foreground/50">
                            <ChevronRight
                                className="w-3.5 h-3.5 transition-transform duration-200"
                                style={{transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)"}}
                            />
                        </div>
                        <div
                            className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center shrink-0">
                            <DoorOpen className="w-4 h-4 text-teal-600"/>
                        </div>
                        <div>
                            <p className="font-medium text-sm">{r.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                    <Hash className="w-2.5 h-2.5"/>{r.room_number}
                                </span>
                                {r.room_type?.name && (
                                    <>
                                        <span className="text-muted-foreground/30">·</span>
                                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                            <Tag className="w-2.5 h-2.5"/>{r.room_type.name}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </TableCell>

                <TableCell>
                    <span className="text-sm text-muted-foreground">{r.capacity ?? "—"}</span>
                </TableCell>

                <TableCell>
                    <div className="flex items-center gap-1.5">
                        <span
                            className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 px-2 py-0.5 rounded-md">
                            <BedSingle className="w-3 h-3"/>{available} tersedia
                        </span>
                        <span
                            className="flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 px-2 py-0.5 rounded-md">
                            <BedDouble className="w-3 h-3"/>{occupied} terisi
                        </span>
                    </div>
                </TableCell>

                <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-end gap-0.5">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm"
                                            className="h-8 w-8 p-0 hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-teal-950/40"
                                            onClick={onEdit}>
                                        <Pencil className="h-3.5 w-3.5"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Edit Ruangan</p></TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm"
                                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                                            onClick={onDelete}>
                                        <Trash2 className="h-3.5 w-3.5"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Hapus Ruangan</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </TableCell>
            </TableRow>

            {/* Beds — hanya di-mount setelah pertama kali expand */}
            <TableRow>
                <TableCell colSpan={5} className="!p-0 border-0">
                    <div style={{
                        display: "grid",
                        gridTemplateRows: isExpanded ? "1fr" : "0fr",
                        transition: "grid-template-rows 0.25s cubic-bezier(0.4,0,0.2,1)",
                    }}>
                        <div style={{overflow: "hidden"}}>
                            {hasExpanded && (
                                <div className="py-3 pl-14 pr-4 bg-muted/20 border-b space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Layers className="w-3.5 h-3.5 text-muted-foreground"/>
                                            <span
                                                className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Tempat Tidur — {r.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">({beds.length})</span>
                                        </div>
                                        <Button
                                            size="sm" variant="outline"
                                            className="h-7 px-2.5 text-xs gap-1 border-teal-200 text-teal-700 hover:bg-teal-50 dark:border-teal-800 dark:text-teal-400"
                                            onClick={e => {
                                                e.stopPropagation();
                                                onAddBed();
                                            }}
                                        >
                                            <Plus className="w-3 h-3"/> Tambah Tempat Tidur
                                        </Button>
                                    </div>

                                    {beds.length === 0 ? (
                                        <div
                                            className="flex items-center justify-center py-5 gap-2 text-muted-foreground">
                                            <BedSingle className="w-4 h-4 opacity-30"/>
                                            <span className="text-xs">Belum ada tempat tidur</span>
                                        </div>
                                    ) : (
                                        <div
                                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                            {beds.map(b => (
                                                <BedItem
                                                    key={b.id}
                                                    bed={b}
                                                    onEdit={e => {
                                                        e.stopPropagation();
                                                        onEditBed(b);
                                                    }}
                                                    onDelete={e => {
                                                        e.stopPropagation();
                                                        onDeleteBed(b);
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </TableCell>
            </TableRow>
        </Fragment>
    );
}

// ── RoomPage ──────────────────────────────────────────────────────────────
function RoomPage() {
    const {
        rooms, isLoading, openModal, openDeleteModal, roomValue,
        updateRoom, deleteRoom, columns, setSearch, search,
        setCurrentPage, currentPage, setOpenModal, setOpenDeleteModal,
    } = useRoomStore();

    const bed = useBedStore();
    const [selectedRoomId, setSelectedRoomId] = useState(null);

    const {
        register: regBed, handleSubmit: submitBed, reset: resetBed,
        formState: {errors: bedErr, isSubmitting: bedLoading},
    } = useForm({mode: "all", defaultValues: {bed_number: ""}});

    const {
        register: regRoom, handleSubmit: submitRoom,
        control: ctrlRoom, reset: resetRoom,
        formState: {errors: roomErr, isSubmitting: roomLoading},
    } = useForm({mode: "all", defaultValues: {room_number: "", name: "", capacity: ""}});

    useEffect(() => {
        useRoomStore.getState().fetchRoom();
    }, [currentPage, search]);

    useEffect(() => {
        if (bed.openModal) resetBed({bed_number: bed.bedValue?.bed_number ?? ""});
    }, [bed.openModal]);

    useEffect(() => {
        if (openModal) {
            resetRoom({
                room_number: roomValue?.room_number ?? "",
                name: roomValue?.name ?? "",
                capacity: roomValue?.capacity ?? "",
            });
        }
    }, [openModal]);

    const reload = () => useRoomStore.getState().fetchRoom();

    const onBedSubmit = async (data) => {
        const payload = {...data, room_id: selectedRoomId};
        if (bed.bedValue?.id) await bed.updateBed(bed.bedValue.id, payload);
        else await bed.createBed(payload);


        console.log(payload);
        reload();
    };

    const onBedDelete = async () => {
        await bed.deleteBed(bed.bedValue.id);
        reload();
    };

    const onRoomSubmit = async (data) => {
        if (roomValue?.id) await updateRoom(roomValue.id, data);
        reload();
    };

    const data = rooms?.data ?? [];

    const renderRow = (r, index) => (
        <RoomRow
            key={r.id}
            r={r}
            index={index}
            from={rooms?.from ?? 1}
            onEdit={e => {
                e.stopPropagation();
                setOpenModal(r.id);
            }}
            onDelete={e => {
                e.stopPropagation();
                setOpenDeleteModal(r.id);
            }}
            onAddBed={() => {
                setSelectedRoomId(r.id);
                bed.setOpenModal();
            }}
            onEditBed={b => {
                setSelectedRoomId(r.id);
                bed.setOpenModal(b.id);
            }}
            onDeleteBed={b => bed.setOpenDeleteModal(b.id)}
        />
    );

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-sm font-semibold text-foreground">Data Ruangan</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Klik baris untuk melihat tempat tidur · Klik bed terisi untuk detail pasien
                    </p>
                </div>
            </div>

            <DataTable
                columns={columns()}
                data={data}
                isLoading={isLoading}
                pagination={rooms?.from ? {
                    from: rooms.from,
                    to: rooms.to,
                    total: rooms.total,
                    current_page: rooms.current_page,
                    last_page: rooms.last_page,
                } : null}
                onPageChange={setCurrentPage}
                currentPage={currentPage}
                onSearch={setSearch}
                search={search}
                searchPlaceholder="Cari ruangan..."
                emptyStateIcon={DoorOpen}
                emptyStateText="Tidak ada data ruangan ditemukan"
                renderRow={renderRow}
                showSearch={true}
            />

            <BedModal
                open={bed.openModal}
                onOpenChange={bed.setOpenModal}
                bedValue={bed.bedValue}
                onSubmit={submitBed(onBedSubmit)}
                isLoading={bedLoading}
                registerBed={regBed}
                bedErrors={bedErr}
            />
            <BedDeleteModal
                open={bed.openDeleteModal}
                onOpenChange={bed.setOpenDeleteModal}
                bedValue={bed.bedValue}
                onSubmit={onBedDelete}
                isLoading={bed.deleteLoading}
            />
            <RoomModal
                open={openModal}
                onOpenChange={setOpenModal}
                roomValue={roomValue}
                onSubmit={submitRoom(onRoomSubmit)}
                isLoading={roomLoading}
                registerRoom={regRoom}
                controlRoom={ctrlRoom}
                roomErrors={roomErr}
                fetchRoomTypeOptions={async () => []}
            />
            <RoomDeleteModal
                open={openDeleteModal}
                onOpenChange={setOpenDeleteModal}
                roomValue={roomValue}
                onSubmit={() => deleteRoom(roomValue?.id)}
                isLoading={isLoading}
            />
        </>
    );
}

export default RoomPage;