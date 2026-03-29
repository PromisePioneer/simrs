import {Trash2, Info} from "lucide-react";
import Modal from "@shared/components/common/modal.jsx";
import {Label} from "@shared/components/ui/label.jsx";
import {Input} from "@shared/components/ui/input.jsx";
import {Controller} from "react-hook-form";
import {AsyncSelect} from "@shared/components/common/async-select.jsx";
import {Badge} from "@shared/components/ui/badge.jsx";

// ── Ward Modal (Create / Edit) ────────────────────────────────────────────
export function WardModal({
                              open, onOpenChange, wardValue, onSubmit, isLoading,
                              registerWard, controlWard, wardErrors,
                              fetchBuildingOptions, fetchDepartmentOptions,
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

// ── Ward Delete Modal ─────────────────────────────────────────────────────
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

// ── Room Modal (Create / Edit) ────────────────────────────────────────────
export function RoomModal({
                              open, onOpenChange, roomValue, onSubmit, isLoading,
                              registerRoom, controlRoom, roomErrors, fetchRoomTypeOptions,
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
                            <AsyncSelect
                                fetchFn={fetchRoomTypeOptions}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Cari tipe ruangan..."
                                debounce={300}
                                defaultLabel={roomValue?.room_type?.name ?? null}
                                renderOption={(option) => (
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{option.label}</p>
                                        <p className="text-xs text-muted-foreground">Kapasitas
                                            bawaan: {option.capacity}</p>
                                    </div>
                                )}
                                renderValue={(option) => (
                                    <div className="flex items-center gap-2 py-0.5">
                                        <span className="font-medium">{option.label}</span>
                                        <span
                                            className="text-xs text-muted-foreground">· Kapasitas bawaan: {option.capacity}</span>
                                    </div>
                                )}
                            />
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
                    <Label className="text-sm font-semibold">Kapasitas</Label>
                    <Input
                        type="number"
                        placeholder="Contoh: 10"
                        {...registerRoom("capacity", {
                            min: {value: 1, message: "Kapasitas minimal 1"},
                        })}
                    />
                    {roomErrors.capacity && (
                        <p className="text-sm text-destructive">{roomErrors.capacity.message}</p>
                    )}
                    <div
                        className="flex items-center gap-1.5 w-fit rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                        <Info className="w-3.5 h-3.5 shrink-0"/>
                        Kapasitas mengikuti tipe ruangan jika dikosongkan
                    </div>
                </div>
            </div>
        </Modal>
    );
}

// ── Room Delete Modal ─────────────────────────────────────────────────────
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