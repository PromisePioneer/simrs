import {Label} from "@shared/components/ui/label.jsx";
import {Input} from "@shared/components/ui/input.jsx";
import {Textarea} from "@shared/components/ui/textarea.jsx";
import {Trash2} from "lucide-react";


export const BuildingModalFormContent = ({register, errors}) => {
    return (
        <div className="space-y-4 py-1">
            <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium">
                    Nama Gedung <span className="text-destructive">*</span>
                </Label>
                <Input id="name" placeholder="Contoh: Gedung A"
                       {...register("name", {required: "Nama gedung tidak boleh kosong"})}/>
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="description" className="text-sm font-medium">Deskripsi</Label>
                <Textarea id="description" placeholder="Masukkan deskripsi gedung..."
                          className="resize-none" rows={3}
                          {...register("description")}/>
            </div>
        </div>
    )
}


export const BuildingDeleteModalContent = ({buildingValue, selectedIds, buildings}) => {
    return (
        <div className="space-y-4 py-2">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex gap-3">
                    <div className="shrink-0">
                        <div
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/20">
                            <Trash2 className="w-5 h-5 text-destructive"/>
                        </div>
                    </div>
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-semibold text-foreground">Konfirmasi Penghapusan</p>

                        {/* Jika hapus satu item */}
                        {buildingValue && selectedIds.length <= 1 ? (
                            <p className="text-sm text-muted-foreground">
                                Anda akan menghapus poli: <span
                                className="font-semibold text-foreground">{buildingValue?.name}</span>
                            </p>
                        ) : (
                            /* Jika hapus banyak item */
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>Anda akan menghapus <span
                                    className="font-semibold text-foreground">{selectedIds.length} poli</span>:
                                </p>
                                <ul className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                                    {buildings?.data
                                        ?.filter(d => selectedIds.includes(d.id))
                                        .map(d => (
                                            <li key={d.id} className="flex items-center gap-2">
                                                        <span
                                                            className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0"/>
                                                <span className="font-semibold text-foreground">{d.name}</span>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}