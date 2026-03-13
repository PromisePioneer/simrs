import {Trash2, ChevronLeft, ChevronRight} from "lucide-react";
import Modal from "@/components/common/modal.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Controller} from "react-hook-form";
import {AsyncSelect} from "@/components/common/async-select.jsx";
import {BedListCollapsible} from "@/pages/facilities/inpatient/ward/components/bedlist-collapsible.jsx";
import {useRoomStore} from "@/store/roomStore.js";
import {Button} from "@/components/ui/button.jsx";
import {useState} from "react";

// ── Ward Modal (Create / Edit) ──────────────────────────────────────────────
export function WardModal({
                              open,
                              onOpenChange,
                              wardValue,
                              onSubmit,
                              isLoading,
                              registerWard,
                              controlWard,
                              wardErrors,
                              fetchBuildingOptions,
                              fetchDepartmentOptions
                          }) {
    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={wardValue ? "Edit Ruang Rawat" : "Tambah Ruang Rawat"}
            description={wardValue ? "Ubah informasi ruang rawat" : "Tambahkan ruang rawat baru ke sistem."}
            onSubmit={onSubmit}
            submitText={wardValue ? "Simpan Perubahan" : "Tambah Ruang Rawat"}
            isLoading={isLoading}
        >
            <div className="space-y-5 py-2">
                <div className="space-y-2.5">
                    <Label className="text-sm font-semibold">
                        Nama Ruang Rawat <span className="text-destructive">*</span>
                    </Label>
                    <Input placeholder="Contoh: Ruang Rawat A"
                           {...registerWard("name", {required: "Nama tidak boleh kosong"})}/>
                    {wardErrors.name && <p className="text-sm text-destructive">{wardErrors.name.message}</p>}
                </div>

                <div className="space-y-2.5">
                    <Label className="text-sm font-semibold">
                        Lantai <span className="text-destructive">*</span>
                    </Label>
                    <Input type="number" placeholder="Contoh: 1"
                           {...registerWard("floor", {required: "Lantai tidak boleh kosong"})}/>
                    {wardErrors.floor && <p className="text-sm text-destructive">{wardErrors.floor.message}</p>}
                </div>

                <div className="space-y-2.5">
                    <Label className="text-sm font-semibold">
                        Gedung <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                        name="building_id" control={controlWard}
                        rules={{required: "Gedung tidak boleh kosong"}}
                        render={({field}) => (
                            <AsyncSelect fetchFn={fetchBuildingOptions} value={field.value} onChange={field.onChange}
                                         placeholder="Cari gedung..." debounce={300}
                                         defaultLabel={wardValue?.building?.name ?? null}/>
                        )}
                    />
                    {wardErrors.building_id &&
                        <p className="text-sm text-destructive">{wardErrors.building_id.message}</p>}
                </div>

                <div className="space-y-2.5">
                    <Label className="text-sm font-semibold">
                        Departemen <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                        name="department_id" control={controlWard}
                        rules={{required: "Departemen tidak boleh kosong"}}
                        render={({field}) => (
                            <AsyncSelect fetchFn={fetchDepartmentOptions} value={field.value} onChange={field.onChange}
                                         placeholder="Cari departemen..." debounce={300}
                                         defaultLabel={wardValue?.department?.name ?? null}/>
                        )}
                    />
                    {wardErrors.department_id &&
                        <p className="text-sm text-destructive">{wardErrors.department_id.message}</p>}
                </div>
            </div>
        </Modal>
    );
}

