import {Stethoscope, Plus, Trash2} from "lucide-react";
import {Button} from "@shared/components/ui/button.jsx";
import DataTable from "@shared/components/common/data-table.jsx";
import Modal from "@shared/components/common/modal.jsx";
import {DISEASE_COLUMNS} from "@features/settings/pages/constants/index.js";
import {useDiseases} from "@features/settings/pages/hooks/useDiseases.js";
import {DiseaseRow} from "@features/settings/pages/components/disease/disease-row.jsx";
import {
    DiseaseDeleteModalContent,
    DiseaseModalFormContent
} from "@features/settings/pages/components/disease/modal-content.jsx";


function DiseasePage() {


    const disease = useDiseases()

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
                            <h1 className="text-3xl font-bold tracking-tight text-teal-500">Data Penyakit</h1>
                            <p className="text-sm text-muted-foreground mt-1">Kelola Penyakit (ICD-10)</p>
                        </div>
                    </div>
                </div>
                <Button className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                        onClick={() => disease.setOpenModal()} size="lg">
                    <Plus className="w-4 h-4"/> Tambah Penyakit
                </Button>
            </div>

            <div>
                {disease.canDelete && disease.selectedIds.length > 0 && (
                    <div
                        className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 animate-in transition-all">
                            <span className="text-sm font-medium text-destructive">
                                {disease.selectedIds.length} Penyakit dipilih
                            </span>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="ml-auto gap-2"
                            onClick={() => disease.setOpenDeleteModal()}
                        >
                            <Trash2 className="h-4 w-4"/>
                            Hapus yang Dipilih
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => disease.setSelectedIds([])}
                        >
                            Batal
                        </Button>
                    </div>
                )}
                <DataTable
                    title="Tabel Penyakit"
                    description="Daftar penyakit yang tersedia"
                    columns={DISEASE_COLUMNS}
                    data={disease.diseases?.data || []}
                    isLoading={disease.isLoading}
                    pagination={disease.diseases ? {
                        from: disease.diseases.meta?.from,
                        to: disease.diseases.meta?.to,
                        total: disease.diseases.meta?.total,
                        current_page: disease.diseases.meta?.current_page,
                        last_page: disease.diseases.meta?.last_page
                    } : null}
                    onPageChange={disease.setCurrentPage}
                    currentPage={disease.currentPage}
                    onSearch={disease.setSearch}
                    search={disease.search}
                    searchPlaceholder="Cari kode atau nama penyakit..."
                    emptyStateIcon={Stethoscope}
                    emptyStateText="Tidak ada data penyakit ditemukan"
                    renderRow={(item, index, checkboxCell) =>
                        <DiseaseRow item={item}
                                    canEdit={disease.canEdit}
                                    setOpenModal={disease.setOpenModal}
                                    checkboxCell={checkboxCell}
                        />
                    }
                    showSearch={true}
                    selectable={disease.canDelete}
                    selectedIds={disease.safeSelectedIds}
                    onToggleOne={disease.toggleOne}
                    onToggleAll={disease.toggleAll}
                    allSelected={disease.allSelected}
                />
            </div>

            {/* ── Modal Create / Edit ── */}
            <Modal
                open={disease.openModal}
                onOpenChange={disease.setOpenModal}
                title={disease.diseaseValue ? "Edit Penyakit" : "Tambah Penyakit"}
                description={disease.diseaseValue ? "Ubah informasi penyakit" : "Tambahkan penyakit baru ke sistem."}
                onSubmit={disease.handleSubmit(disease.onSubmit)}
                submitText={disease.diseaseValue ? "Simpan Perubahan" : "Tambah Penyakit"}
                isLoading={disease.formState.isSubmitting}
            >
                <DiseaseModalFormContent register={disease.register}
                                         control={disease.control}
                                         errors={disease.formState.errors}
                />
            </Modal>

            {/* ── Modal Delete ── */}
            <Modal
                open={disease.openDeleteModal}
                onOpenChange={disease.setOpenDeleteModal}
                title="Hapus Penyakit"
                description="Tindakan ini tidak dapat dibatalkan. Penyakit akan dihapus permanen."
                onSubmit={() => disease.bulkDeleteDisease(disease.selectedIds)}
                submitText="Hapus Penyakit"
                type="danger"
                isLoading={disease.formState.isSubmitting}
            >
                <DiseaseDeleteModalContent diseaseValue={disease.diseaseValue}
                                           selectedIds={disease.selectedIds}
                                           diseases={disease.diseases}/>
            </Modal>
        </>
    );
}

export default DiseasePage;