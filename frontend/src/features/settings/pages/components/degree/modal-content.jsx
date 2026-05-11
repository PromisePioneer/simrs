import {Label} from "@shared/components/ui/label.jsx";
import {Input} from "@shared/components/ui/input.jsx";
import {Controller} from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectGroup, SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@shared/components/ui/select.jsx";
import {Trash2} from "lucide-react";


export const DegreeModalFormContent = ({register, degreeValueLoading, errors, control}) => {
    return (
        <div className="space-y-5 py-2">
            <div className="space-y-2.5">
                <Label htmlFor="degree-name" className="text-sm font-semibold">Nama <span
                    className="text-destructive">*</span></Label>
                <Input id="degree-name" placeholder="Contoh: S.Kom, M.M"
                       {...register("name", {required: "Nama gelar tidak boleh kosong"})}
                       disabled={degreeValueLoading}/>
                {errors.name &&
                    <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="degree-type">Tipe <span
                    className="text-destructive">*</span></Label>
                <Controller name="type" control={control}
                            disabled={degreeValueLoading}
                            rules={{required: "Tipe Gelar harus dipilih"}}
                            render={({field}) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Tipe Gelar"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Tipe Gelar</SelectLabel>
                                            <SelectItem value="prefix">Gelar Depan</SelectItem>
                                            <SelectItem value="suffix">Gelar Belakang</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}/>
                {errors.type &&
                    <p className="text-sm text-destructive">{errors.type.message}</p>}
            </div>
        </div>
    );
}


export const DegreeModalDeleteContent = ({degreeValue, selectedIds, degrees}) => {
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
                        {degreeValue && selectedIds.length <= 1 ? (
                            <p className="text-sm text-muted-foreground">
                                Anda akan menghapus gelar: <span
                                className="font-semibold text-foreground">{degreeValue?.name}</span>
                            </p>
                        ) : (
                            /* Jika hapus banyak item */
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>Anda akan menghapus <span
                                    className="font-semibold text-foreground">{selectedIds.length} gelar</span>:
                                </p>
                                <ul className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                                    {degrees?.data
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
    );
}