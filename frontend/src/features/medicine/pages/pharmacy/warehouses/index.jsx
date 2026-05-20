import {Award, Plus, Archive, Trash2} from "lucide-react";
import {Button} from "@shared/components/ui/button.jsx";
import DataTable from "@shared/components/common/data-table.jsx";
import Modal from "@shared/components/common/modal.jsx";
import {Link} from "@tanstack/react-router";
import {MEDICINE_WAREHOUSE_COLUMNS} from "@features/medicine/constants/index.js";
import {useMedicineWarehouseIndex} from "@features/medicine/hooks/useMedicineWarehouseIndex.js";
import {MedicineWarehouseRow} from "@features/medicine/components/warehouses/medicine-warehouse-row.jsx";
import {MedicineWarehouseDeleteModalContent} from "@features/medicine/components/warehouses/modal-content.jsx";


function MedicineWarehousePage() {
    const medicineWarehouse = useMedicineWarehouseIndex();

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
                                Data Gudang Obat
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Kelola gudang
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                    size="lg"
                    asChild
                >
                    <Link to="/pharmacy/warehouse/create">
                        <Plus className="w-4 h-4"/> Tambah gudang
                    </Link>
                </Button>
            </div>


            <div>

                {medicineWarehouse.canDelete && medicineWarehouse.selectedIds.length > 0 && (
                    <div
                        className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 animate-in transition-all">
                            <span className="text-sm font-medium text-destructive">
                                {medicineWarehouse.selectedIds.length} Gelar dipilih
                            </span>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="ml-auto gap-2"
                            onClick={() => medicineWarehouse.setOpenDeleteModal()}
                        >
                            <Trash2 className="h-4 w-4"/>
                            Hapus yang Dipilih
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => medicineWarehouse.setSelectedIds([])}
                        >
                            Batal
                        </Button>
                    </div>
                )}

                <DataTable
                    title="Daftar gudang"
                    description="Daftar Gudang yang tersedia"
                    columns={MEDICINE_WAREHOUSE_COLUMNS}
                    data={medicineWarehouse.medicineWarehouses?.data || []}
                    isLoading={medicineWarehouse.isLoading}
                    pagination={medicineWarehouse.medicineWarehouses ? {
                        from: medicineWarehouse.medicineWarehouses.from,
                        to: medicineWarehouse.medicineWarehouses.to,
                        total: medicineWarehouse.medicineWarehouses.total,
                        current_page: medicineWarehouse.medicineWarehouses.current_page,
                        last_page: medicineWarehouse.medicineWarehouses.last_page
                    } : null}
                    onPageChange={medicineWarehouse.setCurrentPage}
                    currentPage={medicineWarehouse.currentPage}
                    onSearch={medicineWarehouse.setSearch}
                    search={medicineWarehouse.search}
                    searchPlaceholder="Cari gudang..."
                    emptyStateIcon={Archive}
                    emptyStateText="Tidak ada data gudang ditemukan"
                    renderRow={(item) => <MedicineWarehouseRow item={item} canEdit={medicineWarehouse.canEdit}/>}
                    showSearch={true}
                    selectable={medicineWarehouse.canDelete}
                    selectedIds={medicineWarehouse.safeSelectedIds}
                    onToggleOne={medicineWarehouse.toggleOne}
                    onToggleAll={medicineWarehouse.toggleAll}
                    allSelected={medicineWarehouse.allSelected}
                />
            </div>

            {/* Modal Degree: Delete */}
            <Modal
                open={medicineWarehouse.openDeleteModal}
                onOpenChange={medicineWarehouse.setOpenDeleteModal}
                title="Hapus Warehouse"
                description="Tindakan ini tidak dapat dibatalkan. Warehouse akan dihapus permanen."
                onSubmit={() => medicineWarehouse.bulkDeleteMedicineWarehouse(medicineWarehouse.selectedIds)}
                submitText="Hapus Warehouse"
                type="danger"
                isLoading={medicineWarehouse.isLoading}
            >
                <MedicineWarehouseDeleteModalContent medicineWarehouseValue={medicineWarehouse.medicineWarehouseValue}
                                                     selectedIds={medicineWarehouse.selectedIds}
                                                     medicineWarehouses={medicineWarehouse.medicineWarehouses}
                />
            </Modal>
        </>
    )
}

export default MedicineWarehousePage;