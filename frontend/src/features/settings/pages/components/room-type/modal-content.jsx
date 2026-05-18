import {Label} from "@shared/components/ui/label.jsx";
import {Input} from "@shared/components/ui/input.jsx";
import {Textarea} from "@shared/components/ui/textarea.jsx";
import {Trash2} from "lucide-react";


export const RoomTypeModalFormContent = ({register, errors, isLoading}) => {
    return (
        <div className="space-y-5 py-2">
            {/* Kode */}
            <div className="space-y-2.5">
                <Label htmlFor="code" className="text-sm font-semibold">
                    Kode <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="code"
                    placeholder="Contoh: VIP, KLS1, KLS2"
                    {...register("code", {required: "Kode tidak boleh kosong"})}
                    disabled={isLoading}
                />
                {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
            </div>

            {/* Nama */}
            <div className="space-y-2.5">
                <Label htmlFor="name" className="text-sm font-semibold">
                    Nama <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="name"
                    placeholder="Contoh: VIP, Kelas 1, Kelas 2, ICU"
                    {...register("name", {required: "Nama tidak boleh kosong"})}
                    disabled={isLoading}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            {/* Kapasitas + Tarif — 2 kolom */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2.5">
                    <Label htmlFor="default_capacity" className="text-sm font-semibold">
                        Kapasitas <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="default_capacity"
                        type="number"
                        min="1"
                        placeholder="Contoh: 4"
                        {...register("default_capacity", {
                            required: "Kapasitas tidak boleh kosong",
                            min: {value: 1, message: "Minimal 1"},
                        })}
                        disabled={isLoading}
                    />
                    {errors.default_capacity &&
                        <p className="text-sm text-destructive">{errors.default_capacity.message}</p>}
                </div>

                <div className="space-y-2.5">
                    <Label htmlFor="rate_per_night" className="text-sm font-semibold">
                        Tarif / Malam (Rp) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="rate_per_night"
                        type="number"
                        min="0"
                        placeholder="Contoh: 500000"
                        {...register("rate_per_night", {
                            required: "Tarif tidak boleh kosong",
                            min: {value: 0, message: "Tarif tidak boleh negatif"},
                        })}
                        disabled={isLoading}
                    />
                    {errors.rate_per_night &&
                        <p className="text-sm text-destructive">{errors.rate_per_night.message}</p>}
                </div>
            </div>

            {/* Deskripsi */}
            <div className="space-y-2.5">
                <Label htmlFor="description" className="text-sm font-semibold">
                    Deskripsi <span className="text-muted-foreground font-normal">(opsional)</span>
                </Label>
                <Textarea
                    id="description"
                    placeholder="Contoh: Kamar VIP dengan fasilitas AC, TV, dan kamar mandi dalam"
                    {...register("description")}
                    disabled={isLoading}
                />
                {errors.description &&
                    <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>
        </div>
    );
}


export const RoomTypeDeleteModalContent = ({roomTypeValue, selectedIds, roomTypes}) => {
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
                        {roomTypeValue && selectedIds.length <= 1 ? (
                            <p className="text-sm text-muted-foreground">
                                Anda akan menghapus poli: <span
                                className="font-semibold text-foreground">{roomTypeValue?.name}</span>
                            </p>
                        ) : (
                            /* Jika hapus banyak item */
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>Anda akan menghapus <span
                                    className="font-semibold text-foreground">{selectedIds.length} poli</span>:
                                </p>
                                <ul className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                                    {roomTypes?.data
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