import {Trash2, BedSingle} from "lucide-react";
import Modal from "@/components/common/modal.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";

export function BedModal({open, onOpenChange, bedValue, onSubmit, isLoading, registerBed, bedErrors}) {
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
            <div className="space-y-4 py-1">
                <div className="space-y-1.5">
                    <Label htmlFor="bed_number" className="text-sm font-medium">
                        Nomor Tempat Tidur <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="bed_number"
                        placeholder="Contoh: B-01"
                        {...registerBed("bed_number", {required: "Nomor tempat tidur tidak boleh kosong"})}
                    />
                    {bedErrors.bed_number && (
                        <p className="text-xs text-destructive">{bedErrors.bed_number.message}</p>
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
            <div className="py-1">
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div
                            className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
                            <BedSingle className="w-4 h-4 text-red-600 dark:text-red-400"/>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-foreground">
                                Hapus tempat tidur{" "}
                                <span className="text-red-600 dark:text-red-400">{bedValue?.bed_number}</span>?
                            </p>
                            {bedValue?.status === "occupied" && (
                                <p className="text-xs text-red-600 dark:text-red-400 font-medium">
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