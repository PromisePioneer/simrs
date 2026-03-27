import {useRoomTypeStore} from "@/store/roomTypeStore.js";
import {useForm} from "react-hook-form";
import {useEffect} from "react";
import {TableCell, TableRow} from "@/components/ui/table.jsx";
import {MirrorRectangular, Pencil, Plus, Trash2} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";
import {Button} from "@/components/ui/button.jsx";
import DataTable from "@/components/common/data-table.jsx";
import Modal from "@/components/common/modal.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {Badge} from "@/components/ui/badge.jsx";

const formatCurrency = (value) =>
    `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;

function RoomTypePage() {

    const {
        fetchRoomTypes,
        isLoading,
        roomTypes,
        search,
        setSearch,
        currentPage,
        setCurrentPage,
        openModal,
        setOpenModal,
        openDeleteModal,
        setOpenDeleteModal,
        roomTypeValue,
        setRoomTypeValue,
        columns,
        updateRoomType,
        createRoomType,
        deleteRoomType,
        deleteLoading,
    } = useRoomTypeStore();

    const {
        reset,
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {
            code: "",
            name: "",
            default_capacity: "",
            rate_per_night: "",
            description: "",
        },
    });

    useEffect(() => {
        fetchRoomTypes({perPage: 20});
    }, [fetchRoomTypes, search, currentPage]);

    // Populate form when editing
    useEffect(() => {
        if (roomTypeValue && !openDeleteModal) {
            reset({
                code: roomTypeValue.code || "",
                name: roomTypeValue.name || "",
                default_capacity: roomTypeValue.default_capacity || "",
                rate_per_night: roomTypeValue.rate_per_night || "",
                description: roomTypeValue.description || "",
            });
        } else if (!openDeleteModal) {
            reset({code: "", name: "", default_capacity: "", rate_per_night: "", description: ""});
        }
    }, [roomTypeValue, openDeleteModal, reset]);

    // Reset form when modal closes
    useEffect(() => {
        if (!openModal) {
            reset({code: "", name: "", default_capacity: "", rate_per_night: "", description: ""});
            if (setRoomTypeValue) setRoomTypeValue(null);
        }
    }, [openModal, setRoomTypeValue, reset]);

    const onSubmit = async (data) => {
        // Kirim rate_per_night sebagai integer
        const payload = {
            ...data,
            rate_per_night: parseInt(data.rate_per_night, 10) || 0,
            default_capacity: parseInt(data.default_capacity, 10) || 0,
        };
        if (roomTypeValue) {
            await updateRoomType(roomTypeValue.id, payload);
        } else {
            await createRoomType(payload);
        }
    };

    const renderRow = (roomType, index) => (
        <TableRow key={roomType.id} className="hover:bg-muted/50 transition-colors">
            <TableCell className="font-medium text-muted-foreground">
                {roomTypes.meta?.from + index}
            </TableCell>
            <TableCell>
                <span className="font-semibold text-foreground">{roomType.code}</span>
            </TableCell>
            <TableCell>
                <span className="font-semibold text-foreground">{roomType.name}</span>
            </TableCell>
            <TableCell>
                <span className="text-foreground">{roomType.default_capacity}</span>
            </TableCell>
            <TableCell>
                {roomType.rate_per_night > 0 ? (
                    <Badge variant="outline" className="text-teal-700 border-teal-300 bg-teal-50 dark:bg-teal-950/30 font-semibold">
                        {formatCurrency(roomType.rate_per_night)}
                    </Badge>
                ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                )}
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                    <TooltipProvider>
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary"
                                        onClick={() => setOpenModal(roomType.id)}
                                    >
                                        <Pencil className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Edit Tipe Ruangan</p></TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
                                        onClick={() => setOpenDeleteModal(roomType.id)}
                                    >
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Hapus Tipe Ruangan</p></TooltipContent>
                            </Tooltip>
                        </>
                    </TooltipProvider>
                </div>
            </TableCell>
        </TableRow>
    );

    return (
        <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5">
                            <MirrorRectangular className="w-6 h-6 text-primary"/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-teal-500">
                                Data Tipe Ruangan
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Kelola Manajemen Tipe Ruangan & Tarif Rawat Inap
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => setOpenModal()}
                    size="lg"
                >
                    <Plus className="w-4 h-4"/> Tambah Tipe Ruangan
                </Button>
            </div>

            {/* Table */}
            <DataTable
                title="Tabel Tipe Ruangan"
                description="Daftar Tipe Ruangan beserta tarif per malam"
                columns={columns()}
                data={roomTypes?.data || []}
                isLoading={isLoading}
                pagination={roomTypes ? {
                    from: roomTypes.meta?.from,
                    to: roomTypes.meta?.to,
                    total: roomTypes.meta?.total,
                    current_page: roomTypes.meta?.current_page,
                    last_page: roomTypes.meta?.last_page,
                } : null}
                onPageChange={setCurrentPage}
                currentPage={currentPage}
                onSearch={setSearch}
                search={search}
                searchPlaceholder="Cari Tipe Ruangan..."
                emptyStateIcon={MirrorRectangular}
                emptyStateText="Tidak ada data Tipe Ruangan ditemukan"
                renderRow={renderRow}
                showSearch={true}
            />

            {/* Create / Edit Modal */}
            <Modal
                open={openModal}
                onOpenChange={setOpenModal}
                title={roomTypeValue ? "Edit Tipe Ruangan" : "Tambah Tipe Ruangan"}
                description={roomTypeValue ? "Ubah informasi Tipe Ruangan" : "Tambahkan Tipe Ruangan baru ke sistem."}
                onSubmit={handleSubmit(onSubmit)}
                submitText={roomTypeValue ? "Simpan Perubahan" : "Tambah Tipe Ruangan"}
                isLoading={isSubmitting}
            >
                <div className="space-y-5 py-2">
                    {/* Kode */}
                    <div className="space-y-2.5">
                        <Label htmlFor="code" className="text-sm font-semibold">
                            Kode <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="code"
                            placeholder="Contoh: VIP, KLS1, KLS2"
                            {...register("code", {required: "Kode tidak boleh kosong"})}
                            disabled={isLoading}
                        />
                        {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
                    </div>

                    {/* Nama */}
                    <div className="space-y-2.5">
                        <Label htmlFor="name" className="text-sm font-semibold">
                            Nama <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Contoh: VIP, Kelas 1, Kelas 2, ICU"
                            {...register("name", {required: "Nama tidak boleh kosong"})}
                            disabled={isLoading}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>

                    {/* Kapasitas + Tarif — 2 kolom */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2.5">
                            <Label htmlFor="default_capacity" className="text-sm font-semibold">
                                Kapasitas <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="default_capacity"
                                type="number"
                                min="1"
                                placeholder="Contoh: 4"
                                {...register("default_capacity", {
                                    required: "Kapasitas tidak boleh kosong",
                                    min: {value: 1, message: "Minimal 1"},
                                })}
                                disabled={isLoading}
                            />
                            {errors.default_capacity &&
                                <p className="text-sm text-destructive">{errors.default_capacity.message}</p>}
                        </div>

                        <div className="space-y-2.5">
                            <Label htmlFor="rate_per_night" className="text-sm font-semibold">
                                Tarif / Malam (Rp) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="rate_per_night"
                                type="number"
                                min="0"
                                placeholder="Contoh: 500000"
                                {...register("rate_per_night", {
                                    required: "Tarif tidak boleh kosong",
                                    min: {value: 0, message: "Tarif tidak boleh negatif"},
                                })}
                                disabled={isLoading}
                            />
                            {errors.rate_per_night &&
                                <p className="text-sm text-destructive">{errors.rate_per_night.message}</p>}
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div className="space-y-2.5">
                        <Label htmlFor="description" className="text-sm font-semibold">
                            Deskripsi <span className="text-muted-foreground font-normal">(opsional)</span>
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Contoh: Kamar VIP dengan fasilitas AC, TV, dan kamar mandi dalam"
                            {...register("description")}
                            disabled={isLoading}
                        />
                        {errors.description &&
                            <p className="text-sm text-destructive">{errors.description.message}</p>}
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal
                open={openDeleteModal}
                onOpenChange={setOpenDeleteModal}
                title="Hapus Tipe Ruangan"
                description="Tindakan ini tidak dapat dibatalkan. Tipe Ruangan akan dihapus permanen."
                onSubmit={() => deleteRoomType(roomTypeValue.id)}
                submitText="Hapus Tipe Ruangan"
                type="danger"
                isLoading={deleteLoading}
            >
                <div className="space-y-4 py-2">
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                        <div className="flex gap-3">
                            <div className="shrink-0">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/20">
                                    <Trash2 className="w-5 h-5 text-destructive"/>
                                </div>
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-semibold text-foreground">Konfirmasi Penghapusan</p>
                                <p className="text-sm text-muted-foreground">
                                    Anda akan menghapus Tipe Ruangan:{" "}
                                    <span className="font-semibold text-foreground">{roomTypeValue?.name}</span>
                                </p>
                                {roomTypeValue?.rate_per_night > 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        Tarif:{" "}
                                        <span className="font-semibold text-foreground">
                                            {formatCurrency(roomTypeValue.rate_per_night)}/malam
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default RoomTypePage;