// ── Ward Delete Modal ───────────────────────────────────────────────────────
export function WardDeleteModal({open, onOpenChange, wardValue, onSubmit, isLoading}) {
    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title="Hapus Ruang Rawat"
            description="Tindakan ini tidak dapat dibatalkan."
            onSubmit={onSubmit}
            submitText="Hapus Ruang Rawat"
            type="danger"
            isLoading={isLoading}
        >
            <div className="space-y-4 py-2">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex gap-3">
                        <div
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/20 shrink-0">
                            <Trash2 className="w-5 h-5 text-destructive"/>
                        </div>
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-semibold">Konfirmasi Penghapusan</p>
                            <p className="text-sm text-muted-foreground">
                                Anda akan menghapus ruang rawat:{" "}
                                <span className="font-semibold text-foreground">{wardValue?.name}</span>
                            </p>
                            {wardValue?.rooms?.length > 0 && (
                                <p className="text-sm text-destructive font-medium mt-1">
                                    ⚠️ Ruang Rawat ini memiliki {wardValue.rooms.length} Ruangan yang akan ikut
                                    terhapus.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

// ── Room Modal (Create / Edit) ──────────────────────────────────────────────
export function RoomModal({
                              open,
                              onOpenChange,
                              roomValue,
                              onSubmit,
                              isLoading,
                              registerRoom,
                              controlRoom,
                              roomErrors,
                              fetchRoomTypeOptions
                          }) {
    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={roomValue ? "Edit Ruangan" : "Tambah Ruangan"}
            description={roomValue ? "Ubah informasi ruangan" : "Tambahkan ruangan baru ke ruang rawat."}
            onSubmit={onSubmit}
            submitText={roomValue ? "Simpan Perubahan" : "Tambah Ruangan"}
            isLoading={isLoading}
        >
            <div className="space-y-5 py-2">
                <div className="space-y-2.5">
                    <Label className="text-sm font-semibold">
                        Nomor Ruangan <span className="text-destructive">*</span>
                    </Label>
                    <Input placeholder="Contoh: 101"
                           {...registerRoom("room_number", {required: "Nomor ruangan tidak boleh kosong"})}/>
                    {roomErrors.room_number &&
                        <p className="text-sm text-destructive">{roomErrors.room_number.message}</p>}
                </div>

                <div className="space-y-2.5">
                    <Label className="text-sm font-semibold">
                        Tipe Ruangan <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                        name="room_type_id" control={controlRoom}
                        rules={{required: "Tipe ruangan tidak boleh kosong"}}
                        render={({field}) => (
                            <AsyncSelect fetchFn={fetchRoomTypeOptions} value={field.value} onChange={field.onChange}
                                         placeholder="Cari tipe ruangan..." debounce={300}
                                         defaultLabel={roomValue?.room_type?.name ?? null}/>
                        )}
                    />
                    {roomErrors.room_type_id &&
                        <p className="text-sm text-destructive">{roomErrors.room_type_id.message}</p>}
                </div>

                <div className="space-y-2.5">
                    <Label className="text-sm font-semibold">
                        Nama Ruangan <span className="text-destructive">*</span>
                    </Label>
                    <Input placeholder="Contoh: Ruangan VIP A"
                           {...registerRoom("name", {required: "Nama ruangan tidak boleh kosong"})}/>
                    {roomErrors.name && <p className="text-sm text-destructive">{roomErrors.name.message}</p>}
                </div>

                <div className="space-y-2.5">
                    <Label className="text-sm font-semibold">
                        Kapasitas <span className="text-destructive">*</span>
                    </Label>
                    <Input type="number" placeholder="Contoh: 10"
                           {...registerRoom("capacity", {
                               required: "Kapasitas tidak boleh kosong",
                               min: {value: 1, message: "Kapasitas minimal 1"}
                           })}/>
                    {roomErrors.capacity && <p className="text-sm text-destructive">{roomErrors.capacity.message}</p>}
                </div>
            </div>
        </Modal>
    );
}

// ── Room Delete Modal ───────────────────────────────────────────────────────
export function RoomDeleteModal({open, onOpenChange, roomValue, onSubmit, isLoading}) {
    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title="Hapus Ruangan"
            description="Tindakan ini tidak dapat dibatalkan."
            onSubmit={onSubmit}
            submitText="Hapus Ruangan"
            type="danger"
            isLoading={isLoading}
        >
            <div className="space-y-4 py-2">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex gap-3">
                        <div
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/20 shrink-0">
                            <Trash2 className="w-5 h-5 text-destructive"/>
                        </div>
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-semibold">Konfirmasi Penghapusan</p>
                            <p className="text-sm text-muted-foreground">
                                Anda akan menghapus ruangan:{" "}
                                <span className="font-semibold text-foreground">{roomValue?.name}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                                No. {roomValue?.room_number} · Kapasitas {roomValue?.capacity}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

// ── Room Detail Modal (Beds) ────────────────────────────────────────────────
export function RoomDetailModal({open, onOpenChange, roomValue}) {
    const {bedsPagination, showRoom, roomStats} = useRoomStore();
    const [pageLoading, setPageLoading] = useState(false);
    const beds = roomValue?.beds ?? [];

    const loadPage = async (page) => {
        setPageLoading(true);
        await showRoom(roomValue.id, page);
        setPageLoading(false);
    };

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={roomValue?.name ?? ""}
            description={roomValue
                ? `No. ${roomValue.room_number} · Tipe: ${roomValue.room_type?.name ?? "-"} · Lantai ${roomValue.ward?.floor}`
                : null}
            hideFooter
            size="xl"
        >
            {!roomValue ? (
                <div className="space-y-4 py-2">
                    <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="rounded-lg p-3 h-16 bg-muted animate-pulse"/>
                        ))}
                    </div>
                    <div className="rounded-lg border h-40 bg-muted/30 animate-pulse"/>
                </div>
            ) : (
                <div className="space-y-4 py-2">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            {label: "Total",    value: roomStats?.total    ?? beds.length, color: "bg-slate-100 text-slate-700"},
                            {label: "Tersedia", value: roomStats?.available ?? 0,          color: "bg-emerald-50 text-emerald-700"},
                            {label: "Terisi",   value: roomStats?.occupied  ?? 0,          color: "bg-red-50 text-red-700"},
                        ].map(s => (
                            <div key={s.label} className={`rounded-lg p-3 text-center ${s.color}`}>
                                <p className="text-2xl font-bold">{s.value}</p>
                                <p className="text-xs font-medium mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Bed list — skeleton saat ganti halaman */}
                    {pageLoading ? (
                        <div className="space-y-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="rounded-lg border h-14 bg-muted animate-pulse"/>
                            ))}
                        </div>
                    ) : (
                        <BedListCollapsible beds={beds}/>
                    )}

                    {/* Pagination */}
                    {bedsPagination && bedsPagination.last_page > 1 && (
                        <div className="flex items-center justify-center gap-3 pt-1">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={bedsPagination.current_page === 1 || pageLoading}
                                onClick={() => loadPage(bedsPagination.current_page - 1)}
                            >
                                <ChevronLeft className="w-4 h-4"/>
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                {bedsPagination.current_page} / {bedsPagination.last_page}
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={bedsPagination.current_page === bedsPagination.last_page || pageLoading}
                                onClick={() => loadPage(bedsPagination.current_page + 1)}
                            >
                                <ChevronRight className="w-4 h-4"/>
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
}