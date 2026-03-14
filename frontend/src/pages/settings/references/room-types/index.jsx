import {useRoomTypeStore} from "@/store/roomTypeStore.js";
import {useForm} from "react-hook-form";
import {useEffect} from "react";
import {TableCell, TableRow} from "@/components/ui/table.jsx";
import {Award, MirrorRectangular, Pencil, Plus, Trash2} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";
import {Button} from "@/components/ui/button.jsx";
import DataTable from "@/components/common/data-table.jsx";
import Modal from "@/components/common/modal.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";

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
        formState: {errors, isSubmitting}
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {
            code: "",
            name: "",
            default_capacity: "",
            description: ""
        }
    });


    useEffect(() => {
        fetchRoomTypes({perPage: 20});
    }, [fetchRoomTypes, search, currentPage]);

    useEffect(() => {
        if (roomTypeValue && !openDeleteModal) {
            reset({
                name: roomTypeValue.name || "",
            })
        } else {
            reset({name: ""});
        }
    }, [roomTypeValue, openDeleteModal]);

    useEffect(() => {
        if (!openModal) {
            reset({name: ""});
            if (setRoomTypeValue) setRoomTypeValue(null);
        }
    }, [openModal, setRoomTypeValue]);

    const onSubmit = async (data) => {
        if (roomTypeValue) {
            await updateRoomType(roomTypeValue.id, data);
        } else {
            await createRoomType(data);
        }
    };


    const renderRow = (roomType, index) => (
        <TableRow key={roomType.id} className="hover:bg-muted/50 transition-colors">
            <TableCell className="font-medium text-muted-foreground">
                {roomTypes.from + index}
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <span className="font-semibold text-foreground">{roomType.code}</span>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{roomType.name}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{roomType.default_capacity}</span>
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
                                            onClick={() => setOpenModal(roomType.id)}>
                                        <Pencil className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Edit Tipe Ruangan</p></TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm"
                                            className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => setOpenDeleteModal(roomType.id)}>
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Delete Tipe Ruangan</p></TooltipContent>
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
                            className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5">
                            <MirrorRectangular className="w-6 h-6 text-primary"/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-teal-500">
                                Data Tipe Ruangan
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Kelola Manajemen Tipe Ruangan
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


            <DataTable
                title="Tabel Tipe Ruangan"
                description="Daftar Tipe Ruangan yang tersedia"
                columns={columns()}
                data={roomTypes?.data || []}
                isLoading={isLoading}
                pagination={roomTypes ? {
                    from: roomTypes.from, to: roomTypes.to, total: roomTypes.total,
                    current_page: roomTypes.current_page, last_page: roomTypes.last_page
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
                    <div className="space-y-2.5">
                        <Label htmlFor="code" className="text-sm font-semibold">Kode <span
                            className="text-destructive">*</span></Label>
                        <Input id="code" placeholder="Contoh: 001, 002, 003"
                               {...register("code", {required: "Kode tidak boleh kosong"})}
                               disabled={isLoading}/>
                        {errors.code &&
                            <p className="text-sm text-destructive">{errors.code.message}</p>}
                    </div>
                    <div className="space-y-2.5">
                        <Label htmlFor="name" className="text-sm font-semibold">Nama <span
                            className="text-destructive">*</span></Label>
                        <Input id="name" placeholder="Contoh: Umum, Gigi, Jantung, Kandungan"
                               {...register("name", {required: "Nama tidak boleh kosong"})}
                               disabled={isLoading}/>
                        {errors.name &&
                            <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2.5">
                        <Label htmlFor="default_capacity" className="text-sm font-semibold">Kapasitas Bawaan <span
                            className="text-destructive">*</span></Label>
                        <Input id="default_capacity" type="number" placeholder="Contoh: 10, 20, 30"
                               {...register("default_capacity", {required: "Kapasitas tidak boleh kosong"})}
                               disabled={isLoading}/>
                        {errors.default_capacity &&
                            <p className="text-sm text-destructive">{errors.default_capacity.message}</p>}
                    </div>
                    <div className="space-y-2.5">
                        <Label htmlFor="description" className="text-sm font-semibold">Deskripsi (Optional)</Label>
                        <Textarea id="description" type="number" placeholder="Contoh: "
                                  {...register("description")}
                                  disabled={isLoading}/>
                        {errors.description &&
                            <p className="text-sm text-destructive">{errors.description.message}</p>}
                    </div>
                </div>
            </Modal>


        </>
    )

}


export default RoomTypePage;