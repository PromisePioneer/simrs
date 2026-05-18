import {Label} from "@shared/components/ui/label.jsx";
import {Input} from "@shared/components/ui/input.jsx";
import {Controller} from "react-hook-form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@shared/components/ui/select.jsx";
import {Trash2} from "lucide-react";
import {Textarea} from "@shared/components/ui/textarea.jsx";

export const DiseaseModalFormContent = ({register, control, errors}) => {
    return (
        <div className="space-y-4 py-2">

            {/* Kode & Nama */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="code">
                        Kode ICD-10 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="code"
                        placeholder="Contoh: A00"
                        {...register("code", {required: "Kode tidak boleh kosong"})}
                    />
                    {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name">
                        Nama Penyakit <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="name"
                        placeholder="Contoh: Kolera"
                        {...register("name", {required: "Nama tidak boleh kosong"})}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
            </div>

            {/* Gejala */}
            <div className="space-y-2">
                <Label htmlFor="symptoms">Gejala</Label>
                <Textarea
                    id="symptoms"
                    placeholder="Deskripsikan gejala penyakit..."
                    rows={2}
                    {...register("symptoms")}
                />
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                    id="description"
                    placeholder="Deskripsi tambahan..."
                    rows={2}
                    {...register("description")}
                />
            </div>

            {/* Status & Valid Code */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Status Penularan <span className="text-destructive">*</span></Label>
                    <Controller
                        name="status"
                        control={control}
                        render={({field}) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih status"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="infectious">Menular</SelectItem>
                                    <SelectItem value="not_contagious">Tidak Menular</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Valid Kode</Label>
                    <Controller
                        name="valid_code"
                        control={control}
                        render={({field}) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Valid</SelectItem>
                                    <SelectItem value="0">Tidak Valid</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </div>

            {/* ICD-10 Flags */}
            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label>Diagnosis Primer</Label>
                    <Controller
                        name="accpdx"
                        control={control}
                        render={({field}) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Y">Ya</SelectItem>
                                    <SelectItem value="N">Tidak</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Asterisk ICD-10</Label>
                    <Controller
                        name="asterisk"
                        control={control}
                        render={({field}) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Tidak</SelectItem>
                                    <SelectItem value="1">Ya</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Kode Manifestasi</Label>
                    <Controller
                        name="im"
                        control={control}
                        render={({field}) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Tidak</SelectItem>
                                    <SelectItem value="1">Ya</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </div>

        </div>
    );
}


export const DiseaseDeleteModalContent = ({diseaseValue, selectedIds, diseases}) => {
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
                        {diseaseValue && selectedIds.length <= 1 ? (
                            <p className="text-sm text-muted-foreground">
                                Anda akan menghapus penyakit: <span
                                className="font-semibold text-foreground">{diseaseValue?.name}</span>
                            </p>
                        ) : (
                            /* Jika hapus banyak item */
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>Anda akan menghapus <span
                                    className="font-semibold text-foreground">{selectedIds.length} penyakit</span>:
                                </p>
                                <ul className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                                    {diseases?.data
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