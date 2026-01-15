import {Controller, useForm} from "react-hook-form";
import {useMedicineWarehouseStore} from "@/store/medicine/medicineWarehouseStore.js";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {
    ArrowLeft, Building2, Save, Plus, Package
} from "lucide-react"
import {Link, useParams} from "@tanstack/react-router";
import ContentHeader from "@/components/ui/content-header.jsx";
import {Button} from "@/components/ui/button.jsx";
import SettingPage from "@/pages/settings/index.jsx";
import {useMedicineRackStore} from "@/store/medicine/medicineRackStore.js";
import {
    MultiSelect,
    MultiSelectContent,
    MultiSelectGroup, MultiSelectItem,
    MultiSelectTrigger,
    MultiSelectValue
} from "@/components/ui/multi-select.jsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.jsx";
import {useEffect, useState} from "react";

function MedicineWarehouseForm(opts) {
    const {id} = useParams(opts);
    const isEditMode = !!id;
    const {
        createMedicineWarehouse,
        updateMedicineWarehouse,
    } = useMedicineWarehouseStore();

    const {
        fetchUnassignedRacks,
        createMedicineRack,
        isLoading,
        unassignedRacks
    } = useMedicineRackStore();

    const [isRackDialogOpen, setIsRackDialogOpen] = useState(false);
    const [newRackData, setNewRackData] = useState({
        code: "",
        name: ""
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
        control,
        setValue,
        watch
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {
            code: "",
            name: "",
            tenant_id: "",
            rack: []
        }
    });

    // Fetch racks on component mount
    useEffect(() => {
        fetchUnassignedRacks();
    }, []);

    const onSubmit = async (data) => {
        if (isEditMode) {
            await updateMedicineWarehouse(id, data);
        } else {
            await createMedicineWarehouse(data);
        }
    };

    const handleCreateRack = async () => {
        try {
            if (!createMedicineRack) {
                console.error("createMedicineRack function not available");
                return;
            }

            const createdRack = await createMedicineRack(newRackData);
            // Add the newly created rack to selected values
            if (createdRack?.id) {
                const currentRackIds = watch("racks") || [];
                setValue("racks", [...currentRackIds, createdRack.id]);
            }
            setIsRackDialogOpen(false);
            setNewRackData({code: "", name: ""});
            // Refresh racks list
            if (fetchUnassignedRacks) {
                await fetchUnassignedRacks();
            }
        } catch (error) {
            console.error("Failed to create rack:", error);
        }
    };

    const hasRacks = unassignedRacks && unassignedRacks.length > 0;
    return (
        <>
            <SettingPage>
                <div className="space-y-6">
                    <ContentHeader
                        title={isEditMode ? "Edit Gudang" : "Tambah Gudang Baru"}
                        description={isEditMode ? "Perbarui informasi gudang" : "Tambahkan gudang baru ke sistem"}
                    />

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <Link to="/settings/warehouses">
                                    <Button type="button" variant="outline" size="sm" className="gap-2">
                                        <ArrowLeft className="w-4 h-4"/>
                                        Kembali ke Daftar
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
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {/* Kode */}
                                        <div className="space-y-2">
                                            <Label htmlFor="code">
                                                Kode <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="code"
                                                placeholder="Kode"
                                                maxLength={16}
                                                {...register("code", {
                                                    required: "Kode wajib diisi",
                                                })}
                                            />
                                            {errors.code && (
                                                <p className="text-sm text-destructive">{errors.code.message}</p>
                                            )}
                                        </div>
                                        {/* Nama */}
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                Nama Gudang <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="Masukkan nama gudang"
                                                {...register("name", {required: "Nama gudang wajib diisi"})}
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-destructive">{errors.name.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Rack Multi Selection */}
                                    <div className="space-y-2">
                                        <Label htmlFor="racks">
                                            Rak yg tersedia <span className="text-destructive">*</span>
                                        </Label>

                                        {isLoading ? (
                                            <div className="text-sm text-muted-foreground">Memuat data rak...</div>
                                        ) : hasRacks ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Controller
                                                    name="racks"
                                                        control={control}
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
                                                                        {unassignedRacks?.map((rack) => (
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
                                                        onClick={() => setIsRackDialogOpen(true)}
                                                        title="Tambah rak baru"
                                                    >
                                                        <Plus className="w-4 h-4"/>
                                                    </Button>
                                                </div>
                                                {errors.racks && (
                                                    <p className="text-sm text-destructive">{errors.racks.message}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="border border-dashed rounded-lg p-6 text-center space-y-3">
                                                <Package className="w-12 h-12 mx-auto text-muted-foreground"/>
                                                <div>
                                                    <p className="text-sm font-medium">Belum ada rak tersedia</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Tambahkan rak baru untuk melanjutkan
                                                    </p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    onClick={() => setIsRackDialogOpen(true)}
                                                    className="gap-2"
                                                >
                                                    <Plus className="w-4 h-4"/>
                                                    Tambah Rak Baru
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-end gap-4">
                                <Link to="/settings/warehouses">
                                    <Button type="button" variant="outline">
                                        Batal
                                    </Button>
                                </Link>
                                <Button type="submit" className="gap-2" disabled={isSubmitting}>
                                    <Save className="w-4 h-4"/>
                                    {isSubmitting ? "Menyimpan..." : "Simpan"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </SettingPage>

            {/* Dialog untuk Tambah Rack */}
            <Dialog open={isRackDialogOpen} onOpenChange={setIsRackDialogOpen}>
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
                                value={newRackData.code}
                                onChange={(e) => setNewRackData({...newRackData, code: e.target.value})}
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
                                value={newRackData.name}
                                onChange={(e) => setNewRackData({...newRackData, name: e.target.value})}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsRackDialogOpen(false);
                                setNewRackData({code: "", name: ""});
                            }}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            onClick={handleCreateRack}
                            disabled={!newRackData.code || !newRackData.name}
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