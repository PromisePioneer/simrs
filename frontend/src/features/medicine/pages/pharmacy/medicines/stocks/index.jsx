import SettingPage from "@features/settings/pages/index.jsx";
import DataTable from "@shared/components/common/data-table.jsx";
import {
    Archive,
    ArrowLeft,
    Pill,
    Plus,
    Trash2,
} from "lucide-react";
import {Button} from "@shared/components/ui/button.jsx";
import Modal from "@shared/components/common/modal.jsx";
import {MEDICINE_BATCH_COLUMNS} from "@features/medicine/constants/index.js";
import {useMedicineStock} from "@features/medicine/hooks/useMedicineStock.js";
import {MedicineStockRow} from "@features/medicine/components/medicine-stock/medicine-stock-row.jsx";
import {
    MedicineStockDeleteModalContent,
    MedicineStockModalFormContent
} from "@features/medicine/components/medicine-stock/modal-content.jsx";

function MedicineStocks(opts) {
    const medicineStock = useMedicineStock(opts);
    return (
        <SettingPage>
            <Button
                variant="ghost"
                onClick={medicineStock.handleBack}
                className="mb-4"
            >
                <ArrowLeft className="w-4 h-4 mr-2"/>
                Kembali ke Data Obat
            </Button>


            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500">
                            <Pill className="w-6 h-6 text-white"/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-teal-500">
                                Manajemen Stok Obat
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Kelola Stok obat dan restock obat secara online
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => medicineStock.setOpenModal()}
                    size="lg"
                >
                    <Plus className="w-4 h-4"/> Tambah Batch Stok
                </Button>

            </div>

            <div>
                {medicineStock.canDelete && medicineStock.selectedIds.length > 0 && (
                    <div
                        className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 animate-in transition-all">
                            <span className="text-sm font-medium text-destructive">
                                {medicineStock.selectedIds.length} Batch dipilih
                            </span>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="ml-auto gap-2"
                            onClick={() => medicineStock.setOpenDeleteModal()}
                        >
                            <Trash2 className="h-4 w-4"/>
                            Hapus yang Dipilih
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => medicineStock.setSelectedIds([])}
                        >
                            Batal
                        </Button>
                    </div>
                )}
                <DataTable
                    title="Tabel Stok Obat Berdasarkan Batch"
                    description="Data Obat Berdasarkan Batch yang tersedia di gudang. Klik batch untuk melihat stok obat yang tersedia di gudang."
                    columns={MEDICINE_BATCH_COLUMNS}
                    data={medicineStock.medicineBatches?.data || []}
                    isLoading={medicineStock.isLoading}
                    pagination={medicineStock.medicineBatches ? {
                        from: medicineStock.medicineBatches.from,
                        to: medicineStock.medicineBatches.to,
                        total: medicineStock.medicineBatches.total,
                        current_page: medicineStock.medicineBatches.current_page,
                        last_page: medicineStock.medicineBatches.last_page
                    } : null}
                    onPageChange={medicineStock.setCurrentPage}
                    currentPage={medicineStock.currentPage}
                    onSearch={medicineStock.setSearch}
                    search={medicineStock.search}
                    searchPlaceholder="Cari obat..."
                    emptyStateIcon={Archive}
                    emptyStateText="Tidak ada data obat ditemukan"
                    renderRow={(item) => <MedicineStockRow item={item}
                                                           canEdit={medicineStock.canEdit}
                                                           setOpenModal={medicineStock.setOpenModal}
                                                           setOpenDeleteModal={medicineStock.setOpenDeleteModal}
                    />}
                    showSearch={true}
                    selectable={medicineStock.canDelete}
                    selectedIds={medicineStock.safeSelectedIds}
                    onToggleOne={medicineStock.toggleOne}
                    onToggleAll={medicineStock.toggleAll}
                    allSelected={medicineStock.allSelected}
                />
            </div>


            <Modal
                size="lg"
                open={medicineStock.openModal}
                onOpenChange={medicineStock.setOpenModal}
                title={medicineStock.medicineBatchValue ? "Edit batch obat" : "Tambah batch obat"}
                description={medicineStock.medicineBatchValue ? "Ubah informasi batch obat" : "Tambahkan batch obat baru ke sistem."}
                onSubmit={medicineStock.handleSubmit(medicineStock.onSubmit)}
                submitText={medicineStock.medicineBatchValue ? "Simpan Perubahan" : "Tambah batch obat"}
                isLoading={medicineStock.formState.isSubmitting}
            >
                <MedicineStockModalFormContent register={medicineStock.register}
                                               control={medicineStock.control}
                                               fetchMedicineWarehouseOptions={medicineStock.fetchMedicineWarehouseOptions}
                                               errors={medicineStock.formState.errors}
                                               isAutoBatch={medicineStock.isAutoBatch}
                                               medicineValue={medicineStock.medicineValue}
                                               warehouseId={medicineStock.warehouseId}
                                               racksByMedicineWarehouse={medicineStock.racksByMedicineWarehouse}
                                               currentYear={medicineStock.currentYear}
                                               defaultWarehouseLabel={medicineStock.medicineBatchValue?.stock?.warehouse?.name}
                                               fetchByMedicineWarehouseOptions={medicineStock.fetchByMedicineWarehouseOptions}
                                               defaultRackLabel={medicineStock.medicineBatchValue?.stock?.rack?.name}
                />
            </Modal>


            <Modal
                open={medicineStock.openDeleteModal}
                onOpenChange={medicineStock.setOpenDeleteModal}
                title="Hapus Batch"
                description="Tindakan ini tidak dapat dibatalkan. Batch akan dihapus permanen."
                onSubmit={() => medicineStock.bulkDeleteMedicineBatch(medicineStock.selectedIds)}
                submitText="Hapus Batch"
                type="danger"
                isLoading={medicineStock.formState.isSubmitting}
            >
                <MedicineStockDeleteModalContent
                    selectedIds={medicineStock.selectedIds}
                    medicineBatches={medicineStock.medicineBatches}
                />
            </Modal>
        </SettingPage>
    );
}


export default MedicineStocks;