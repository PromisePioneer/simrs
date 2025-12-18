import Layout from "@/pages/dashboard/layout.jsx";
import {useRegistrationInstitutionStore} from "@/store/registration-institutions/useRegistrationInstitutionStore.js";
import {useEffect} from "react";
import {useForm, Controller} from "react-hook-form";
import {TableCell, TableRow} from "@/components/ui/table.jsx";
import {CreditCard, Pencil, Plus, Trash2} from "lucide-react";
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

function RegistrationInstitutionsPage() {

    const {
        isLoading,
        fetchInstitutions,
        institutionData,
        setInstitutionValue,
        search,
        setSearch,
        currentPage,
        setCurrentPage,
        openModal,
        setOpenModal,
        institutionValue,
        columns,
        openDeleteModal,
        setOpenDeleteModal,
        createInstitution,
        updateInstitution,
    } = useRegistrationInstitutionStore();


    useEffect(() => {
        fetchInstitutions({perPage: 20})
    }, [currentPage, search]);


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
        if (institutionValue && !openDeleteModal) {
            reset({
                name: institutionValue.name || "",
                type: institutionValue.type || ""
            })
        } else {
            reset({
                name: "",
                type: ""
            });
        }
    }, [institutionValue, reset, openDeleteModal])


    useEffect(() => {
        if (!openModal) {
            reset({
                name: "",
                type: ""
            });
            if (setInstitutionValue) {
                setInstitutionValue(null);
            }
        }
    }, [openModal, reset]);

    const onSubmit = async (data) => {
        if (institutionValue) {
            await updateInstitution(institutionValue.id, data);
        } else {
            await createInstitution(data);
        }
    }

    const deleteInstitution = async (page) => {
        console.log("Deleting institution:", institutionValue?.id);
    }


    const renderRow = (institution, index) => {
        return (<TableRow key={institution.id} className="hover:bg-muted/50 transition-colors">
            <TableCell className="font-medium text-muted-foreground">
                {institutionData.from + index}
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        <CreditCard className="w-5 h-5 text-primary"/>
                    </div>
                    <div className="flex flex-col">
                            <span className="font-semibold text-foreground">
                                {institution.name}
                            </span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                            <span className="font-semibold text-foreground">
                                {institution.type.toUpperCase()}
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
                                        onClick={() => setOpenModal(true, institution.id)}>
                                        <Pencil className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit Lembaga Pendaftaran</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
                                        onClick={() => setOpenDeleteModal(true, institution.id)}>
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Delete Lembaga Pendaftaran</p>
                                </TooltipContent>
                            </Tooltip>
                        </>
                    </TooltipProvider>
                </div>
            </TableCell>
        </TableRow>);
    };

    return (
        <>
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
                                        Lembaga pendaftaran
                                    </h1>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Lembaga pendaftaran SIP & STR
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
                            Tambah Lembaga Pendaftaran
                        </Button>
                    </div>

                    {/* Data Table */}
                    <DataTable
                        title="Data Lembaga Pendaftaran "
                        description="Kelola dan atur lembaga pendaftaran di seluruh sistem"
                        columns={columns()}
                        data={institutionData?.data || []}
                        isLoading={isLoading}
                        pagination={institutionData ? {
                            from: institutionData.from,
                            to: institutionData.to,
                            total: institutionData.total,
                            current_page: institutionData.current_page,
                            last_page: institutionData.last_page
                        } : null}
                        onPageChange={setCurrentPage}
                        currentPage={currentPage}
                        onSearch={setSearch}
                        search={search}
                        searchPlaceholder="Search payment methods..."
                        emptyStateIcon={CreditCard}
                        emptyStateText="No data found"
                        renderRow={renderRow}
                        showSearch={true}
                    />

                    <Modal
                        open={openModal}
                        onOpenChange={setOpenModal}
                        title={institutionValue ? "Edit Lembaga Pendaftaran" : "Create New Lembaga Pendaftaran"}
                        description={institutionValue ? "Update payment method information" : "Add a new payment method to your system"}
                        onSubmit={handleSubmit(onSubmit)}
                        submitText={institutionValue ? "Update Lembaga Pendaftaran" : "Create Lembaga Pendaftaran"}
                        isLoading={isSubmitting}
                    >
                        <div className="space-y-5 py-2">
                            <div className="space-y-2.5">
                                <Label htmlFor="name" className="text-sm font-semibold">
                                    Nama <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Masukkan nama lembaga pendaftaran"
                                    {...register("name", {required: "Nama lembaga pendaftaran tidak boleh kosong"})}
                                />
                                {errors.name ? (
                                    <p className="text-sm text-destructive">{errors.name.message}</p>
                                ) : (
                                    <p className="text-xs text-muted-foreground">
                                        Pilih nama yang deskriptif untuk lembaga pendaftaran ini.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">
                                    Tipe Lembaga Pendaftaran <span className="text-destructive">*</span>
                                </Label>
                                <Controller
                                    name="type"
                                    control={control}
                                    rules={{required: "Tipe lembaga pendaftaran harus dipilih"}}
                                    render={({field}) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Pilih Tipe Lembaga Pendaftaran"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Tipe Lembaga Pendaftaran</SelectLabel>
                                                    <SelectItem value="sip">
                                                        SIP
                                                    </SelectItem>
                                                    <SelectItem value="str">
                                                        STR
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
                                        Pilih tipe lembaga pendaftaran untuk lembaga pendaftaran ini.
                                    </p>
                                )}
                            </div>
                        </div>
                    </Modal>

                    <Modal
                        open={openDeleteModal}
                        onOpenChange={setOpenDeleteModal}
                        title="Delete Lembaga Pendaftaran"
                        description="This action cannot be undone. This will permanently delete the payment method."
                        onSubmit={() => deleteInstitution(currentPage)}
                        submitText="Delete Lembaga Pendaftaran"
                        type="danger"
                        isLoading={isSubmitting}
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
                                            {institutionValue?.name}
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
        </>
    );

}

export default RegistrationInstitutionsPage;