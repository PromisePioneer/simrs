import {useEffect, useCallback} from "react";
import {useNavigate, useParams} from "@tanstack/react-router";
import {Controller, useForm} from "react-hook-form";
import {useMedicineStore} from "@/store/medicineStore.js";
import {useMedicineCategoriesStore} from "@/store/medicineCategoriesStore.js";
import SettingPage from "@/pages/settings/index.jsx";
import ContentHeader from "@/components/ui/content-header.jsx";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import {Calendar} from "@/components/ui/calendar.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {useMedicineWarehouseStore} from "@/store/medicineWarehouseStore.js";
import {useMedicineRackStore} from "@/store/medicineRackStore.js";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {CalendarIcon, Plus, Trash} from "lucide-react";
import {format} from "date-fns";
import {cn} from "@/lib/utils.js";

function MedicineForm(opts) {
    const {id} = useParams(opts);
    const isEditMode = !!id;
    const navigate = useNavigate();

    const {createMedicine, updateMedicine} = useMedicineStore();
    const {
        fetchMedicineCategories,
        medicineCategories,
        showMedicineCategory,
        medicineCategoryValue
    } = useMedicineCategoriesStore();
    const {fetchMedicineWarehouses, medicineWarehouses} = useMedicineWarehouseStore();
    const {fetchByMedicineWarehouse, racksByMedicineWarehouse} = useMedicineRackStore();


    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        setValue,
        watch,
        resetField,
        control,
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {
            sku: "",
            name: "",
            code: "",
            must_has_receipt: false,
            type: "",
            warehouse_id: "",
            category_id: "",
            rack_id: "",
            is_for_sell: true,
            expired_date: "",
            expired_notification_days: 30,
            minimum_stock_amount: 0,
            reference_purchase_price: 0,
            base_unit: "",
            units: [],
            stock_amount: 0,
            stock_unit: "",
            stock_base_unit: 0,
        }
    });

    const selectedWarehouse = watch("warehouse_id");
    const mustHasReceipt = watch("must_has_receipt");
    const name = watch("name");
    const categoryId = watch("category_id");
    const isForSell = watch("is_for_sell");
    const baseUnit = watch("base_unit");


    const generateMedicineSKU = useCallback(() => {
        if (!medicineCategoryValue?.name || !name) return;

        let cat = medicineCategoryValue.name.substring(0, Math.min(3, medicineCategoryValue.name.length)).toUpperCase();
        let names = name.substring(0, Math.min(3, name.length)).toUpperCase();
        let seq = Math.floor(Math.random() * 999).toString().padStart(3, '0');

        setValue('sku', `${cat}-${names}-${seq}`);
    }, [medicineCategoryValue, name, setValue]);


    useEffect(() => {
        const init = async () => {
            await Promise.all([
                fetchMedicineCategories(),
                fetchMedicineWarehouses(),
            ]);
        };

        init();
    }, [id, isEditMode]);

    useEffect(() => {
        if (!categoryId) return;
        showMedicineCategory(categoryId);
    }, [categoryId]);


    useEffect(() => {
        if (!baseUnit) return;

        setValue("units", [
            {unit_name: baseUnit, multiplier: 1}
        ]);
    }, [baseUnit]);

    useEffect(() => {
        if (isEditMode) return;
        if (!name || !medicineCategoryValue?.name) return;

        const timeoutId = setTimeout(() => {
            generateMedicineSKU();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [name, medicineCategoryValue, isEditMode, generateMedicineSKU]);

    useEffect(() => {
        if (!selectedWarehouse) return;
        resetField("rack_id");
        fetchByMedicineWarehouse(selectedWarehouse);
    }, [selectedWarehouse]);


    const onSubmit = async (data) => {
        try {
            let formData = new FormData();

            const specialFields = [
                'expired_date',
                'is_for_sell',
                'must_has_receipt',
                'units'
            ];


            Object.keys(data).forEach(key => {
                if (!specialFields.includes(key) && data[key]) {
                    formData.append(key, data[key]);
                }
            })


            if (data.expired_date) {
                formData.append('expired_date', format(data.expired_date, "yyyy-MM-dd"));
            }

            if (data.is_for_sell) {
                formData.append('is_for_sell', data.is_for_sell ? 1 : 0);
            }


            if (data.must_has_receipt) {
                formData.append('must_has_receipt', data.must_has_receipt ? 1 : 0);
            }


            if (data.units) {
                formData.append('units', JSON.stringify(data.units));
            }


            let result;
            if (isEditMode) {
                result = await updateMedicine(id, formData);
            } else {
                result = await createMedicine(formData);
            }

            if (result.success) {
                await navigate({
                    to: '/settings/medicine-management',
                    search: {tab: 'medicines'}
                });
            }
        } catch (error) {
            console.error("Error saving medicine:", error);
        }
    };


    return (
        <SettingPage>
            <div className="space-y-6">
                <ContentHeader
                    title={isEditMode ? "Edit Obat" : "Tambah Obat Baru"}
                    description={isEditMode ? "Perbarui informasi obat" : "Tambahkan obat baru ke sistem"}
                />

                <div className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Dasar</CardTitle>
                            <CardDescription>
                                Informasi dasar obat yang akan ditambahkan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* SKU */}
                                <div className="space-y-2">
                                    <Label htmlFor="sku">
                                        SKU <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="sku"
                                        {...register("sku", {required: "SKU wajib diisi"})}
                                        placeholder="SKU Otomatis"
                                        disabled
                                    />
                                    {errors.sku && (
                                        <p className="text-sm text-destructive">{errors.sku.message}</p>
                                    )}
                                </div>

                                {/* Code */}
                                <div className="space-y-2">
                                    <Label htmlFor="code">
                                        Kode <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="code"
                                        {...register("code", {required: "Kode wajib diisi"})}
                                        placeholder="Masukkan kode obat"
                                    />
                                    {errors.code && (
                                        <p className="text-sm text-destructive">{errors.code.message}</p>
                                    )}
                                </div>

                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Nama Obat <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        defaultValue={watch("name")}
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
                                                defaultValue={field.value}
                                                rules={{required: "tipe obat tidak boleh kosong"}}
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
                                                className="w-full"
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue
                                                        placeholder="Pilih Kategori"
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {medicineCategories?.map((category) => (
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

                    {/* Location Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Lokasi</CardTitle>
                            <CardDescription>
                                Informasi lokasi penyimpanan obat
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Warehouse */}
                                <div className="space-y-2">
                                    <Label htmlFor="warehouse_id">Gudang</Label>
                                    <Controller
                                        name="warehouse_id"
                                        control={control}
                                        rules={{required: "Gudang tidak boleh kosong"}}
                                        render={({field}) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue
                                                        placeholder="Pilih gudang"
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {medicineWarehouses?.map((medicineWarehouse) => (
                                                        <SelectItem key={medicineWarehouse.id}
                                                                    value={medicineWarehouse.id}>
                                                            {medicineWarehouse.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />

                                    {errors.warehouse_id && (
                                        <p className="text-sm text-destructive">{errors.warehouse_id.message}</p>
                                    )}
                                </div>

                                {/* Rack */}
                                <div className="space-y-2">
                                    <Label htmlFor="rack_id">Rak</Label>
                                    <Controller
                                        name="rack_id"
                                        control={control}
                                        rules={{required: "Rak tidak boleh kosong"}}
                                        render={({field}) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                disabled={!selectedWarehouse}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue
                                                        placeholder={
                                                            selectedWarehouse
                                                                ? "Pilih Rak"
                                                                : "Pilih gudang terlebih dahulu"
                                                        }
                                                    />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {racksByMedicineWarehouse?.map((rack) => (
                                                        <SelectItem key={rack.id} value={rack.id}>
                                                            {rack.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />

                                    {errors.rack_id && (
                                        <p className="text-sm text-destructive">{errors.rack_id.message}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stock Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Stok</CardTitle>
                            <CardDescription>
                                Informasi stok dan harga obat
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Minimum Stock Amount */}
                                <div className="space-y-2">
                                    <Label>Stok Minimum ({baseUnit})</Label>
                                    <Input
                                        id="minimum_stock_amount"
                                        type="number"
                                        {...register("minimum_stock_amount", {
                                            valueAsNumber: true,
                                            min: {value: 0, message: "Stok minimum tidak boleh negatif"}
                                        })}
                                        placeholder="0"
                                    />
                                    {errors.minimum_stock_amount && (
                                        <p className="text-sm text-destructive">{errors.minimum_stock_amount.message}</p>
                                    )}
                                </div>

                                {/* Unit Type */}
                                <div className="space-y-2">
                                    <Label htmlFor="base_unit">Satuan</Label>
                                    <Select
                                        onValueChange={(value) => setValue("base_unit", value)}
                                        defaultValue={watch("base_unit")}
                                        rules={{required: "tipe obat tidak boleh kosong"}}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih tipe"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="tablet">Tablet</SelectItem>
                                            <SelectItem value="ml">Ml</SelectItem>
                                            <SelectItem value="g">gram</SelectItem>
                                            <SelectItem value="vial">Vial</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.base_unit && (
                                        <p className="text-sm text-destructive">{errors.base_unit.message}</p>
                                    )}
                                </div>

                                {/* Reference Purchase Price */}
                                <div className="space-y-2">
                                    <Label htmlFor="reference_purchase_price">Harga Beli Referensi</Label>
                                    <Input
                                        id="reference_purchase_price"
                                        type="number"
                                        {...register("reference_purchase_price", {
                                            valueAsNumber: true,
                                            min: {value: 0, message: "Harga tidak boleh negatif"}
                                        })}
                                        placeholder="0"
                                    />
                                    {errors.reference_purchase_price && (
                                        <p className="text-sm text-destructive">{errors.reference_purchase_price.message}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>


                    <Card>
                        <CardHeader>
                            <CardTitle>Satuan / Kemasan</CardTitle>
                            <CardDescription>
                                Atur satuan jual berdasarkan base unit
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {watch("units")?.map((unit, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                                    <div className="space-y-2">
                                        <Label>Nama Satuan</Label>

                                        {index === 0 ? (
                                            <Input
                                                placeholder="Unit name"
                                                value={watch(`units.${index}.unit_name`)}
                                                disabled={index === 0}
                                                onChange={(e) => {
                                                    const units = [...watch("units")];
                                                    units[index].unit_name = e.target.value;
                                                    setValue("units", units);
                                                }}
                                            />
                                        ) : (
                                            <Select
                                                value={watch(`units.${index}.unit_name`)}
                                                onValueChange={(value) => {
                                                    const units = [...watch("units")];
                                                    units[index].unit_name = value;
                                                    setValue("units", units);
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select unit"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Tablet">Tablet</SelectItem>
                                                    <SelectItem value="Ml">Ml</SelectItem>
                                                    <SelectItem value="gram">Gram</SelectItem>
                                                    <SelectItem value="Vial">Vial</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Isi ({baseUnit})</Label>
                                        <Input
                                            type="number"
                                            disabled={index === 0}
                                            value={unit.multiplier}
                                            rules={{
                                                required: "isi tidak boleh kosong",
                                                min: {value: 1, message: "isi minimal 1"},
                                                number: "isi harus berupa angka"
                                            }}
                                            onChange={(e) => {
                                                const units = [...watch("units")];
                                                units[index].multiplier = Number(e.target.value);
                                                setValue("units", units);
                                            }}
                                        />
                                    </div>

                                    <div className="col-span-2 flex gap-2">
                                        {index > 0 && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => {
                                                    const units = watch("units").filter((_, i) => i !== index);
                                                    setValue("units", units);
                                                }}
                                            >
                                                <Trash size={16}/>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                disabled={!baseUnit}
                                onClick={() => {
                                    setValue("units", [
                                        ...watch("units"),
                                        {unit_name: "", multiplier: 1}
                                    ]);
                                }}
                            >
                                <Plus className="mr-2" size={16}/>
                                {baseUnit ? `Tambahkan Satuan` : "Tambahkan satuan terlebih dahulu"}
                            </Button>
                        </CardContent>
                    </Card>


                    {/* Expiry Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Kedaluwarsa</CardTitle>
                            <CardDescription>
                                Informasi tanggal kedaluwarsa dan notifikasi
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Expired Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="expired_date">Tanggal Kedaluwarsa</Label>
                                    <Controller
                                        name="expired_date"
                                        control={control}
                                        render={({field}) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4"/>
                                                        {field.value ? format(field.value, "PPP") :
                                                            <span>Pilih tanggal</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />

                                    {errors.expired_date && (
                                        <p className="text-sm text-destructive">{errors.expired_date.message}</p>
                                    )}
                                </div>

                                {/* Expired Notification Days */}
                                <div className="space-y-2">
                                    <Label htmlFor="expired_notification_days">Notifikasi Kedaluwarsa (Hari)</Label>
                                    <Input
                                        id="expired_notification_days"
                                        type="number"
                                        {...register("expired_notification_days", {
                                            valueAsNumber: true,
                                            min: {value: 1, message: "Minimal 1 hari"}
                                        })}
                                        placeholder="30"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Notifikasi akan muncul X hari sebelum tanggal kedaluwarsa
                                    </p>


                                    {errors.expired_notification_days && (
                                        <p className="text-sm text-destructive">{errors.expired_notification_days.message}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Options */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Opsi Tambahan</CardTitle>
                            <CardDescription>
                                Pengaturan tambahan untuk obat
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Must Has Receipt */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="must_has_receipt"
                                    checked={mustHasReceipt}
                                    onCheckedChange={(checked) => setValue("must_has_receipt", checked)}
                                />
                                <Label htmlFor="must_has_receipt" className="font-normal cursor-pointer">
                                    Harus dengan Resep Dokter
                                </Label>
                            </div>

                            {/* Is For Sell */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_for_sell"
                                    checked={isForSell}
                                    onCheckedChange={(checked) => setValue("is_for_sell", checked)}
                                />
                                <Label htmlFor="is_for_sell" className="font-normal cursor-pointer">
                                    Dijual / Untuk Penjualan
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate({to: "/settings/medicine-management"})}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Menyimpan..." : isEditMode ? "Update Obat" : "Tambah Obat"}
                        </Button>
                    </div>
                </div>
            </div>
        </SettingPage>
    );
}

export default MedicineForm;