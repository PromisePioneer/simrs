import {useEffect} from "react";
import {TableCell, TableRow} from "@/components/ui/table.jsx";
import {Award, Pencil, Pill, Plus, Trash2, Archive, Warehouse} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";
import {Button} from "@/components/ui/button.jsx";
import DataTable from "@/components/common/data-table.jsx";
import Modal from "@/components/common/modal.jsx";
import {Link} from "@tanstack/react-router";
import {useMedicineStore} from "@/store/medicineStore.js";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Controller, useForm} from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.jsx";


function MedicinePage() {

    const {
        isLoading,
        search,
        setSearch,
        medicines,
        currentPage,
        setCurrentPage,
        columns,
        fetchMedicines,
        openDeleteModal,
        setOpenDeleteModal,
        medicineValue,
        deleteMedicine,
        openAddStockModal,
        setOpenAddStockModalModal,
    } = useMedicineStore();


    useEffect(() => {
        fetchMedicines({perPage: 20});
    }, [currentPage, search])


    const {
        handleSubmit,
        formState: {isSubmitting, errors},
        register,
        control
    }
        = useForm({
        defaultValues: {
            warehouse_id: "",
            rack_id: "",
        }
    })

    const onSubmitAddStock = (data) => {
        console.log(data);
    }

    const renderRow = (medicine, index) => (
        <TableRow key={medicine.id} className="hover:bg-muted/50 transition-colors">
            <TableCell className="font-medium text-muted-foreground">
                {medicines.from + index}
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{medicine.sku}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{medicine.name}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{medicine.type.toUpperCase()}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <Button asChild className="hover:cursor-pointer">
                    <Link to={`/settings/medicine-management/medicine/stocks/${medicine.id}`}>
                        <Warehouse/>
                    </Link>
                </Button>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex gap-1 justify-end items-center">
                    <TooltipProvider>
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link to={`/settings/medicine-management/medicine/${medicine.id}`}>
                                        <Button variant="ghost" size="sm"
                                                className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary"
                                        >
                                            <Pencil className="h-4 w-4"/>
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent><p>Edit Obat</p></TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm"
                                            className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => setOpenDeleteModal(medicine.id)}
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
    );


    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500">
                            <Pill className="w-6 h-6 text-white"/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-teal-500">
                                Daftar Obat
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Kelola Obat, Atur Tanggal kadaluarsa dan lainnya.
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                    size="lg"
                    asChild
                >
                    <Link to="/settings/medicine-management/medicine/create">
                        <Plus className="w-4 h-4"/> Tambah Obat
                    </Link>
                </Button>
            </div>

            <DataTable
                title="Daftar Obat"
                description="Daftar Obat yang dijual"
                columns={columns()}
                data={medicines?.data || []}
                isLoading={isLoading}
                pagination={medicines ? {
                    from: medicines.from, to: medicines.to, total: medicines.total,
                    current_page: medicines.current_page, last_page: medicines.last_page
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
                open={openAddStockModal}
                onOpenChange={setOpenAddStockModalModal}
                title="Restock Obat / Tambah Stok Obat"
                description="Tambahkan stock obat"
                onSubmit={handleSubmit(onSubmitAddStock)}
                submitText="Simpan Perubahan"
                isLoading={isSubmitting}
            >
                <div className="space-y-5 py-2">
                    <div className="space-y-2.5">
                        <Label htmlFor="medicine-category-name" className="text-sm font-semibold">Nama <span
                            className="text-destructive">*</span></Label>
                        <Input id="medicine-category-name" placeholder="kategori obat"

                               {...register("name", {required: "Nama kategori obat tidak boleh kosong"})}
                               disabled={isLoading}/>
                        {errors.name &&
                            <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="medicine-category-type">Tipe
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
                title="Hapus Obat"
                description="Tindakan ini tidak dapat dibatalkan. obat akan dihapus permanen."
                onSubmit={() => deleteMedicine(medicineValue.id)}
                submitText="Hapus obat"
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
                                <p className="text-sm text-muted-foreground">Anda akan menghapus obat: <span
                                    className="font-semibold text-foreground">{medicineValue?.name}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default MedicinePage;