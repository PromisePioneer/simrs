import {Award, Plus, Trash2} from "lucide-react";
import {Button} from "@shared/components/ui/button.jsx";
import DataTable from "@shared/components/common/data-table.jsx";
import Modal from "@shared/components/common/modal.jsx";
import {MEDICINE_CATEGORIES_COLUMNS} from "@features/medicine/constants/index.js";
import {useMedicineCategory} from "@features/medicine/hooks/useCategory.js";
import {MedicineCategoryRow} from "@features/medicine/components/categories/medicine-category-row.jsx";
import {
    MedicineCategoryDeleteModalContent,
    MedicineCategoryModalFormContent
} from "@features/medicine/components/categories/modal-content.jsx";

function MedicineCategoriesPage() {
    const medicineCategory = useMedicineCategory();
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
                                Data Kategori Obat
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Kelola kategori obat
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => medicineCategory.setOpenModal()}
                    size="lg"
                >
                    <Plus className="w-4 h-4"/> Tambah kategori obat
                </Button>
            </div>


            <div>
                {medicineCategory.canDelete && medicineCategory.selectedIds.length > 0 && (
                    <div
                        className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 animate-in transition-all">
                            <span className="text-sm font-medium text-destructive">
                                {medicineCategory.selectedIds.length} Kategori dipilih
                            </span>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="ml-auto gap-2"
                            onClick={() => medicineCategory.setOpenDeleteModal()}
                        >
                            <Trash2 className="h-4 w-4"/>
                            Hapus yang Dipilih
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => medicineCategory.setSelectedIds([])}
                        >
                            Batal
                        </Button>
                    </div>
                )}
                <DataTable
                    title="Tabel kategori obat"
                    description="Daftar kategori obat yang tersedia"
                    columns={MEDICINE_CATEGORIES_COLUMNS}
                    data={medicineCategory.medicineCategories?.data || []}
                    isLoading={medicineCategory.isLoading}
                    pagination={medicineCategory.medicineCategories ? {
                        from: medicineCategory.medicineCategories.from,
                        to: medicineCategory.medicineCategories.to,
                        total: medicineCategory.medicineCategories.total,
                        current_page: medicineCategory.medicineCategories.current_page,
                        last_page: medicineCategory.medicineCategories.last_page
                    } : null}
                    onPageChange={medicineCategory.setCurrentPage}
                    currentPage={medicineCategory.currentPage}
                    onSearch={medicineCategory.setSearch}
                    search={medicineCategory.search}
                    searchPlaceholder="Cari kategori obat ..."
                    emptyStateIcon={Award}
                    emptyStateText="Tidak ada data kategori obat ditemukan"
                    renderRow={(item, index, checkboxCell) => <MedicineCategoryRow
                        item={item}
                        canEdit={medicineCategory.canEdit}
                        checkboxCell={checkboxCell}
                        setOpenModal={medicineCategory.setOpenModal}
                    />}
                    showSearch={true}
                    selectable={medicineCategory.canDelete}
                    selectedIds={medicineCategory.safeSelectedIds}
                    onToggleOne={medicineCategory.toggleOne}
                    onToggleAll={medicineCategory.toggleAll}
                    allSelected={medicineCategory.allSelected}
                />
            </div>

            <Modal
                open={medicineCategory.openModal}
                onOpenChange={medicineCategory.setOpenModal}
                title={medicineCategory.medicineCategoryValue ? "Edit kategori obat" : "Tambah kategori obat"}
                description={medicineCategory.medicineCategoryValue ? "Ubah informasi kategori obat" : "Tambahkan kategori obat baru ke sistem."}
                onSubmit={medicineCategory.handleSubmit(medicineCategory.onSubmit)}
                submitText={medicineCategory.medicineCategoryValue ? "Simpan Perubahan" : "Tambah kategori obat"}
                isLoading={medicineCategory.formState.isSubmitting}
            >
                <MedicineCategoryModalFormContent register={medicineCategory.register}
                                                  errors={medicineCategory.formState.errors}
                                                  control={medicineCategory.control}
                                                  isLoading={medicineCategory.isLoading}
                />
            </Modal>

            {/* Modal Medicine Category: Delete */}
            <Modal
                open={medicineCategory.openDeleteModal}
                onOpenChange={medicineCategory.setOpenDeleteModal}
                title="Hapus kategori"
                description="Tindakan ini tidak dapat dibatalkan. kategori akan dihapus permanen."
                onSubmit={() => medicineCategory.bulkDeleteMedicineCategory(medicineCategory.selectedIds)}
                submitText="Hapus kategori"
                type="danger"
                isLoading={medicineCategory.formState.isSubmitting}
            >
                <MedicineCategoryDeleteModalContent medicineCategoryValue={medicineCategory.medicineCategoryValue}
                                                    selectedIds={medicineCategory.selectedIds}
                                                    medicineCategories={medicineCategory.medicineCategories}/>
            </Modal>
        </>
    )
}


export default MedicineCategoriesPage;