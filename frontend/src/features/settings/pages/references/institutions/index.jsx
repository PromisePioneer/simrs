import {CreditCard, Pencil, Plus, Trash2} from "lucide-react";
import {Button} from "@shared/components/ui/button.jsx";
import DataTable from "@shared/components/common/data-table.jsx";
import Modal from "@shared/components/common/modal.jsx";
import {REGISTRATION_INSTITUTION_COLUMNS} from "@features/settings/pages/constants/index.js";
import {useInstitution} from "@features/settings/pages/hooks/useInstitution.js";
import {InstitutionRow} from "@features/settings/pages/components/institution/institution-row.jsx";
import {
    InstitutionDeleteModalFormContent,
    InstitutionModalFormContent
} from "@features/settings/pages/components/institution/modal-content.jsx";

function InstitutionPage() {
    const institution = useInstitution();

    return (
        <>
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
                        onClick={() => institution.setOpenModal()}
                        size="lg"
                    >
                        <Plus className="w-4 h-4"/>
                        Tambah Lembaga Pendaftaran
                    </Button>
                </div>


                <div>
                    {institution.canDelete && institution.selectedIds.length > 0 && (
                        <div
                            className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 animate-in transition-all">
                            <span className="text-sm font-medium text-destructive">
                                {institution.selectedIds.length} Gelar dipilih
                            </span>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="ml-auto gap-2"
                                onClick={() => institution.setOpenDeleteModal()}
                            >
                                <Trash2 className="h-4 w-4"/>
                                Hapus yang Dipilih
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => institution.setSelectedIds([])}
                            >
                                Batal
                            </Button>
                        </div>
                    )}
                    {/* Data Table */}
                    <DataTable
                        title="Data Lembaga Pendaftaran "
                        description="Kelola dan atur lembaga pendaftaran di seluruh sistem"
                        columns={REGISTRATION_INSTITUTION_COLUMNS}
                        data={institution.institutionData?.data || []}
                        isLoading={institution.isLoading}
                        pagination={institution.institutionData ? {
                            from: institution.institutionData.meta?.from,
                            to: institution.institutionData.meta?.to,
                            total: institution.institutionData.meta?.total,
                            current_page: institution.institutionData.meta?.current_page,
                            last_page: institution.institutionData.meta?.last_page
                        } : null}
                        onPageChange={institution.setCurrentPage}
                        currentPage={institution.currentPage}
                        onSearch={institution.setSearch}
                        search={institution.search}
                        searchPlaceholder="Search payment methods..."
                        emptyStateIcon={CreditCard}
                        emptyStateText="No data found"
                        renderRow={(item) => <InstitutionRow item={item}
                                                             canEdit={institution.canEdit}
                                                             setOpenModal={institution.setOpenModal}/>}
                        showSearch={true}
                        selectable={institution.canDelete}
                        selectedIds={institution.safeSelectedIds}
                        onToggleOne={institution.toggleOne}
                        onToggleAll={institution.toggleAll}
                        allSelected={institution.allSelected}
                    />
                </div>

                <Modal
                    open={institution.openModal}
                    onOpenChange={institution.setOpenModal}
                    title={institution.institutionValue ? "Edit Lembaga Pendaftaran" : "Create New Lembaga Pendaftaran"}
                    description={institution.institutionValue ? "Update cashier method information" : "Add a new cashier method to your system"}
                    onSubmit={institution.handleSubmit(institution.onSubmit)}
                    submitText={institution.institutionValue ? "Update Lembaga Pendaftaran" : "Create Lembaga Pendaftaran"}
                    isLoading={institution.formState.isSubmitting}
                >
                    <InstitutionModalFormContent register={institution.register}
                                                 control={institution.control}
                                                 errors={institution.formState.errors}
                    />
                </Modal>

                <Modal
                    open={institution.openDeleteModal}
                    onOpenChange={institution.setOpenDeleteModal}
                    title="Hapus Gelar"
                    description="Tindakan ini tidak dapat dibatalkan. Gelar yang dipilih akan dihapus permanen."
                    onSubmit={() => institution.bulkDeleteInstitutions(institution.selectedIds)}
                    type="danger"
                    isLoading={institution.isLoading}
                >
                    <InstitutionDeleteModalFormContent institutionData={institution.institutionData}
                                                       institutionValue={institution.institutionValue}
                                                       selectedIds={institution.selectedIds}
                    />
                </Modal>
            </div>
        </>
    );
}


export default InstitutionPage;