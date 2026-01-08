import {Controller, useForm} from "react-hook-form";
import {useEffect} from "react";
import {TableCell, TableRow} from "@/components/ui/table.jsx";
import {Award, Pencil, Plus, Trash2, Pill} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";
import {Button} from "@/components/ui/button.jsx";
import DataTable from "@/components/common/data-table.jsx";
import Modal from "@/components/common/modal.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.jsx";
import {useMedicineCategoriesStore} from "@/store/medicine/medicineCategoriesStore.js";

function MedicineCategoriesPage() {
    const {
        isLoading,
        search,
        setSearch,
        medicineCategoryValue,
        medicineCategories,
        columns,
        currentPage,
        openModal,
        openDeleteModal,
        setCurrentPage,
        setOpenModal,
        setOpenDeleteModal,
        createMedicineCategory,
        updateMedicineCategory,
        fetchMedicineCategories,
        deleteMedicineCategory,
        setMedicineCategoryValue
    } = useMedicineCategoriesStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
        control
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {
            name: "",
            type: ""
        }
    });


    useEffect(() => {
        fetchMedicineCategories({perPage: 20});
    }, [fetchMedicineCategories, search, currentPage]);
    //
    useEffect(() => {
        if (medicineCategoryValue && !openDeleteModal) {
            reset({
                name: medicineCategoryValue.name || "",
                type: medicineCategoryValue.type || ""
            })
        } else {
            reset({name: "", type: ""});
        }
    }, [medicineCategoryValue, openDeleteModal]);

    useEffect(() => {
        if (!openModal) {
            reset({name: "", type: ""});
            if (setMedicineCategoryValue) setMedicineCategoryValue(null);
        }
    }, [openModal, setMedicineCategoryValue]);

    const onSubmit = async (data) => {
        if (medicineCategoryValue) {
            await updateMedicineCategory(medicineCategoryValue.id, data);
        } else {
            await createMedicineCategory(data);
        }
    };


    const renderRow = (medicineCategory, index) => (
            <TableRow key={medicineCategory.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium text-muted-foreground">
                    {medicineCategories.from + index}
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                            <Pill className="w-5 h-5 text-primary"/>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-foreground">{medicineCategory.name}</span>
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <span className="font-semibold text-foreground">{medicineCategory.type}</span>
                        </div>
                    </div>
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                        <TooltipProvider>
                            <>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="sm"
                                                className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary"
                                                onClick={() => setOpenModal(medicineCategory.id)}
                                        >
                                            <Pencil className="h-4 w-4"/>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Edit Kategori Obat</p></TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="sm"
                                                className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() => setOpenDeleteModal(medicineCategory.id)}
                                        >
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Delete Obat</p></TooltipContent>
                                </Tooltip>
                            </>
                        </TooltipProvider>
                    </div>
                </TableCell>
            </TableRow>
        )
    ;


    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5">
                            <Award className="w-6 h-6 text-primary"/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-teal-500">
                                Data Kategori Obat
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Kelola kategori obat
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => setOpenModal()}
                    size="lg"
                >
                    <Plus className="w-4 h-4"/> Tambah kategori obat
                </Button>
            </div>

            <DataTable
                title="Tabel kategori obat"
                description="Daftar gelar yang tersedia"
                columns={columns()}
                data={medicineCategories?.data || []}
                isLoading={isLoading}
                pagination={medicineCategories ? {
                    from: medicineCategories.from, to: medicineCategories.to, total: medicineCategories.total,
                    current_page: medicineCategories.current_page, last_page: medicineCategories.last_page
                } : null}
                onPageChange={setCurrentPage}
                currentPage={currentPage}
                onSearch={setSearch}
                search={search}
                searchPlaceholder="Cari gelar..."
                emptyStateIcon={Award}
                emptyStateText="Tidak ada data gelar ditemukan"
                renderRow={renderRow}
                showSearch={true}
            />
            <Modal
                open={openModal}
                onOpenChange={setOpenModal}
                title={medicineCategoryValue ? "Edit kategori obat" : "Tambah kategori obat"}
                description={medicineCategoryValue ? "Ubah informasi gelar" : "Tambahkan gelar baru ke sistem."}
                onSubmit={handleSubmit(onSubmit)}
                submitText={medicineCategoryValue ? "Simpan Perubahan" : "Tambah kategori obat"}
                isLoading={isSubmitting}
            >
                <div className="space-y-5 py-2">
                    <div className="space-y-2.5">
                        <Label htmlFor="degree-name" className="text-sm font-semibold">Nama <span
                            className="text-destructive">*</span></Label>
                        <Input id="degree-name" placeholder="kategori obat"

                               {...register("name", {required: "Nama kategori obat tidak boleh kosong"})}
                               disabled={isLoading}/>
                        {errors.name &&
                            <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="degree-type">Tipe
                            <span className="text-destructive">*</span></Label>
                        <Controller name="type" control={control}
                                    disabled={isLoading}
                                    rules={{required: "Tipe kategori obat harus dipilih"}}
                                    render={({field}) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Pilih Tipe kategori obat"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>

                                                    {/*'general', 'medicine', 'medical_devices', 'service'*/}

                                                    <SelectLabel>Tipe kategori obat</SelectLabel>
                                                    <SelectItem value="general">Umum</SelectItem>
                                                    <SelectItem value="medicine">Obat</SelectItem>
                                                    <SelectItem value="medical_devices">Barang Medis</SelectItem>
                                                    <SelectItem value="service">Layanan</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}/>
                        {errors.type &&
                            <p className="text-sm text-destructive">{errors.type.message}</p>}
                    </div>
                </div>
            </Modal>

            {/* Modal Degree: Delete */}
            <Modal
                open={openDeleteModal}
                onOpenChange={setOpenDeleteModal}
                title="Hapus kategori obat"
                description="Tindakan ini tidak dapat dibatalkan. kategori obat akan dihapus permanen."
                onSubmit={() => deleteMedicineCategory(medicineCategoryValue.id)}
                submitText="Hapus kategori obat"
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
                                <p className="text-sm text-muted-foreground">Anda akan menghapus gelar: <span
                                    className="font-semibold text-foreground">{medicineCategoryValue?.name}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}


export default MedicineCategoriesPage;