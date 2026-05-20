import {Controller, useForm} from "react-hook-form";
import {useMedicineWarehouseStore} from "@features/medicine";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@shared/components/ui/card.jsx";
import {Label} from "@shared/components/ui/label.jsx";
import {Input} from "@shared/components/ui/input.jsx";
import {
    ArrowLeft, Building2, Save, Plus, Package, X
} from "lucide-react"
import {Link, useNavigate, useParams} from "@tanstack/react-router";
import ContentHeader from "@shared/components/ui/content-header.jsx";
import {Button} from "@shared/components/ui/button.jsx";
import SettingPage from "@features/settings/pages/index.jsx";
import {
    MultiSelect,
    MultiSelectContent,
    MultiSelectGroup, MultiSelectItem,
    MultiSelectTrigger,
    MultiSelectValue
} from "@shared/components/ui/multi-select.jsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@shared/components/ui/dialog.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@shared/components/ui/select.jsx";
import {useMedicineWarehouseForm} from "@features/medicine/hooks/useMedicineWarehouseForm.js";

function MedicineWarehouseForm(opts) {
    const medicineWarehouseForm = useMedicineWarehouseForm(opts);

    return (
        <>
            <SettingPage>
                <div className="space-y-6">
                    <ContentHeader
                        title={medicineWarehouseForm.isEditMode ? "Edit Gudang" : "Tambah Gudang Baru"}
                        description={medicineWarehouseForm.isEditMode ? "Perbarui informasi gudang" : "Tambahkan gudang baru ke sistem"}
                    />

                    <form onSubmit={medicineWarehouseForm.handleSubmit(medicineWarehouseForm.onSubmit)}>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <Link
                                    to="/pharmacy"
                                    search={{tab: 'medicine_warehouses'}}
                                >
                                    <Button type="button" variant="outline" size="sm" className="gap-2">
                                        <ArrowLeft className="w-4 h-4"/>
                                        Kembali ke Daftar Gudang
                                    </Button>
                                </Link>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building2 className="w-5 h-5"/>
                                        Informasi Umum Gudang
                                    </CardTitle>
                                    <CardDescription>Informasi dasar gudang</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-4 md:grid-cols-3">
                                        {!medicineWarehouseForm.userData?.tenant_id && (
                                            <div className="space-y-2">
                                                <Label htmlFor="tenant_id">
                                                    Tenant/Klinik <span className="text-destructive">*</span>
                                                </Label>
                                                <Controller
                                                    name="tenant_id"
                                                    control={medicineWarehouseForm.control}
                                                    rules={{required: !medicineWarehouseForm.isUserHasTenant && "Tenant wajib dipilih"}}
                                                    render={({field}) => (
                                                        <div className="relative">
                                                            <Select
                                                                value={field.value}
                                                                onValueChange={field.onChange}
                                                            >
                                                                <SelectTrigger
                                                                    className={field.value ? "w-full pr-9" : "w-full"}>
                                                                    <SelectValue placeholder="Pilih tenant/klinik"/>
                                                                </SelectTrigger>

                                                                <SelectContent>
                                                                    {medicineWarehouseForm.tenants?.length ? (
                                                                        medicineWarehouseForm.tenants.map((tenant) => (
                                                                            <SelectItem
                                                                                key={tenant.id}
                                                                                value={tenant.id.toString()}
                                                                            >
                                                                                <div
                                                                                    className="flex items-center gap-2">
                                                                                    <Building2 className="w-4 h-4"/>
                                                                                    {tenant.name}
                                                                                </div>
                                                                            </SelectItem>
                                                                        ))
                                                                    ) : (
                                                                        <SelectItem value="no-tenant" disabled>
                                                                            Tidak ada tenant tersedia
                                                                        </SelectItem>
                                                                    )}
                                                                </SelectContent>
                                                            </Select>

                                                            {field.value && (
                                                                <button
                                                                    type="button"
                                                                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-destructive"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        field.onChange(undefined);
                                                                    }}
                                                                >
                                                                    <X className="w-4 h-4"/>
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                />
                                                {medicineWarehouseForm.formState.errors.tenant_id && (
                                                    <p className="text-sm text-destructive">{medicineWarehouseForm.formState.errors.tenant_id.message}</p>
                                                )}
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <Label htmlFor="code">
                                                Kode <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="code"
                                                placeholder="Kode"
                                                maxLength={16}
                                                {...medicineWarehouseForm.register("code", {
                                                    required: "Kode wajib diisi",
                                                })}
                                            />
                                            {medicineWarehouseForm.formState.errors.code && (
                                                <p className="text-sm text-destructive">{medicineWarehouseForm.formState.errors.code.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                Nama Gudang <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="Masukkan nama gudang"
                                                {...medicineWarehouseForm.register("name", {required: "Nama gudang wajib diisi"})}
                                            />
                                            {medicineWarehouseForm.formState.errors.name && (
                                                <p className="text-sm text-destructive">{medicineWarehouseForm.formState.errors.name.message}</p>
                                            )}
                                        </div>
                                    </div>


                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="racks">
                                                Rak yg tersedia <span className="text-destructive">*</span>
                                            </Label>

                                            {medicineWarehouseForm.isLoading ? (
                                                <div className="text-sm text-muted-foreground">Memuat data rak...</div>
                                            ) : medicineWarehouseForm.hasRacks ? (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <Controller
                                                            name="racks"
                                                            control={medicineWarehouseForm.control}
                                                            rules={{
                                                                required: "Minimal satu rak harus dipilih",
                                                                validate: (value) =>
                                                                    (value && value.length > 0) || "Minimal satu rak harus dipilih"
                                                            }}
                                                            render={({field}) => (
                                                                <MultiSelect
                                                                    values={field.value ?? []}
                                                                    onValuesChange={field.onChange}
                                                                >
                                                                    <MultiSelectTrigger className="w-[600px]">
                                                                        <MultiSelectValue placeholder="Pilih Rak"
                                                                                          overflowBehavior="wrap-when-open"/>
                                                                    </MultiSelectTrigger>
                                                                    <MultiSelectContent>
                                                                        <MultiSelectGroup>
                                                                            {medicineWarehouseForm.availableRacks?.map((rack) => (
                                                                                <MultiSelectItem key={rack.id}
                                                                                                 value={rack.id}>
                                                                                    {rack.name} - {rack.code}
                                                                                </MultiSelectItem>
                                                                            ))}
                                                                        </MultiSelectGroup>
                                                                    </MultiSelectContent>
                                                                </MultiSelect>
                                                            )}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => medicineWarehouseForm.medicineWarehouseForm.setIsRackDialogOpen(true)}
                                                            title="Tambah rak baru"
                                                        >
                                                            <Plus className="w-4 h-4"/>
                                                        </Button>
                                                    </div>
                                                    {medicineWarehouseForm.formState.errors.racks && (
                                                        <p className="text-sm text-destructive">{medicineWarehouseForm.formState.errors.racks.message}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div
                                                    className="border border-dashed rounded-lg p-6 text-center space-y-3">
                                                    <Package className="w-12 h-12 mx-auto text-muted-foreground"/>
                                                    <div>
                                                        <p className="text-sm font-medium">Belum ada rak tersedia</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Tambahkan rak baru untuk melanjutkan
                                                        </p>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        onClick={() => medicineWarehouseForm.setIsRackDialogOpen(true)}
                                                        className="gap-2"
                                                    >
                                                        <Plus className="w-4 h-4"/>
                                                        Tambah Rak Baru
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-end gap-4">
                                <Link
                                    to="/pharmacy"
                                    search={{tab: 'medicine_warehouses'}}
                                >
                                    <Button type="button" variant="outline">
                                        Batal
                                    </Button>
                                </Link>
                                <Button type="submit" className="gap-2"
                                        disabled={medicineWarehouseForm.formState.isSubmitting}>
                                    <Save className="w-4 h-4"/>
                                    {medicineWarehouseForm.formState.isSubmitting ? "Menyimpan..." : "Simpan"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </SettingPage>

            <Dialog open={medicineWarehouseForm.isRackDialogOpen}
                    onOpenChange={medicineWarehouseForm.setIsRackDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5"/>
                            Tambah Rak Baru
                        </DialogTitle>
                        <DialogDescription>
                            Buat rak baru untuk gudang obat. Rak yang dibuat akan otomatis terpilih.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="rack_code">
                                Kode Rak <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="rack_code"
                                placeholder="Contoh: R001"
                                value={medicineWarehouseForm.newRackData.code}
                                onChange={(e) => medicineWarehouseForm.setNewRackData({
                                    ...medicineWarehouseForm.newRackData,
                                    code: e.target.value
                                })}
                                maxLength={16}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rack_name">
                                Nama Rak <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="rack_name"
                                placeholder="Contoh: Rak Lantai 1"
                                value={medicineWarehouseForm.newRackData.name}
                                onChange={(e) => medicineWarehouseForm.setNewRackData({
                                    ...medicineWarehouseForm.newRackData,
                                    name: e.target.value
                                })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                medicineWarehouseForm.setIsRackDialogOpen(false);
                                medicineWarehouseForm.setNewRackData({code: "", name: ""});
                            }}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            onClick={medicineWarehouseForm.handleCreateRack}
                            disabled={!medicineWarehouseForm.newRackData.code || !medicineWarehouseForm.newRackData.name}
                            className="gap-2"
                        >
                            <Save className="w-4 h-4"/>
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default MedicineWarehouseForm;