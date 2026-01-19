import {useEffect} from "react";
import {useNavigate, useParams} from "@tanstack/react-router";
import {useForm} from "react-hook-form";
import {useMedicineStore} from "@/store/medicineStore.js";
import {useMedicineCategoriesStore} from "@/store/medicineCategoriesStore.js";
import SettingPage from "@/pages/settings/index.jsx";
import ContentHeader from "@/components/ui/content-header.jsx";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
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

function MedicineForm(opts) {
    const {id} = useParams(opts);
    const isEditMode = !!id;
    const navigate = useNavigate();

    const {createMedicine, updateMedicine, getMedicineById} = useMedicineStore();
    const {fetchMedicineCategories, medicineCategories} = useMedicineCategoriesStore();
    const {fetchMedicineWarehouses, medicineWarehouses} = useMedicineWarehouseStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
        setValue,
        watch
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
            stock_amount: 0,
            minimum_stock_amount: 0,
            reference_purchase_price: 0,
            unit_type_id: ""
        }
    });

    useEffect(() => {
        fetchMedicineCategories();
        fetchMedicineWarehouses();

        if (isEditMode && id) {
            const medicine = getMedicineById(id);
            if (medicine) {
                reset(medicine);
            }
        }
    }, [id, isEditMode]);

    const onSubmit = async (data) => {
        try {
            if (isEditMode) {
                await updateMedicine(id, data);
            } else {
                await createMedicine(data);
            }
            navigate({to: "/medicines"});
        } catch (error) {
            console.error("Error saving medicine:", error);
        }
    };

    const mustHasReceipt = watch("must_has_receipt");
    const isForSell = watch("is_for_sell");

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
                                        placeholder="Masukkan SKU"
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
                                    <Select
                                        onValueChange={(value) => setValue("type", value)}
                                        defaultValue={watch("type")}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih tipe"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="tablet">Tablet</SelectItem>
                                            <SelectItem value="kapsul">Kapsul</SelectItem>
                                            <SelectItem value="sirup">Sirup</SelectItem>
                                            <SelectItem value="injeksi">Injeksi</SelectItem>
                                            <SelectItem value="salep">Salep</SelectItem>
                                            <SelectItem value="lainnya">Lainnya</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.type && (
                                        <p className="text-sm text-destructive">{errors.type.message}</p>
                                    )}
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label htmlFor="category_id">
                                        Kategori <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        className="w-full"
                                        onValueChange={(value) => setValue("category_id", value)}
                                        defaultValue={watch("category_id")}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih kategori"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {medicineCategories?.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                    <Input
                                        id="warehouse_id"
                                        {...register("warehouse_id")}
                                        placeholder="ID Gudang"
                                    />
                                </div>

                                {/* Rack */}
                                <div className="space-y-2">
                                    <Label htmlFor="rack_id">Rak</Label>
                                    <Input
                                        id="rack_id"
                                        {...register("rack_id")}
                                        placeholder="ID Rak"
                                    />
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
                                {/* Stock Amount */}
                                <div className="space-y-2">
                                    <Label htmlFor="stock_amount">
                                        Jumlah Stok <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="stock_amount"
                                        type="number"
                                        {...register("stock_amount", {
                                            required: "Jumlah stok wajib diisi",
                                            valueAsNumber: true,
                                            min: {value: 0, message: "Stok tidak boleh negatif"}
                                        })}
                                        placeholder="0"
                                    />
                                    {errors.stock_amount && (
                                        <p className="text-sm text-destructive">{errors.stock_amount.message}</p>
                                    )}
                                </div>

                                {/* Minimum Stock */}
                                <div className="space-y-2">
                                    <Label htmlFor="minimum_stock_amount">Stok Minimum</Label>
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
                                    <Label htmlFor="unit_type_id">Satuan</Label>
                                    <Input
                                        id="unit_type_id"
                                        {...register("unit_type_id")}
                                        placeholder="ID Satuan (pcs, box, strip, dll)"
                                    />
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
                                    <Input
                                        id="expired_date"
                                        type="date"
                                        {...register("expired_date")}
                                    />
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
                            onClick={() => navigate({to: "/medicines"})}
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