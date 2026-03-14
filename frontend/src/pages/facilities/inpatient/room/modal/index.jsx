import {Trash2} from "lucide-react";
import Modal from "@/components/common/modal.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";

// ── Bed Modal (Create / Edit) ─────────────────────────────────────────────
export function BedModal({
                             open,
                             onOpenChange,
                             bedValue,
                             onSubmit,
                             isLoading,
                             registerBed,
                             bedErrors,
                         }) {
    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={bedValue ? "Edit Tempat Tidur" : "Tambah Tempat Tidur"}
            description={bedValue ? "Ubah informasi tempat tidur" : "Tambahkan tempat tidur baru ke ruangan ini."}
            onSubmit={onSubmit}
            submitText={bedValue ? "Simpan Perubahan" : "Tambah Tempat Tidur"}
            isLoading={isLoading}
        >
            <div className="space-y-5 py-2">
                <div className="space-y-2.5">
                    <Label className="text-sm font-semibold">
                        Nomor Tempat Tidur <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        placeholder="Contoh: B-01"
                        {...registerBed("bed_number", {required: "Nomor tempat tidur tidak boleh kosong"})}
                    />
                    {bedErrors.bed_number && (
                        <p className="text-sm text-destructive">{bedErrors.bed_number.message}</p>
                    )}
                </div>
            </div>
        </Modal>
    );
}

// ── Bed Delete Modal ──────────────────────────────────────────────────────
export function BedDeleteModal({open, onOpenChange, bedValue, onSubmit, isLoading}) {
    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title="Hapus Tempat Tidur"
            description="Tindakan ini tidak dapat dibatalkan."
            onSubmit={onSubmit}
            submitText="Hapus Tempat Tidur"
            type="danger"
            isLoading={isLoading}
        >
            <div className="space-y-4 py-2">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/20 shrink-0">
                            <Trash2 className="w-5 h-5 text-destructive"/>
                        </div>
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-semibold">Konfirmasi Penghapusan</p>
                            <p className="text-sm text-muted-foreground">
                                Anda akan menghapus tempat tidur:{" "}
                                <span className="font-semibold text-foreground">{bedValue?.bed_number}</span>
                            </p>
                            {bedValue?.status === "occupied" && (
                                <p className="text-sm text-destructive font-medium mt-1">
                                    ⚠️ Tempat tidur ini sedang terisi pasien.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}