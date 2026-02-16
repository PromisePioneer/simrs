import {useEffect} from "react";

``
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Controller} from "react-hook-form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Input} from "@/components/ui/input.jsx";
import {generateMedicineSKU} from "@/utils/medicines/skuGenerator.js";


function MedicineBasicInfoSections({register, control, medicineCategories, errors, watch, setValue}) {
    const sku = watch("sku");
    useEffect(() => {
        if (!sku) {
            const generatedSKU = generateMedicineSKU();
            setValue("sku", generatedSKU);
        }
    }, [sku]);


    return <Card>
        <CardHeader>
            <CardTitle>Informasi Dasar</CardTitle>
            <CardDescription>
                Informasi dasar obat yang akan ditambahkan
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">
                        Nama Obat <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="name"
                        {...register("name", {required: "Nama obat wajib diisi"})}
                        placeholder="Masukkan nama obat"
                    />
                    {errors.name && (
                        <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                </div>

                {/* Type */}
                <div className="space-y-2">
                    <Label htmlFor="type">
                        Tipe Obat <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                        name="type"
                        control={control}
                        rules={{required: "Tipe obat tidak boleh kosong"}}
                        render={({field}) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih tipe"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tablets">Tablet</SelectItem>
                                    <SelectItem value="capsule">Kapsul</SelectItem>
                                    <SelectItem value="injection">Injeksi</SelectItem>
                                    <SelectItem value="syrup">Sirup</SelectItem>
                                    <SelectItem value="ointment">Salep</SelectItem>
                                    <SelectItem value="lainnya">Lainnya</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.type && (
                        <p className="text-sm text-destructive">{errors.type.message}</p>
                    )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <Label htmlFor="category_id">
                        Kategori <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                        name="category_id"
                        control={control}
                        rules={{required: "Kategori tidak boleh kosong"}}
                        render={({field}) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Kategori"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {medicineCategories.length > 0 && medicineCategories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.category_id && (
                        <p className="text-sm text-destructive">{errors.category_id.message}</p>
                    )}
                </div>
            </div>
        </CardContent>
    </Card>
}


export default MedicineBasicInfoSections;
``