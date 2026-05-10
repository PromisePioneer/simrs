import {Award, Plus, Trash2} from "lucide-react";
import {Button} from "@shared/components/ui/button.jsx";
import Modal from "@shared/components/common/modal.jsx";
import DataTable from "@shared/components/common/data-table.jsx";
import {DEGREE_COLUMNS} from "@features/settings/pages/constants/index.js";
import {DegreeRow} from "@features/settings/pages/components/degree/degree-row.jsx";
import {
    DegreeModalDeleteContent,
    DegreeModalFormContent
} from "@features/settings/pages/components/degree/modal-content.jsx";
import {useDegree} from "@features/settings/pages/hooks/useDegree.js";

function DegreePage() {

    const degree = useDegree();
    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 mb-10">
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
                    onClick={() => degree.setOpenModal(true)}
                    size="lg"
                >
                    <Plus className="w-4 h-4"/> Tambah Gelar
                </Button>
            </div>

            <div>
                {degree.canDelete && degree.selectedIds.length > 0 && (
                    <div
                        className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 animate-in transition-all">
                            <span className="text-sm font-medium text-destructive">
                                {degree.selectedIds.length} Gelar dipilih
                            </span>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="ml-auto gap-2"
                            onClick={() => degree.setOpenDeleteModal()}
                        >
                            <Trash2 className="h-4 w-4"/>
                            Hapus yang Dipilih
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => degree.setSelectedIds([])}
                        >
                            Batal
                        </Button>
                    </div>
                )}
                <DataTable
                    title="Tabel Gelar"
                    description="Daftar gelar yang tersedia"
                    columns={DEGREE_COLUMNS}
                    data={degree.degrees?.data || []}
                    isLoading={degree.isLoading}
                    pagination={degree.degrees ? {
                        from: degree.degrees.meta?.from, to: degree.degrees.meta?.to, total: degree.degrees.meta?.total,
                        current_page: degree.degrees.meta?.current_page, last_page: degree.degrees.meta?.last_page
                    } : null}
                    onPageChange={degree.setCurrentPage}
                    currentPage={degree.currentPage}
                    onSearch={degree.setSearch}
                    search={degree.search}
                    searchPlaceholder="Cari gelar..."
                    emptyStateIcon={Award}
                    emptyStateText="Tidak ada data gelar ditemukan"
                    renderRow={(item) => DegreeRow(item, degree.canEdit, degree.setOpenModal)}
                    showSearch={true}
                    selectable={degree.canDelete}
                    selectedIds={degree.safeSelectedIds}
                    onToggleOne={degree.toggleOne}
                    onToggleAll={degree.toggleAll}
                    allSelected={degree.allSelected}
                />
            </div>

            <Modal
                open={degree.openModal}
                onOpenChange={degree.setOpenModal}
                title={degree.degreeValue ? "Edit Gelar" : "Tambah Gelar"}
                description={degree.degreeValue ? "Ubah informasi gelar" : "Tambahkan gelar baru ke sistem."}
                onSubmit={degree.handleSubmit(degree.onSubmitDegree)}
                submitText={degree.degreeValue ? "Simpan Perubahan" : "Tambah Gelar"}
                isLoading={degree.formState.isSubmitting}
            >
                <DegreeModalFormContent
                    register={degree.register}
                    control={degree.control}
                    degreeValueLoading={degree.degreeValueLoading}
                    errors={degree.formState.errors}
                />
            </Modal>

            {/* Modal Degree: Delete */}
            <Modal
                open={degree.openDeleteModal}
                onOpenChange={degree.setOpenDeleteModal}
                title="Hapus Gelar"
                description="Tindakan ini tidak dapat dibatalkan. Gelar yang dipilih akan dihapus permanen."
                onSubmit={() => degree.bulkDeleteDegrees(selectedIds)}
                type="danger"
                isLoading={degree.isLoading}
            >
                <DegreeModalDeleteContent degreeValue={degree.degreeValue}
                                          selectedIds={degree.selectedIds}
                                          degrees={degree.degrees}
                />
            </Modal>
        </>
    )
}

export default DegreePage;