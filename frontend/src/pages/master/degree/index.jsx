import Layout from "@/pages/dashboard/layout.jsx";
import {useDegreeStore} from "@/store/useDegreeStore.js";
import {useEffect, useState} from "react";
import {TableCell, TableRow} from "@/components/ui/table.jsx";
import {CreditCard, Pencil, Plus, Trash2} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";
import {Button} from "@/components/ui/button.jsx";
import DataTable from "@/components/common/data-table.jsx";
import Modal from "@/components/common/modal.jsx";
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

function DegreePage() {
    const {
        fetchDegrees,
        isLoading,
        degrees,
        search,
        setSearch,
        currentPage,
        setCurrentPage,
        openModal,
        setOpenModal,
        openDeleteModal,
        setOpenDeleteModal,
        degreeValue,
        setDegreeValue,
        columns,
        degreeValueLoading,
        updateDegree,
        createDegree,
        deleteDegree
    } = useDegreeStore();


    // form
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: {errors, isSubmitting}
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {
            name: "",
            type: ""
        }
    });


    useEffect(() => {
        fetchDegrees({perPage: 20});
    }, [fetchDegrees, search, currentPage]);


    useEffect(() => {
        if (degreeValue && !openDeleteModal) {
            reset({
                name: degreeValue.name || "",
                type: degreeValue.type || ""
            })
        } else {
            reset({
                name: "",
                type: ""
            });
        }
    }, [degreeValue, reset]);

    useEffect(() => {
        if (!openModal) {
            reset({
                name: "",
                type: ""
            });
            if (setDegreeValue) {
                setDegreeValue(null);
            }
        }
    }, [openModal, reset]);

    const onSubmit = async (data) => {
        if (degreeValue) {
            await updateDegree(degreeValue.id, data);
        } else {
            await createDegree(data);
        }
    };


    const renderRow = (degree, index) => {
        return (<TableRow key={degree.id} className="hover:bg-muted/50 transition-colors">
            <TableCell className="font-medium text-muted-foreground">
                {degrees.from + index}
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        <CreditCard className="w-5 h-5 text-primary"/>
                    </div>
                    <div className="flex flex-col">
                            <span className="font-semibold text-foreground">
                                {degree.name}
                            </span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                            <span className="font-semibold text-foreground">
                                {degree.type}
                            </span>
                    </div>
                </div>
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
                                        onClick={() => setOpenModal(true, degree.id)}>
                                        <Pencil className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit Gelar</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
                                        onClick={() => setOpenDeleteModal(true, degree.id)}>
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Delete Gelar</p>
                                </TooltipContent>
                            </Tooltip>
                        </>
                    </TooltipProvider>
                </div>
            </TableCell>
        </TableRow>);
    };

    return (
        <Layout>
            <div className="space-y-6 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div
                                className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5">
                                <CreditCard className="w-6 h-6 text-primary"/>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-teal-500">
                                    Gelar
                                </h1>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Kelola Gelar sistem
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button
                        className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                        onClick={() => setOpenModal(true)}
                        size="lg"
                    >
                        <Plus className="w-4 h-4"/>
                        Tambah Gelar
                    </Button>
                </div>

                {/* Data Table */}
                <DataTable
                    title="Data Gelar"
                    description="Kelola dan atur gelar di seluruh sistem"
                    columns={columns()}
                    data={degrees?.data || []}
                    isLoading={isLoading}
                    pagination={degrees ? {
                        from: degrees.from,
                        to: degrees.to,
                        total: degrees.total,
                        current_page: degrees.current_page,
                        last_page: degrees.last_page
                    } : null}
                    onPageChange={setCurrentPage}
                    currentPage={currentPage}
                    onSearch={setSearch}
                    search={search}
                    searchPlaceholder="Search payment methods..."
                    emptyStateIcon={CreditCard}
                    emptyStateText="No payment methods found"
                    renderRow={renderRow}
                    showSearch={true}
                />

                <Modal
                    open={openModal}
                    onOpenChange={setOpenModal}
                    title={degreeValue ? "Edit Gelar" : "Tambah Gelar"}
                    description={degreeValue ? "Update Gelar" : "Tambah gelar baru ke sistem."}
                    onSubmit={handleSubmit(onSubmit)}
                    submitText={degreeValue ? "Update Gelar" : "Tambah Gelar"}
                    isLoading={isSubmitting}
                >
                    <div className="space-y-5 py-2">
                        <div className="space-y-2.5">
                            <Label htmlFor="name" className="text-sm font-semibold">
                                Nama <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="Masukkan nama gelar"
                                {...register("name", {required: "Nama gelar tidak boleh kosong"})}
                                disabled={degreeValueLoading}
                            />
                            {errors.name ? (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                            ) : (
                                <p className="text-xs text-muted-foreground">
                                    Pilih nama yang deskriptif untuk gelar ini.
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">
                                Tipe <span className="text-destructive">*</span>
                            </Label>
                            <Controller
                                name="type"
                                control={control}
                                disabled={degreeValueLoading}
                                rules={{required: "Tipe Gelar harus dipilih"}}
                                render={({field}) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih Tipe Gelar"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Tipe Gelar</SelectLabel>
                                                <SelectItem value="prefix">
                                                    Gelar Belakang
                                                </SelectItem>
                                                <SelectItem value="suffix">
                                                    Gelar Depan
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.type ? (
                                <p className="text-sm text-destructive">{errors.type.message}</p>
                            ) : (
                                <p className="text-xs text-muted-foreground">
                                    Pilih tipe Gelar.
                                </p>
                            )}
                        </div>
                    </div>
                </Modal>

                <Modal
                    open={openDeleteModal}
                    onOpenChange={setOpenDeleteModal}
                    title="Delete Gelar"
                    description="This action cannot be undone. This will permanently delete the payment method."
                    onSubmit={() => deleteDegree(degreeValue.id)}
                    submitText="Delete Gelar"
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
                                    <p className="text-sm font-semibold text-foreground">
                                        Confirm Deletion
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        You are about to delete the payment method:{" "}
                                        <span className="font-semibold text-foreground">
                                            {degreeValue?.name}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            This payment method will no longer be available for transactions.
                        </p>
                    </div>
                </Modal>
            </div>
        </Layout>
    );
}

export default DegreePage;