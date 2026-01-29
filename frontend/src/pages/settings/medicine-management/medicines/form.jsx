import {useEffect, useCallback, useState} from "react";
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
import {CalendarIcon, Plus, Trash, AlertCircle} from "lucide-react";
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

    const [unitErrors, setUnitErrors] = useState({});

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
            category_id: "",
            is_for_sell: true,
            expired_date: "",
            expired_notification_days: 30,
            minimum_stock_amount: 0,
            reference_purchase_price: 0,
            base_unit: "",
            units: [{unit_name: "", multiplier: 1}],
            stock_amount: 0,
            stock_unit: "",
            stock_base_unit: 0,
        }
    });

    const mustHasReceipt = watch("must_has_receipt");
    const name = watch("name");
    const categoryId = watch("category_id");
    const isForSell = watch("is_for_sell");
    const baseUnit = watch("base_unit");
    const units = watch("units") || [];

    const generateMedicineSKU = useCallback(() => {
        if (!medicineCategoryValue?.name || !name) return;

        let cat = medicineCategoryValue.name.substring(0, Math.min(3, medicineCategoryValue.name.length)).toUpperCase();
        let names = name.substring(0, Math.min(3, name.length)).toUpperCase();
        let seq = Math.floor(Math.random() * 999).toString().padStart(3, '0');

        setValue('sku', `${cat}-${names}-${seq}`);
    }, [medicineCategoryValue, name, setValue]);

    useEffect(() => {
        fetchMedicineCategories();
    }, [id, isEditMode]);

    useEffect(() => {
        if (!categoryId) return;
        showMedicineCategory(categoryId);
    }, [categoryId, showMedicineCategory]);

    const ALL_UNITS = [
        {value: "tablet", label: "Tablet"},
        {value: "vial", label: "Vial"},
        {value: "ampul", label: "Ampul"},
        {value: "botol", label: "Botol"},
        {value: "box", label: "Box"},
        {value: "pcs", label: "Pcs"},
    ];

    const getAvailableUnitsForRow = (currentRowIndex) => {
        const selectedUnitNames = units
            .map((u, idx) => idx !== currentRowIndex ? u.unit_name : null)
            .filter(Boolean);

        return ALL_UNITS.filter(unit =>
            unit.value !== baseUnit &&
            !selectedUnitNames.includes(unit.value)
        );
    };

    const validateUnitMultiplier = (index, value) => {
        const newErrors = {...unitErrors};
        if (index === 0) {
            if (value !== 1) {
                newErrors[index] = "Satuan dasar harus bernilai 1";
            } else {
                delete newErrors[index];
            }
        } else {
            if (!value || value < 1) {
                newErrors[index] = "Isi minimal 1";
            } else if (value === 1) {
                newErrors[index] = `Satuan turunan harus lebih dari 1 ${baseUnit}`;
            } else {
                delete newErrors[index];
            }
        }

        setUnitErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateAllUnits = () => {
        const errors = {};

        units.forEach((unit, index) => {
            if (index === 0) {
                if (unit.multiplier !== 1) {
                    errors[index] = "Satuan dasar harus bernilai 1";
                }
            } else {
                if (!unit.multiplier || unit.multiplier < 1) {
                    errors[index] = "Isi minimal 1";
                } else if (unit.multiplier === 1) {
                    errors[index] = `Satuan turunan harus lebih dari 1 ${baseUnit}`;
                } else if (!unit.unit_name) {
                    errors[index] = "Pilih nama satuan";
                }
            }
        });

        setUnitErrors(errors);
        return Object.keys(errors).length === 0;
    };

    useEffect(() => {
        if (!baseUnit) return;

        const currentUnits = watch("units");
        if (!currentUnits || currentUnits.length === 0 || currentUnits[0].unit_name !== baseUnit) {
            setValue("units", [
                {unit_name: baseUnit, multiplier: 1}
            ]);
            setUnitErrors({});
        }
    }, [baseUnit, setValue, watch]);

    useEffect(() => {
        if (isEditMode) return;
        if (!name || !medicineCategoryValue?.name) return;

        const timeoutId = setTimeout(() => {
            generateMedicineSKU();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [name, medicineCategoryValue, isEditMode, generateMedicineSKU]);

    const onSubmit = async (data) => {
        if (!validateAllUnits()) {
            console.error("Unit validation failed");
            return;
        }

        try {
            let formData = new FormData();

            const specialFields = [
                'expired_date',
                'is_for_sell',
                'must_has_receipt',
                'units'
            ];

            Object.keys(data).forEach(key => {
                if (!specialFields.includes(key) && data[key] !== null && data[key] !== undefined && data[key] !== "") {
                    formData.append(key, data[key]);
                }
            });

            if (data.expired_date) {
                formData.append('expired_date', format(data.expired_date, "yyyy-MM-dd"));
            }

            formData.append('is_for_sell', data.is_for_sell ? 1 : 0);
            formData.append('must_has_receipt', data.must_has_receipt ? 1 : 0);

            if (data.units && data.units.length > 0) {
                const validUnits = data.units.filter(unit =>
                    unit.unit_name &&
                    unit.multiplier > 0 &&
                    (data.units.indexOf(unit) === 0 || unit.multiplier > 1)
                );
                formData.append('units', JSON.stringify(validUnits));
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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                                {/* Unit Type - Moved to top */}
                                <div className="space-y-2">
                                    <Label htmlFor="base_unit">
                                        Satuan Dasar <span className="text-destructive">*</span>
                                    </Label>
                                    <Controller
                                        name="base_unit"
                                        control={control}
                                        rules={{required: "Satuan wajib dipilih"}}
                                        render={({field}) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih Satuan"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="tablet">Tablet</SelectItem>
                                                    <SelectItem value="vial">Vial</SelectItem>
                                                    <SelectItem value="ampul">Ampul</SelectItem>
                                                    <SelectItem value="botol">Botol</SelectItem>
                                                    <SelectItem value="box">Box</SelectItem>
                                                    <SelectItem value="pcs">Pcs</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.base_unit && (
                                        <p className="text-sm text-destructive">{errors.base_unit.message}</p>
                                    )}
                                </div>

                                {/* Minimum Stock Amount */}
                                <div className="space-y-2">
                                    <Label>Stok Minimum {baseUnit && `(${baseUnit})`}</Label>
                                    <Input
                                        id="minimum_stock_amount"
                                        type="number"
                                        {...register("minimum_stock_amount", {
                                            valueAsNumber: true,
                                            min: {value: 0, message: "Stok minimum tidak boleh negatif"}
                                        })}
                                        placeholder="0"
                                        disabled={!baseUnit}
                                    />
                                    {errors.minimum_stock_amount && (
                                        <p className="text-sm text-destructive">{errors.minimum_stock_amount.message}</p>
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

                    {/* Units/Packaging Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Satuan / Kemasan</CardTitle>
                            <CardDescription>
                                Atur satuan jual berdasarkan satuan dasar {baseUnit && `(${baseUnit})`}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {!baseUnit && (
                                <div
                                    className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                                    ⚠️ Pilih satuan dasar terlebih dahulu untuk menambahkan satuan kemasan
                                </div>
                            )}

                            {baseUnit && (
                                <div
                                    className="text-sm text-blue-600 bg-blue-50 p-3 rounded-md border border-blue-200 flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0"/>
                                    <div>
                                        <p className="font-medium">Aturan Pengisian Satuan:</p>
                                        <ul className="mt-1 space-y-1 text-xs">
                                            <li>• Satuan dasar = 1 {baseUnit} (tidak bisa diubah)</li>
                                            <li>• Satuan turunan harus <strong>lebih dari 1 {baseUnit}</strong></li>
                                            <li>• Contoh: 1 Box = 10 {baseUnit}, 1 Botol = 100 {baseUnit}</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {baseUnit && units?.map((unit, index) => {
                                const availableUnits = getAvailableUnitsForRow(index);
                                const hasError = unitErrors[index];

                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            "grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 rounded-lg",
                                            hasError ? "bg-red-50 border-2 border-red-200" : "bg-gray-50"
                                        )}
                                    >
                                        {/* Unit Name */}
                                        <div className="md:col-span-5 space-y-2">
                                            <Label className="mb-4">
                                                Nama Satuan
                                                {index === 0 &&
                                                    <span className="text-xs text-gray-500 ml-1">(Dasar)</span>}
                                            </Label>
                                            {index === 0 ? (
                                                <Input
                                                    placeholder="Satuan dasar"
                                                    value={baseUnit}
                                                    disabled
                                                    className="bg-gray-100"
                                                />
                                            ) : (
                                                <Select
                                                    value={unit.unit_name || ""}
                                                    onValueChange={(value) => {
                                                        const updatedUnits = [...units];
                                                        updatedUnits[index].unit_name = value;
                                                        setValue("units", updatedUnits);

                                                        // Clear error untuk unit ini
                                                        if (updatedUnits[index].multiplier > 1) {
                                                            const newErrors = {...unitErrors};
                                                            delete newErrors[index];
                                                            setUnitErrors(newErrors);
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih satuan"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {availableUnits.length > 0 ? (
                                                            availableUnits.map(({value, label}) => (
                                                                <SelectItem key={value} value={value}>
                                                                    {label}
                                                                </SelectItem>
                                                            ))
                                                        ) : (
                                                            <div className="px-2 py-1.5 text-sm text-gray-500">
                                                                Semua satuan sudah digunakan
                                                            </div>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>

                                        {/* Multiplier */}
                                        <div className="md:col-span-5 space-y-2">
                                            <Label className="mb-4">
                                                Isi ({baseUnit})
                                                {index > 0 &&
                                                    <span className="text-xs text-gray-500 ml-1">(min: 2)</span>}
                                            </Label>
                                            <Input
                                                type="number"
                                                disabled={index === 0}
                                                value={unit.multiplier || 1}
                                                min={index === 0 ? 1 : 2}
                                                className={cn(
                                                    index === 0 ? "bg-gray-100" : "",
                                                    hasError ? "border-red-500" : ""
                                                )}
                                                onChange={(e) => {
                                                    const value = Number(e.target.value) || 1;
                                                    const updatedUnits = [...units];
                                                    updatedUnits[index].multiplier = value;
                                                    setValue("units", updatedUnits);

                                                    // Validate
                                                    validateUnitMultiplier(index, value);
                                                }}
                                                onBlur={(e) => {
                                                    const value = Number(e.target.value) || 1;
                                                    validateUnitMultiplier(index, value);
                                                }}
                                            />
                                            {hasError && (
                                                <p className="text-xs text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3"/>
                                                    {hasError}
                                                </p>
                                            )}

                                        </div>


                                        {/* Actions */}
                                        <div className="md:col-span-2 flex gap-2 items-start">
                                            {index > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => {
                                                        const updatedUnits = units.filter((_, i) => i !== index);
                                                        setValue("units", updatedUnits);

                                                        // Remove error untuk index ini
                                                        const newErrors = {...unitErrors};
                                                        delete newErrors[index];
                                                        // Re-index errors
                                                        const reindexedErrors = {};
                                                        Object.keys(newErrors).forEach(key => {
                                                            const keyNum = Number(key);
                                                            if (keyNum > index) {
                                                                reindexedErrors[keyNum - 1] = newErrors[key];
                                                            } else {
                                                                reindexedErrors[key] = newErrors[key];
                                                            }
                                                        });
                                                        setUnitErrors(reindexedErrors);
                                                    }}
                                                >
                                                    <Trash size={16}/>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {baseUnit && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    disabled={getAvailableUnitsForRow(units.length).length === 0}
                                    onClick={() => {
                                        setValue("units", [
                                            ...units,
                                            {unit_name: "", multiplier: 2}
                                        ]);
                                    }}
                                >
                                    <Plus className="mr-2" size={16}/>
                                    {getAvailableUnitsForRow(units.length).length > 0
                                        ? "Tambahkan Satuan"
                                        : "Semua satuan sudah digunakan"
                                    }
                                </Button>
                            )}
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
                            type="submit"
                            disabled={isSubmitting || Object.keys(unitErrors).length > 0}
                        >
                            {isSubmitting ? "Menyimpan..." : isEditMode ? "Update Obat" : "Tambah Obat"}
                        </Button>
                    </div>
                </form>
            </div>
        </SettingPage>
    );
}

export default MedicineForm;