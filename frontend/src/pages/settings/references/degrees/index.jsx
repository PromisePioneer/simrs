import {usePaymentMethodStore} from "@/store/usePaymentMethodStore.js";
import {Controller, useForm} from "react-hook-form";
import {useEffect} from "react";
import {useDegreeStore} from "@/store/useDegreeStore.js";
import {TableCell, TableRow} from "@/components/ui/table.jsx";
import {Award, Pencil, Plus, Trash2} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";
import {Button} from "@/components/ui/button.jsx";
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
import DataTable from "@/components/common/data-table.jsx";
import {useAuthStore} from "@/store/authStore.js";
import {usePermission} from "@/hooks/usePermission.js";

function DegreePage() {
    const {
        fetchDegrees,
        isLoading: degreeLoading,
        degrees,
        search: degreeSearch,
        setSearch: setDegreeSearch,
        currentPage: degreeCurrentPage,
        setCurrentPage: setDegreeCurrentPage,
        openModal: degreeOpenModal,
        setOpenModal: setDegreeOpenModal,
        openDeleteModal: degreeOpenDeleteModal,
        setOpenDeleteModal: setDegreeOpenDeleteModal,
        degreeValue,
        setDegreeValue,
        columns,
        degreeValueLoading,
        updateDegree,
        createDegree,
        deleteDegree
    } = useDegreeStore();

    const degreeForm = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {
            name: "",
            type: ""
        }
    });
    const {hasPermission} = usePermission();
    const canCreate = hasPermission('Membuat Gelar');
    const canEdit = hasPermission('Mengubah Gelar');
    const canDelete = hasPermission('Menghapus Gelar');
    const canView = hasPermission('Melihat Gelar');

    // console.log(canView);


    useEffect(() => {
        fetchDegrees({perPage: 20});
    }, [fetchDegrees, degreeSearch, degreeCurrentPage]);

    useEffect(() => {
        if (degreeValue && !degreeOpenDeleteModal) {
            degreeForm.reset({
                name: degreeValue.name || "",
                type: degreeValue.type || ""
            })
        } else {
            degreeForm.reset({name: "", type: ""});
        }
    }, [degreeValue, degreeForm, degreeOpenDeleteModal]);

    useEffect(() => {
        if (!degreeOpenModal) {
            degreeForm.reset({name: "", type: ""});
            if (setDegreeValue) setDegreeValue(null);
        }
    }, [degreeOpenModal, degreeForm, setDegreeValue]);

    const onSubmitDegree = async (data) => {
        if (degreeValue) {
            await updateDegree(degreeValue.id, data);
        } else {
            await createDegree(data);
        }
    };


    const renderRow = (degree, index) => (
        <TableRow key={degree.id} className="hover:bg-muted/50 transition-colors">
            <TableCell className="font-medium text-muted-foreground">
                {degrees.from + index}
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        <Award className="w-5 h-5 text-primary"/>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{degree.name}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{degree.type}</span>
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
                                            onClick={() => setDegreeOpenModal(true, degree.id)}>
                                        <Pencil className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Edit Gelar</p></TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm"
                                            className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => setDegreeOpenDeleteModal(true, degree.id)}>
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Delete Gelar</p></TooltipContent>
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
                                Data Gelar
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Kelola gelar akademik dan profesional sistem
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => setDegreeOpenModal(true)}
                    size="lg"
                >
                    <Plus className="w-4 h-4"/> Tambah Gelar
                </Button>
            </div>

            <DataTable
                title="Tabel Gelar"
                description="Daftar gelar yang tersedia"
                columns={columns()}
                data={degrees?.data || []}
                isLoading={degreeLoading}
                pagination={degrees ? {
                    from: degrees.from, to: degrees.to, total: degrees.total,
                    current_page: degrees.current_page, last_page: degrees.last_page
                } : null}
                onPageChange={setDegreeCurrentPage}
                currentPage={degreeCurrentPage}
                onSearch={setDegreeSearch}
                search={degreeSearch}
                searchPlaceholder="Cari gelar..."
                emptyStateIcon={Award}
                emptyStateText="Tidak ada data gelar ditemukan"
                renderRow={renderRow}
                showSearch={true}
            />
            <Modal
                open={degreeOpenModal}
                onOpenChange={setDegreeOpenModal}
                title={degreeValue ? "Edit Gelar" : "Tambah Gelar"}
                description={degreeValue ? "Ubah informasi gelar" : "Tambahkan gelar baru ke sistem."}
                onSubmit={degreeForm.handleSubmit(onSubmitDegree)}
                submitText={degreeValue ? "Simpan Perubahan" : "Tambah Gelar"}
                isLoading={degreeForm.formState.isSubmitting}
            >
                <div className="space-y-5 py-2">
                    <div className="space-y-2.5">
                        <Label htmlFor="degree-name" className="text-sm font-semibold">Nama <span
                            className="text-destructive">*</span></Label>
                        <Input id="degree-name" placeholder="Contoh: S.Kom, M.M"
                               {...degreeForm.register("name", {required: "Nama gelar tidak boleh kosong"})}
                               disabled={degreeValueLoading}/>
                        {degreeForm.formState.errors.name &&
                            <p className="text-sm text-destructive">{degreeForm.formState.errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="degree-type">Tipe <span
                            className="text-destructive">*</span></Label>
                        <Controller name="type" control={degreeForm.control}
                                    disabled={degreeValueLoading}
                                    rules={{required: "Tipe Gelar harus dipilih"}}
                                    render={({field}) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Pilih Tipe Gelar"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Tipe Gelar</SelectLabel>
                                                    <SelectItem value="prefix">Gelar Depan</SelectItem>
                                                    <SelectItem value="suffix">Gelar Belakang</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}/>
                        {degreeForm.formState.errors.type &&
                            <p className="text-sm text-destructive">{degreeForm.formState.errors.type.message}</p>}
                    </div>
                </div>
            </Modal>

            {/* Modal Degree: Delete */}
            <Modal
                open={degreeOpenDeleteModal}
                onOpenChange={setDegreeOpenDeleteModal}
                title="Hapus Gelar"
                description="Tindakan ini tidak dapat dibatalkan. Gelar akan dihapus permanen."
                onSubmit={() => deleteDegree(degreeValue.id)}
                submitText="Hapus Gelar"
                type="danger"
                isLoading={degreeLoading}
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
                                    className="font-semibold text-foreground">{degreeValue?.name}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default DegreePage;