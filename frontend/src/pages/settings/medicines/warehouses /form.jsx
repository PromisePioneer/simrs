import {Controller, useForm} from "react-hook-form";
import {useMedicineWarehouseStore} from "@/store/medicine/medicineWarehouseStore.js";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {
    ArrowLeft, Building2, CalendarIcon,
    Lock, Mail, MapPin, Phone, Save, Upload, User, X, Plus, Package
} from "lucide-react"
import {Link, useParams} from "@tanstack/react-router";
import ContentHeader from "@/components/ui/content-header.jsx";
import {Button} from "@/components/ui/button.jsx";
import SettingPage from "@/pages/settings/index.jsx";
import {useMedicineRackStore} from "@/store/medicine/medicineRackStore.js";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.jsx";
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
        medicineRacks,
        isLoading
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
        setValue
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {
            code: "",
            name: "",
            tenant_id: "",
            rack_id: ""
        }
    });

    // Fetch racks on component mount
    useEffect(() => {
        if (fetchUnassignedRacks) {
            fetchUnassignedRacks();
        }
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
            // Set the newly created rack as selected
            if (createdRack?.id) {
                setValue("rack_id", createdRack.id);
            }
            // Close dialog and reset
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

    const hasRacks = medicineRacks && medicineRacks.length > 0;

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

                                    {/* Rack Selection */}
                                    <div className="space-y-2">
                                        <Label htmlFor="rack_id">
                                            Rak <span className="text-destructive">*</span>
                                        </Label>

                                        {isLoading ? (
                                            <div className="text-sm text-muted-foreground">Memuat data rak...</div>
                                        ) : hasRacks ? (
                                            <div className="flex gap-2">
                                                <Controller
                                                    name="rack_id"
                                                    control={control}
                                                    rules={{required: "Rak wajib dipilih"}}
                                                    render={({field}) => (
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                        >
                                                            <SelectTrigger className="flex-1">
                                                                <SelectValue placeholder="Pilih rak"/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {medicineRacks.map((rack) => (
                                                                    <SelectItem key={rack.id} value={rack.id}>
                                                                        {rack.code} - {rack.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
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

                                        {errors.rack_id && (
                                            <p className="text-sm text-destructive">{errors.rack_id.message}</p>
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