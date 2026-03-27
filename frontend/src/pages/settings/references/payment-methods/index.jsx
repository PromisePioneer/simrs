import {usePaymentMethodStore} from "@/store/usePaymentMethodStore.js";
import {Controller, useForm} from "react-hook-form";
import {CreditCard, Plus, Trash2, Pencil} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import DataTable from "@/components/common/data-table.jsx";
import {useEffect} from "react";
import {TableCell, TableRow} from "@/components/ui/table.jsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";
import Modal from "@/components/common/modal.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {AsyncSelect} from "@/components/common/async-select.jsx";

function PaymentMethodPage() {
    const {
        paymentMethodLoading,
        paymentMethodValue,
        fetchPaymentMethodTypeOptions,
        fetchPaymentMethods,
        fetchPaymentMethodType,
        paymentMethods,
        setPaymentMethodValue,
        createPaymentMethod,
        updatePaymentMethod,
        openModal: paymentOpenModal,
        setOpenModal: setPaymentOpenModal,
        openDeleteModal: paymentOpenDeleteModal,
        setOpenDeleteModal: setPaymentOpenDeleteModal,
        setSearch: setPaymentSearch,
        search: paymentSearch,
        currentPage: paymentCurrentPage,
        setCurrentPage: setPaymentCurrentPage,
        deletePaymentMethod,
        columns: paymentColumns,
    } = usePaymentMethodStore();

    const {
        register,
        control,
        reset,
        handleSubmit,
        formState: {isSubmitting, errors}
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {
            name: "",
            payment_method_type_id: ""
        }
    });


    // --- EFFECTS FOR PAYMENT METHOD ---
    useEffect(() => {
        fetchPaymentMethods({perPage: 20, search: paymentSearch});
        fetchPaymentMethodType();
    }, [paymentCurrentPage, paymentSearch, fetchPaymentMethods, fetchPaymentMethodType]);

    useEffect(() => {
        if (paymentMethodValue && !paymentOpenDeleteModal) {
            reset({
                name: paymentMethodValue.name || "",
                payment_method_type_id: paymentMethodValue.type?.id || paymentMethodValue.payment_method_type_id || ""
            })
        } else {
            reset({name: "", payment_method_type_id: ""});
        }
    }, [paymentMethodValue, paymentOpenDeleteModal]);

    useEffect(() => {
        if (!paymentOpenModal) {
            reset({name: "", payment_method_type_id: ""});
            if (setPaymentMethodValue) {
                setPaymentMethodValue(null);
            }
        }
    }, [paymentOpenModal, setPaymentMethodValue]);


    const onSubmitPayment = async (data) => {
        if (paymentMethodValue) {
            await updatePaymentMethod(paymentMethodValue.id, data);
        } else {
            await createPaymentMethod(data);
        }
    };

    const renderRowPayment = (paymentMethod, index) => (
        <TableRow key={paymentMethod.id} className="hover:bg-muted/50 transition-colors">
            <TableCell className="font-medium text-muted-foreground">
                {paymentMethods.meta.from + index}
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
                                {paymentMethod?.payment_method_type?.name}
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
                                    <Button variant="ghost" size="sm"
                                            className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary"
                                            onClick={() => setPaymentOpenModal(true, paymentMethod.id)}>
                                        <Pencil className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Ubah metode pembayaran</p></TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm"
                                            className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => setPaymentOpenDeleteModal(true, paymentMethod.id)}>
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Hapus metode pembayaran</p></TooltipContent>
                            </Tooltip>
                        </>
                    </TooltipProvider>
                </div>
            </TableCell>
        </TableRow>
    );


    return (
        <>
            <div
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5">
                            <CreditCard className="w-6 h-6 text-primary"/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-teal-500">
                                Metode Pembayaran
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Metode pembayaran sistem
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => setPaymentOpenModal(true)}
                    size="lg"
                >
                    <Plus className="w-4 h-4"/> Tambah Metode
                </Button>
            </div>

            <DataTable
                title="Data Metode Pembayaran"
                description="Kelola dan atur metode pembayaran di seluruh sistem"
                columns={paymentColumns()}
                data={paymentMethods?.data || []}
                isLoading={paymentMethodLoading}
                pagination={paymentMethods ? {
                    from: paymentMethods.meta?.from, to: paymentMethods.meta?.to, total: paymentMethods.meta?.total,
                    current_page: paymentMethods.meta?.current_page, last_page: paymentMethods.meta?.last_page
                } : null}
                onPageChange={setPaymentCurrentPage}
                currentPage={paymentCurrentPage}
                onSearch={setPaymentSearch}
                search={paymentSearch}
                searchPlaceholder="Cari metode pembayaran..."
                emptyStateIcon={CreditCard}
                emptyStateText="No payment methods found"
                renderRow={renderRowPayment}
                showSearch={true}
            />

            <Modal
                open={paymentOpenModal}
                onOpenChange={setPaymentOpenModal}
                title={paymentMethodValue ? "Edit Metode Pembayaran" : "Tambah Metode Pembayaran"}
                description={paymentMethodValue ? "Update metode pembayaran" : "Tambah metode pembayaran baru ke sistem"}
                onSubmit={handleSubmit(onSubmitPayment)}
                submitText={paymentMethodValue ? "Update" : "Buat Metode"}
                isLoading={isSubmitting}
            >
                <div className="space-y-5 py-2">
                    <div className="space-y-2.5">
                        <Label htmlFor="payment-name" className="text-sm font-semibold">Nama <span
                            className="text-destructive">*</span></Label>
                        <Input id="payment-name" placeholder="Masukkan nama metode pembayaran"
                               {...register("name", {required: "Nama metode pembayaran tidak boleh kosong"})}/>
                        {errors.name &&
                            <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="payment-type">Tipe Metode Pembayaran</Label>
                        <Controller
                            name="payment_method_type_id"
                            control={control}
                            rules={{required: "Tipe Metode Pembayaran wajib dipilih"}}
                            render={({field}) => (
                                <AsyncSelect fetchFn={fetchPaymentMethodTypeOptions}
                                             value={field.value}
                                             onChange={field.onChange}
                                             placeholder="Cari Tipe Pembayaran..."
                                             debounce={300}
                                             defaultLabel={paymentMethodValue?.type?.name}
                                />
                            )}
                        />
                        {errors.payment_method_type_id &&
                            <p className="text-sm text-destructive">{errors.payment_method_type_id.message}</p>}
                    </div>
                </div>
            </Modal>

            <Modal
                open={paymentOpenDeleteModal}
                onOpenChange={setPaymentOpenDeleteModal}
                title="Hapus Metode Pembayaran"
                description="Tindakan ini tidak dapat dibatalkan."
                onSubmit={() => deletePaymentMethod(paymentMethodValue.id)}
                submitText="Hapus Metode"
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
                                    Konfirmasi Penghapusan
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Anda akan menghapus:
                                    <span className="font-semibold text-foreground">
                                        {paymentMethodValue?.name}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )

}

export default PaymentMethodPage;