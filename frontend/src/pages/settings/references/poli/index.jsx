import {useForm} from "react-hook-form";
import {useEffect} from "react";
import {TableCell, TableRow} from "@/components/ui/table.jsx";
import {Award, Pencil, Plus, Trash2} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";
import {Button} from "@/components/ui/button.jsx";
import DataTable from "@/components/common/data-table.jsx";
import Modal from "@/components/common/modal.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {usePoliStore} from "@/store/poliStore.js";

function PoliPage() {
    const {
        fetchPoli,
        isLoading,
        poliData,
        search,
        setSearch,
        currentPage,
        setCurrentPage,
        openModal,
        setOpenModal,
        openDeleteModal,
        setOpenDeleteModal,
        poliValue,
        setPoliValue,
        columns,
        updatePoli,
        createPoli,
        deletePoli,
        deleteLoading,
    } = usePoliStore();

    const poliForm = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {
            name: "",
            type: ""
        }
    });


    useEffect(() => {
        fetchPoli({perPage: 20});
    }, [fetchPoli, search, currentPage]);

    useEffect(() => {
        if (poliValue && !openDeleteModal) {
            poliForm.reset({
                name: poliValue.name || "",
            })
        } else {
            poliForm.reset({name: ""});
        }
    }, [poliValue, poliForm, openDeleteModal]);

    useEffect(() => {
        if (!openModal) {
            poliForm.reset({name: ""});
            if (setPoliValue) setPoliValue(null);
        }
    }, [openModal, poliForm, setPoliValue]);

    const onSubmit = async (data) => {
        if (poliValue) {
            await updatePoli(poliValue.id, data);
        } else {
            await createPoli(data);
        }
    };


    const renderRow = (poli, index) => (
        <TableRow key={poli.id} className="hover:bg-muted/50 transition-colors">
            <TableCell className="font-medium text-muted-foreground">
                {poliData.from + index}
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        <Award className="w-5 h-5 text-primary"/>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{poli.name}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{poli.type}</span>
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
                                            onClick={() => setOpenModal(poli.id)}>
                                        <Pencil className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Edit Poli</p></TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm"
                                            className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => setOpenDeleteModal(poli.id)}>
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Delete Poli</p></TooltipContent>
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
                            <Award className="w-6 h-6 text-primary"/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-teal-500">
                                Data Poli
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Kelola Manajemen Poli
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => setOpenModal()}
                    size="lg"
                >
                    <Plus className="w-4 h-4"/> Tambah Poli
                </Button>
            </div>

            <DataTable
                title="Tabel Poli"
                description="Daftar Poli yang tersedia"
                columns={columns()}
                data={poliData?.data || []}
                isLoading={isLoading}
                pagination={poliData ? {
                    from: poliData.from, to: poliData.to, total: poliData.total,
                    current_page: poliData.current_page, last_page: poliData.last_page
                } : null}
                onPageChange={setCurrentPage}
                currentPage={currentPage}
                onSearch={setSearch}
                search={search}
                searchPlaceholder="Cari Poli..."
                emptyStateIcon={Award}
                emptyStateText="Tidak ada data Poli ditemukan"
                renderRow={renderRow}
                showSearch={true}
            />
            <Modal
                open={openModal}
                onOpenChange={setOpenModal}
                title={poliValue ? "Edit Poli" : "Tambah Poli"}
                description={poliValue ? "Ubah informasi Poli" : "Tambahkan Poli baru ke sistem."}
                onSubmit={poliForm.handleSubmit(onSubmit)}
                submitText={poliValue ? "Simpan Perubahan" : "Tambah Poli"}
                isLoading={poliForm.formState.isSubmitting}
            >
                <div className="space-y-5 py-2">
                    <div className="space-y-2.5">
                        <Label htmlFor="name" className="text-sm font-semibold">Nama <span
                            className="text-destructive">*</span></Label>
                        <Input id="name" placeholder="Contoh: Umum, Gigi, Jantung, Kandungan"
                               {...poliForm.register("name", {required: "Nama Poli tidak boleh kosong"})}
                               disabled={isLoading}/>
                        {poliForm.formState.errors.name &&
                            <p className="text-sm text-destructive">{poliForm.formState.errors.name.message}</p>}
                    </div>
                </div>
            </Modal>

            {/* Modal: Delete */}
            <Modal
                open={openDeleteModal}
                onOpenChange={setOpenDeleteModal}
                title="Hapus Poli"
                description="Tindakan ini tidak dapat dibatalkan. Poli akan dihapus permanen."
                onSubmit={() => deletePoli(poliValue.id)}
                submitText="Hapus Poli"
                type="danger"
                isLoading={deleteLoading}
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
                                <p className="text-sm text-muted-foreground">Anda akan menghapus Poli: <span
                                    className="font-semibold text-foreground">{poliValue?.name}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}


export default PoliPage;