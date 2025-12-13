import Layout from "@/pages/dashboard/layout.jsx";
import {usePaymentMethodStore} from "@/store/usePaymentMethodStore";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.jsx";
import {Pencil, Plus, Trash2, CreditCard, ChevronsUpDown, Check, Calendar as CalendarIcon} from "lucide-react";
import {TableCell, TableRow} from "@/components/ui/table.jsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";
import DataTable from "@/components/common/data-table.jsx";
import Modal from "@/components/common/modal.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {usePaymentMethod} from "@/hooks/use-payment-method.js";
import {Controller, useForm} from "react-hook-form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command.jsx";
import {cn} from "@/lib/utils.js";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar.jsx";

function PaymentMethodPage() {
    const {
        paymentMethodLoading,
        paymentMethodTypeLoading,
        submitLoading,
        fetchPaymentMethodType,
        paymentMethodTypes,
        fetchPaymentMethods,
        paymentMethods,
    } = usePaymentMethodStore();

    const {
        isModalLoading,
        isModalFormOpen,
        setIsModalFormOpen,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        setSelectedRole,
        selectedRole,
        columns,
        currentPage,


        handlePageChange,
        handleOpenModalForm,
        handleCreate,
        handleEdit,
        handleOpenDeleteModal,
        handleSearch,
        handleDelete,
    } = usePaymentMethod();

    useEffect(() => {
        fetchPaymentMethods({page: currentPage, perPage: 20});
    }, [currentPage]);

    // form
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: {errors, isSubmitting}
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {
            name: "",
            payment_method_type_id: ""
        }
    });


    const onSubmit = async (data) => {
        await handleCreate(data);
    };


    const renderRow = (paymentMethod, index) => {
        return (<TableRow key={paymentMethod.id} className="hover:bg-muted/50 transition-colors">
            <TableCell className="font-medium text-muted-foreground">
                {paymentMethods.from + index}
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        <CreditCard className="w-5 h-5 text-primary"/>
                    </div>
                    <div className="flex flex-col">
                            <span className="font-semibold text-foreground">
                                {paymentMethod.name}
                            </span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                            <span className="font-semibold text-foreground">
                                {paymentMethod.payment_method_type.name}
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
                                        onClick={() => handleOpenModalForm(paymentMethod)}>
                                        <Pencil className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit Payment Method</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
                                        onClick={() => handleOpenDeleteModal(paymentMethod)}>
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Delete Payment Method</p>
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
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div
                                className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5">
                                <CreditCard className="w-6 h-6 text-primary"/> {/* Changed icon */}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-teal-500">
                                    Payment Method Management
                                </h1>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Metode pembayaran sistem
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button
                        className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                        onClick={handleOpenModalForm}
                        size="lg"
                    >
                        <Plus className="w-4 h-4"/>
                        Add New Payment Method
                    </Button>
                </div>

                {/* Data Table */}
                <DataTable
                    title="Payment Method Data"
                    description="Kelola dan atur metode pembayaran di seluruh sistem"
                    columns={columns()}
                    data={paymentMethods?.data || []}
                    isLoading={paymentMethodLoading}
                    pagination={paymentMethods ? {
                        from: paymentMethods.from,
                        to: paymentMethods.to,
                        total: paymentMethods.total,
                        current_page: paymentMethods.current_page,
                        last_page: paymentMethods.last_page
                    } : null}
                    onPageChange={handlePageChange}
                    onSearch={handleSearch}
                    searchPlaceholder="Search payment methods..."
                    emptyStateIcon={CreditCard}
                    emptyStateText="No payment methods found"
                    renderRow={renderRow}
                    showSearch={true}
                />

                <Modal
                    open={isModalFormOpen}
                    onOpenChange={setIsModalFormOpen}
                    title="Create New Payment Method"
                    description="Add a new payment method to your system"
                    onSubmit={handleSubmit(onSubmit)}
                    submitText="Create Payment Method"
                    isLoading={submitLoading}
                >
                    <div className="space-y-5 py-2">
                        <div className="space-y-2.5">
                            <Label htmlFor="name" className="text-sm font-semibold">
                                Nama <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="Masukkan nama metode pembayaran"
                                {...register("name", {required: "Nama metode pembayaran tidak boleh kosong"})}
                            />
                            {errors.name ? (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                            ) : (
                                <p className="text-xs text-muted-foreground">
                                    Pilih nama yang deskriptif untuk metode pembayaran ini.
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="payment_method_type_id">
                                Tipe Metode pembayaran
                            </Label>
                            <Controller
                                name="payment_method_type_id"
                                control={control}
                                rules={{
                                    required: "tipe metode pembayaran tidak boleh kosong"
                                }}
                                render={({field}) => {
                                    const [open, setOpen] = useState(false);
                                    return (
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className="w-full justify-between"
                                                >
                                                    {field.value
                                                        ? paymentMethodTypes.find((str) => str.id === field.value)?.name
                                                        : "Pilih lembaga..."}
                                                    <ChevronsUpDown className="opacity-50"/>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[480px]">
                                                <Command>
                                                    <CommandInput placeholder="Cari lembaga..." className="h-9"/>
                                                    <CommandList>
                                                        <CommandEmpty>Lembaga tidak ditemukan.</CommandEmpty>
                                                        <CommandGroup className="w-full">
                                                            {paymentMethodTypes.map((paymentMethodType) => (
                                                                <CommandItem
                                                                    key={paymentMethodType.id}
                                                                    value={paymentMethodType.id}
                                                                    onSelect={() => {
                                                                        field.onChange(paymentMethodType.id === field.value ? "" : paymentMethodType.id);
                                                                        setOpen(false);
                                                                    }}
                                                                >
                                                                    {paymentMethodType.name}
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto",
                                                                            field.value === paymentMethodType.id ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    );
                                }}
                            />
                            {errors.str_institution_id && (
                                <p className="text-sm text-destructive">{errors.str_institution_id.message}</p>
                            )}
                        </div>
                    </div>
                </Modal>

                <Modal
                    open={isDeleteModalOpen}
                    onOpenChange={setIsDeleteModalOpen}
                    title="Delete Payment Method"
                    description="This action cannot be undone. This will permanently delete the payment method."
                    onSubmit={() => handleDelete(currentPage)}
                    submitText="Delete Payment Method"
                    type="danger"
                    isLoading={paymentMethodLoading}
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
                                            {selectedRole?.name}
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
        </Layout>)
}

export default PaymentMethodPage;