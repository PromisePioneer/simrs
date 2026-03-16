import {useDepartmentStore} from "@/store/departmentStore.js";
import {useForm} from "react-hook-form";
import {useEffect} from "react";
import {TableCell, TableRow} from "@/components/ui/table.jsx";
import {Stethoscope, Pencil, Plus, Trash2} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";
import {Button} from "@/components/ui/button.jsx";
import DataTable from "@/components/common/data-table.jsx";
import Modal from "@/components/common/modal.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";

function DepartmentPage() {
    const {
        isLoading,
        currentPage,
        search,
        departments,
        openModal,
        openDeleteModal,
        departmentValue,


        setCurrentPage,
        setSearch,
        setOpenModal,
        columns,
        setOpenDeleteModal,
        fetchDepartments,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        setDepartmentValue
    } = useDepartmentStore();


    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting}
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {
            name: "",
            description: ""
        }
    });


    useEffect(() => {
        fetchDepartments({perPage: 20});
    }, [fetchDepartments, search, currentPage]);

    useEffect(() => {
        if (departmentValue && !openDeleteModal) {
            reset({
                name: departmentValue.name || "",
                description: departmentValue.description || ""
            })
        } else {
            reset({name: "", description: ""});
        }
    }, [departmentValue, openDeleteModal]);

    useEffect(() => {
        if (!openModal) {
            reset({name: "", description: ""});
            if (setDepartmentValue) setDepartmentValue(null);
        }
    }, [openModal, setDepartmentValue]);

    const onSubmit = async (data) => {
        if (departmentValue) {
            await updateDepartment(departmentValue.id, data);
        } else {
            await createDepartment(data);
        }
    };


    const renderRow = (department, index) => (
        <TableRow key={department.id} className="hover:bg-muted/50 transition-colors">
            <TableCell className="font-medium text-muted-foreground">
                {departments.meta?.from + index}
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        <Stethoscope className="w-5 h-5 text-primary"/>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{department.name}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{department.description}</span>
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
                                            onClick={() => setOpenModal(department.id)}>
                                        <Pencil className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Ubah Departemen</p></TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm"
                                            className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => setOpenDeleteModal(department.id)}>
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Hapus Departemen</p></TooltipContent>
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
                            <Stethoscope className="w-6 h-6 text-primary"/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-teal-500">
                                Data Departemen
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Kelola Departemen
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => setOpenModal()}
                    size="lg"
                >
                    <Plus className="w-4 h-4"/> Tambah Departemen
                </Button>
            </div>


            <DataTable
                title="Tabel Departemen"
                description="Daftar department yang tersedia"
                columns={columns()}
                data={departments?.data || []}
                isLoading={isLoading}
                pagination={departments ? {
                    from: departments.meta?.from, to: departments.meta?.to, total: departments.meta?.total,
                    current_page: departments.meta?.current_page, last_page: departments.meta?.last_page
                } : null}
                onPageChange={setCurrentPage}
                currentPage={currentPage}
                onSearch={setSearch}
                search={search}
                searchPlaceholder="Cari department..."
                emptyStateIcon={Stethoscope}
                emptyStateText="Tidak ada data department ditemukan"
                renderRow={renderRow}
                showSearch={true}
            />


            <Modal
                open={openModal}
                onOpenChange={setOpenModal}
                title={departmentValue ? "Edit Departemen" : "Tambah Departemen"}
                description={departmentValue ? "Ubah informasi department" : "Tambahkan department baru ke sistem."}
                onSubmit={handleSubmit(onSubmit)}
                submitText={departmentValue ? "Simpan Perubahan" : "Tambah Departemen"}
                isLoading={isSubmitting}
            >
                <div className="space-y-5 py-2">
                    <div className="space-y-2.5">
                        <Label htmlFor="name" className="text-sm font-semibold">Nama <span
                            className="text-destructive">*</span></Label>
                        <Input id="name" placeholder="Contoh: ICU"
                               {...register("name", {required: "Nama department tidak boleh kosong"})}
                        />
                        {errors.name &&
                            <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Deskripsi
                            <span className="text-destructive">*</span>
                        </Label>
                        <Textarea id="description"
                                  {...register("description",)}
                        />
                        {errors.description &&
                            <p className="text-sm text-destructive">{errors.description.message}</p>}
                    </div>
                </div>
            </Modal>


            <Modal
                open={openDeleteModal}
                onOpenChange={setOpenDeleteModal}
                title="Hapus Departemen"
                description="Tindakan ini tidak dapat dibatalkan. Departemen akan dihapus permanen."
                onSubmit={() => deleteDepartment(departmentValue.id)}
                submitText="Hapus Departemen"
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
                                <p className="text-sm text-muted-foreground">Anda akan menghapus department: <span
                                    className="font-semibold text-foreground">{departmentValue?.name}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )


}


export default DepartmentPage;