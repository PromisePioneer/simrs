import {Label} from "@shared/components/ui/label.jsx";
import {Input} from "@shared/components/ui/input.jsx";
import {Textarea} from "@shared/components/ui/textarea.jsx";
import {Trash2} from "lucide-react";


export const DepartmentModalFormContent = ({register, errors}) => {
    return (
        <div className="space-y-5 py-2">
            <div className="space-y-2.5">
                <Label htmlFor="name" className="text-sm font-semibold">Nama <span
                    className="text-destructive">*</span></Label>
                <Input id="name" placeholder="Contoh: ICU"
                       {...register("name", {required: "Nama department tidak boleh kosong"})}
                />
                {errors.name &&
                    <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">
                    Deskripsi
                    <span className="text-destructive">*</span>
                </Label>
                <Textarea id="description"
                          {...register("description")}
                />
                {errors.description &&
                    <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>
        </div>
    )
}


export const DepartmentDeleteModalContent = ({departmentValue, selectedIds, departments}) => {
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
                        {departmentValue && selectedIds.length <= 1 ? (
                            <p className="text-sm text-muted-foreground">
                                Anda akan menghapus Departemen: <span
                                className="font-semibold text-foreground">{departmentValue?.name}</span>
                            </p>
                        ) : (
                            /* Jika hapus banyak item */
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>Anda akan menghapus <span
                                    className="font-semibold text-foreground">{selectedIds.length} Departemen</span>:
                                </p>
                                <ul className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                                    {departments?.data
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