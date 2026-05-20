import {Plus, Trash2, Archive, Award} from "lucide-react";
import {Button} from "@shared/components/ui/button.jsx";
import DataTable from "@shared/components/common/data-table.jsx";
import Modal from "@shared/components/common/modal.jsx";
import {Link} from "@tanstack/react-router";
import {MEDICINE_COLUMNS} from "@features/medicine";
import {MedicineRow} from "@features/medicine/components/medicine/medicine-row.jsx";
import {useMedicineIndex} from "@features/medicine/hooks/useMedicineIndex.js";
import {
    MedicineDeleteModalContent
} from "@features/medicine/components/medicine/modal-content.jsx";

function MedicinePage() {
    const medicine = useMedicineIndex();
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
                                Data Obat
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Kelola data obat
                            </p>
                        </div>
                    </div>
                </div>

                <Button
                    className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                    size="lg" asChild
                >
                    <Link to="/pharmacy/medicine/create">
                        <Plus className="w-4 h-4"/> Tambah Obat
                    </Link>
                </Button>
            </div>

            <div>
                {medicine.canDelete && medicine.selectedIds.length > 0 && (
                    <div
                        className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 animate-in transition-all">
                            <span className="text-sm font-medium text-destructive">
                                {medicine.selectedIds.length} Obat dipilih
                            </span>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="ml-auto gap-2"
                            onClick={() => medicine.setOpenDeleteModal()}
                        >
                            <Trash2 className="h-4 w-4"/>
                            Hapus yang Dipilih
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => medicine.setSelectedIds([])}
                        >
                            Batal
                        </Button>
                    </div>
                )}
                <DataTable
                    title="Tabel Obat"
                    description="Daftar Obat yang dijual"
                    columns={MEDICINE_COLUMNS}
                    data={medicine.medicines?.data || []}
                    isLoading={medicine.isLoading}
                    pagination={medicine.medicines ? {
                        from: medicine.medicines.from, to: medicine.medicines.to, total: medicine.medicines.total,
                        current_page: medicine.medicines.current_page, last_page: medicine.medicines.last_page
                    } : null}
                    onPageChange={medicine.setCurrentPage}
                    currentPage={medicine.currentPage}
                    onSearch={medicine.setSearch}
                    search={medicine.search}
                    searchPlaceholder="Cari obat..."
                    emptyStateIcon={Archive}
                    emptyStateText="Tidak ada daftar obat ditemukan"
                    renderRow={(item) => <MedicineRow item={item} canEdit={medicine.canEdit}/>}
                    showSearch={true}
                    selectable={medicine.canDelete}
                    selectedIds={medicine.safeSelectedIds}
                    onToggleOne={medicine.toggleOne}
                    onToggleAll={medicine.toggleAll}
                    allSelected={medicine.allSelected}
                />
            </div>

            {/* Modal Degree: Delete */}
            <Modal
                open={medicine.openDeleteModal}
                onOpenChange={medicine.setOpenDeleteModal}
                title="Hapus Obat"
                description="Tindakan ini tidak dapat dibatalkan. Obat akan dihapus permanen."
                onSubmit={() => medicine.bulkDeleteMedicine(medicine.selectedIds)}
                submitText="Hapus Obat"
                type="danger"
                isLoading={medicine.isLoading}
            >
                <MedicineDeleteModalContent medicineValue={medicine.medicineValue}
                                            selectedIds={medicine.selectedIds}
                                            medicines={medicine.medicines}
                />
            </Modal>
        </>
    )
}

export default MedicinePage;