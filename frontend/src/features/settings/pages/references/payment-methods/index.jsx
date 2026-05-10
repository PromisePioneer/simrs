import {CreditCard, Plus, Trash2} from "lucide-react";
import {Button} from "@shared/components/ui/button.jsx";
import DataTable from "@shared/components/common/data-table.jsx";
import Modal from "@shared/components/common/modal.jsx";
import {PAYMENT_METHOD_COLUMNS} from "@features/settings/pages/constants/index.js";
import {PaymentMethodsRow} from "@features/settings/pages/components/payment-methods/payment-methods-row.jsx";
import {UsePaymentMethod} from "@features/settings/pages/hooks/usePaymentMethod.js";
import {
    PaymentMethodDeleteModalContent,
    PaymentMethodModalFormContent
} from "@features/settings/pages/components/payment-methods/modal-content.jsx";

function PaymentMethodPage() {
    const paymentMethod = UsePaymentMethod();
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
                    onClick={() => paymentMethod.setOpenModal(true)}
                    size="lg"
                >
                    <Plus className="w-4 h-4"/> Tambah Metode
                </Button>
            </div>


            <div>
                {paymentMethod.canDelete && paymentMethod.selectedIds.length > 0 && (
                    <div
                        className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 animate-in transition-all">
                            <span className="text-sm font-medium text-destructive">
                                {paymentMethod.selectedIds.length} Gelar dipilih
                            </span>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="ml-auto gap-2"
                            onClick={() => paymentMethod.setOpenDeleteModal()}
                        >
                            <Trash2 className="h-4 w-4"/>
                            Hapus yang Dipilih
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => paymentMethod.setSelectedIds([])}
                        >
                            Batal
                        </Button>
                    </div>
                )}

                <DataTable
                    title="Data Metode Pembayaran"
                    description="Kelola dan atur metode pembayaran di seluruh sistem"
                    columns={PAYMENT_METHOD_COLUMNS}
                    data={paymentMethod.paymentMethods?.data || []}
                    isLoading={paymentMethod.paymentMethodLoading}
                    pagination={paymentMethod.paymentMethods ? {
                        from: paymentMethod.paymentMethods.meta?.from,
                        to: paymentMethod.paymentMethods.meta?.to,
                        total: paymentMethod.paymentMethods.meta?.total,
                        current_page: paymentMethod.paymentMethods.meta?.current_page,
                        last_page: paymentMethod.paymentMethods.meta?.last_page
                    } : null}
                    onPageChange={paymentMethod.setCurrentPage}
                    currentPage={paymentMethod.currentPage}
                    onSearch={paymentMethod.setSearch}
                    search={paymentMethod.search}
                    searchPlaceholder="Cari metode pembayaran..."
                    emptyStateIcon={CreditCard}
                    emptyStateText="No payment methods found"
                    renderRow={(item) =>
                        PaymentMethodsRow(
                            item,
                            paymentMethod.canEdit,
                            paymentMethod.setOpenModal
                        )}
                    showSearch={true}
                    selectable={paymentMethod.canDelete}
                    selectedIds={paymentMethod.safeSelectedIds}
                    onToggleOne={paymentMethod.toggleOne}
                    onToggleAll={paymentMethod.toggleAll}
                    allSelected={paymentMethod.allSelected}
                />

            </div>

            <Modal
                open={paymentMethod.openModal}
                onOpenChange={paymentMethod.setOpenModal}
                title={paymentMethod.paymentMethodValue ? "Edit Metode Pembayaran" : "Tambah Metode Pembayaran"}
                description={paymentMethod.paymentMethodValue ? "Update metode pembayaran" : "Tambah metode pembayaran baru ke sistem"}
                onSubmit={paymentMethod.handleSubmit(paymentMethod.onSubmitPayment)}
                submitText={paymentMethod.paymentMethodValue ? "Update" : "Buat Metode"}
                isLoading={paymentMethod.formState.isSubmitting}
            >
                <PaymentMethodModalFormContent register={paymentMethod.register} control={paymentMethod.control}
                                               errors={paymentMethod.formState.errors}
                                               fetchPaymentMethodTypeOptions={paymentMethod.fetchPaymentMethodTypeOptions}
                                               paymentMethodValue={paymentMethod.paymentMethodValue}
                />
            </Modal>

            <Modal
                open={paymentMethod.openDeleteModal}
                onOpenChange={paymentMethod.setOpenDeleteModal}
                title="Hapus Metode Pembayaran"
                description="Tindakan ini tidak dapat dibatalkan."
                onSubmit={() => paymentMethod.bulkDeletePaymentMethod(paymentMethod.selectedIds)}
                submitText="Hapus Metode"
                type="danger"
                isLoading={paymentMethod.paymentMethodLoading}
            >
                <PaymentMethodDeleteModalContent paymentMethodValue={paymentMethod.paymentMethodValue}
                                                 selectedIds={paymentMethod.selectedIds}
                                                 paymentMethods={paymentMethod.paymentMethods}/>
            </Modal>
        </>
    )

}

export default PaymentMethodPage;