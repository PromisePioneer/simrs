import SettingPage from "@/pages/settings/index.jsx";
import {PermissionTabs} from "@/components/settings/medicine-management/tabs.jsx";
import {useMedicineBatchesStore} from "@/store/medicineBatchesStore.js";
import {useEffect} from "react";
import {Link, useNavigate, useParams} from "@tanstack/react-router";
import DataTable from "@/components/common/data-table.jsx";
import {
    Archive,
    ArrowLeft,
    Building2,
    Calendar as CalendarIcon,
    Pencil,
    Pill,
    Plus,
    Trash2,
    Warehouse,
    X
} from "lucide-react";
import {TableCell, TableRow} from "@/components/ui/table.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";
import Modal from "@/components/common/modal.jsx";
import {Controller, useForm} from "react-hook-form";
import {Label} from "@/components/ui/label.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {useMedicineWarehouseStore} from "@/store/medicineWarehouseStore.js";
import {useMedicineRackStore} from "@/store/medicineRackStore.js";
import {Input} from "@/components/ui/input.jsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {cn} from "@/lib/utils.js";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar.jsx";
import {Checkbox} from "@/components/ui/checkbox.jsx";
import {PERMISSIONS} from "@/constants/permissions.js";
import {updateUnitName} from "@/constants/medicines.js";

function MedicineStocks(opts) {

    const {id} = useParams(opts);
    const navigate = useNavigate();
    const {
        fetchMedicineBatches,
        isLoading,
        medicineBatches,
        setCurrentPage,
        currentPage,
        setSearch,
        search,
        columns,
        openModal,
        setOpenModal,
        medicineBatchValue,
        deleteMedicineBatch,
        createMedicineBatch,
        openDeleteModal,
        setOpenDeleteModal,
        updateMedicineBatch,
    } = useMedicineBatchesStore();

    const {medicineWarehouses, fetchMedicineWarehouses} = useMedicineWarehouseStore();
    const {fetchByMedicineWarehouse, racksByMedicineWarehouse} = useMedicineRackStore();

    useEffect(() => {
        fetchMedicineWarehouses();
        fetchMedicineBatches({perPage: 20, medicineId: id});
    }, [fetchMedicineWarehouses, id]);


    const {
        handleSubmit,
        formState: {isSubmitting, errors},
        register,
        control,
        watch,
        reset,
        setValue,
    } = useForm({
        defaultValues: {
            medicine_id: id,
            warehouse_id: "",
            rack_id: "",
            batch_number: "",
            is_auto_batch: false,
            expired_date: undefined,
            stock_amount: "",
        }
    })

    const warehouseId = watch("warehouse_id");
    const isAutoBatch = watch("is_auto_batch");


    const todayDate = new Date();
    const currentYear = todayDate.getFullYear();

    // Clear batch_number when is_auto_batch is checked
    useEffect(() => {
        if (isAutoBatch) {
            setValue("batch_number", "");
        }
    }, [isAutoBatch, setValue]);


    useEffect(() => {
        if (warehouseId) {
            fetchByMedicineWarehouse(warehouseId);
        }


        let expiredDate = undefined;
        if (medicineBatchValue?.expired_date) {
            const parsed = new Date(medicineBatchValue.expired_date);
            expiredDate = isNaN(parsed.getTime()) ? undefined : parsed;
        }

        if (medicineBatchValue) {
            reset({
                medicine_id: id,
                warehouse_id: medicineBatchValue?.stock?.warehouse_id || "",
                rack_id: medicineBatchValue?.stock?.rack_id || "",
                batch_number: medicineBatchValue?.batch_number || "",
                is_auto_batch: medicineBatchValue.is_auto_batch || false,
                expired_date: expiredDate,
                stock_amount: medicineBatchValue?.stock?.stock_amount || "",
            });
        }
    }, [warehouseId, fetchByMedicineWarehouse, medicineBatchValue])


    const tabs = [
        {
            key: 'medicine-management',
            label: 'Data obat',
            permission: PERMISSIONS.MEDICINE.VIEW,
        },
        {
            key: 'medicine_categories',
            label: 'Kategori obat',
            permission: PERMISSIONS.MEDICINE_CATEGORY.VIEW,
        },
        {
            key: 'medicine_warehouses',
            label: 'Gudang obat',
            permission: PERMISSIONS.MEDICINE_WAREHOUSE.VIEW,
        },
    ];


    const handleBack = () => {
        navigate({
            to: '/settings/medicine-management',
            search: {tab: 'medicine-management'}
        });
    }

    const onSubmit = async (data) => {

        const formData = new FormData();


        const specialFields = ['expired_date']


        Object.keys(data).forEach(key => {
            // Skip batch_number if is_auto_batch is true
            if (key === 'batch_number' && data.is_auto_batch) {
                return;
            }

            if (!specialFields.includes(key) && data[key]) {
                formData.append(key, data[key]);
            }
        });

        if (data.expired_date) {
            formData.append('expired_date', format(data.expired_date, "yyyy-MM-dd"));
        }
        formData.append('is_auto_batch', Boolean(data.is_auto_batch));
        if (medicineBatchValue) {
            await updateMedicineBatch(medicineBatchValue.id, formData);
        } else {
            await createMedicineBatch(formData);
        }
    }

    const renderRow = (medicineBatch, index) => (
        <TableRow key={medicineBatch.id} className="hover:bg-muted/50 transition-colors">
            <TableCell className="font-medium text-muted-foreground">
                {medicineBatches?.from ? medicineBatches.from + index : index + 1}
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{medicineBatch.batch_number}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{medicineBatch.stock.rack.name}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{medicineBatch.stock.warehouse.name}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span
                            className="font-semibold text-foreground">{format(medicineBatch.expired_date, 'd/M/Y')}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <span className="font-semibold text-foreground">{medicineBatch.stock.stock_amount}</span>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex gap-1 justify-end items-center">
                    <TooltipProvider>
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm"
                                            className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary"
                                            onClick={() => setOpenModal(medicineBatch.id)}
                                    >
                                        <Pencil className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Edit Batch</p></TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm"
                                            className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => setOpenDeleteModal(medicineBatch.id)}
                                    >
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Delete Batch</p></TooltipContent>
                            </Tooltip>
                        </>
                    </TooltipProvider>
                </div>
            </TableCell>
        </TableRow>
    );

    return (
        <SettingPage>
            <Button
                variant="ghost"
                onClick={handleBack}
                className="mb-4"
            >
                <ArrowLeft className="w-4 h-4 mr-2"/>
                Kembali ke Data Obat
            </Button>


            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500">
                            <Pill className="w-6 h-6 text-white"/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-teal-500">
                                Manajemen Stok Obat
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Kelola Stok obat dan restock obat secara online
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => setOpenModal()}
                    size="lg"
                >
                    <Plus className="w-4 h-4"/> Tambah Batch Stok
                </Button>

            </div>

            <DataTable
                title="Tabel Stok Obat Berdasarkan Batch"
                description="Data Obat Berdasarkan Batch yang tersedia di gudang. Klik batch untuk melihat stok obat yang tersedia di gudang."
                columns={columns()}
                data={medicineBatches?.data || []}
                isLoading={isLoading}
                pagination={medicineBatches ? {
                    from: medicineBatches.from, to: medicineBatches.to, total: medicineBatches.total,
                    current_page: medicineBatches.current_page, last_page: medicineBatches.last_page
                } : null}
                onPageChange={setCurrentPage}
                currentPage={currentPage}
                onSearch={setSearch}
                search={search}
                searchPlaceholder="Cari obat..."
                emptyStateIcon={Archive}
                emptyStateText="Tidak ada data obat ditemukan"
                renderRow={renderRow}
                showSearch={true}
            />


            <Modal
                size="lg"
                open={openModal}
                onOpenChange={setOpenModal}
                title={medicineBatchValue ? "Edit batch obat" : "Tambah batch obat"}
                description={medicineBatchValue ? "Ubah informasi batch obat" : "Tambahkan batch obat baru ke sistem."}
                onSubmit={handleSubmit(onSubmit)}
                submitText={medicineBatchValue ? "Simpan Perubahan" : "Tambah batch obat"}
                isLoading={isSubmitting}
            >
                <div className="space-y-5 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="warehouse_id">
                            Gudang <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                            name="warehouse_id"
                            control={control}
                            rules={{required: "Gudang tidak boleh kosong"}}
                            render={({field}) => (
                                <div className="relative">
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger
                                            className={field.value ? "w-full pr-9" : "w-full"}>
                                            <SelectValue placeholder="Pilih Gudang"/>
                                        </SelectTrigger>

                                        <SelectContent>
                                            {medicineWarehouses?.map((warehouse) => (
                                                <SelectItem
                                                    key={warehouse.id}
                                                    value={warehouse.id.toString()}
                                                >
                                                    <div
                                                        className="flex items-center gap-2">
                                                        <Building2 className="w-4 h-4"/>
                                                        {warehouse.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {field.value && (
                                        <button
                                            type="button"
                                            className="absolute right-3 top-2.5 text-muted-foreground hover:text-destructive"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                field.onChange("");
                                            }}
                                        >
                                            <X className="w-4 h-4"/>
                                        </button>
                                    )}
                                </div>
                            )}
                        />
                        {errors.warehouse_id && (
                            <p className="text-sm text-destructive">{errors.warehouse_id.message}</p>
                        )}
                    </div>

                    {/* Rack */}
                    <div className="space-y-2">
                        <Label htmlFor="rack_id">
                            Rak <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                            name="rack_id"
                            control={control}
                            rules={{required: "Rak tidak boleh kosong"}}
                            render={({field}) => (
                                <div className="relative">
                                    <Select
                                        disabled={!warehouseId}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger
                                            className={field.value ? "w-full pr-9" : "w-full"}>
                                            <SelectValue
                                                placeholder={!warehouseId ? "Pilih gudang terlebih dahulu" : "Pilih Rak"}/>
                                        </SelectTrigger>

                                        <SelectContent>
                                            {racksByMedicineWarehouse && racksByMedicineWarehouse.map((rack) => (
                                                <SelectItem
                                                    key={rack.id}
                                                    value={rack.id.toString()}
                                                >
                                                    <div
                                                        className="flex items-center gap-2">
                                                        <Warehouse className="w-4 h-4"/>
                                                        {rack.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {field.value && (
                                        <button
                                            type="button"
                                            className="absolute right-3 top-2.5 text-muted-foreground hover:text-destructive"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                field.onChange("");
                                            }}
                                        >
                                            <X className="w-4 h-4"/>
                                        </button>
                                    )}
                                </div>
                            )}
                        />
                        {errors.rack_id && (
                            <p className="text-sm text-destructive">{errors.rack_id.message}</p>
                        )}
                    </div>

                    {/* Auto Batch Checkbox - Moved before Batch Number */}
                    <div>
                        <Controller
                            name="is_auto_batch"
                            control={control}
                            render={({field}) => (
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    <Label htmlFor="is_auto_batch">
                                        Generate batch otomatis
                                    </Label>
                                </div>
                            )}
                        />
                    </div>

                    {/* Batch Number - Only show when is_auto_batch is false */}
                    {!isAutoBatch && (
                        <div>
                            <Label className="block text-sm font-medium mb-1.5">
                                Nomor Batch <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                {...register("batch_number", {required: !isAutoBatch ? "Nomor batch harus diisi" : false})}
                                placeholder="Masukkan nomor batch"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.batch_number && (
                                <p className="text-red-500 text-sm mt-1">{errors.batch_number.message}</p>
                            )}
                        </div>
                    )}


                    <div className="space-y-2">
                        <Label htmlFor="expired_date">
                            Tanggal Kadaluarsa
                        </Label>
                        <Controller
                            name="expired_date"
                            control={control}
                            rules={{
                                required: "tanggal kadaluarsa harus diisi"
                            }}
                            render={
                                ({field}) => (
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
                                                {field.value ? format(field.value, "PPP") : <span>Pilih tanggal</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                toYear={currentYear + 100}
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                captionLayout="dropdown"
                                                initialFocus

                                            />
                                        </PopoverContent>
                                    </Popover>
                                )

                            }
                        />
                        {errors.expired_date && (
                            <p className="text-sm text-destructive">{errors.expired_date.message}</p>
                        )}
                    </div>
                    {/* Stock Base Unit */}
                    <div>
                        <Label className="block text-sm font-medium mb-1.5">
                            Stok (Unit Dasar) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            name="stock_amount"
                            type="number"
                            {...register("stock_amount", {
                                required: "Stok harus diisi",
                                min: {value: 0, message: "Stok tidak boleh negatif"}
                            })}
                            placeholder="0"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.stock_amount && (
                            <p className="text-red-500 text-sm mt-1">{errors.stock_amount.message}</p>
                        )}
                    </div>
                </div>
            </Modal>


            <Modal
                open={openDeleteModal}
                onOpenChange={setOpenDeleteModal}
                title="Hapus batch"
                description="Tindakan ini tidak dapat dibatalkan. batch obat akan dihapus permanen."
                onSubmit={() => deleteMedicineBatch(medicineBatchValue.id)}
                submitText="Hapus batch"
                type="danger"
                isLoading={isLoading}
            >
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
                                <p className="text-sm text-muted-foreground">Anda akan menghapus Obat dengan Nomor Batch
                                    : <span
                                        className="font-semibold text-foreground">{medicineBatchValue?.batch_number}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </SettingPage>
    );
}


export default MedicineStocks;