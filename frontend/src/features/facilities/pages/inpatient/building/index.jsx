import {Plus, Building2, Trash2} from "lucide-react";
import {Button} from "@shared/components/ui/button.jsx";
import DataTable from "@shared/components/common/data-table.jsx";
import Modal from "@shared/components/common/modal.jsx";
import {BUILDING_COLUMNS} from "@features/facilities/constants/index.js";
import {useBuilding} from "@features/facilities/hooks/useBuilding.js";
import {BuildingRow} from "@features/facilities/components/building/building-row.jsx";
import {
    BuildingDeleteModalContent,
    BuildingModalFormContent
} from "@features/facilities/components/building/modal-content.jsx";

function BuildingPage() {

    const building = useBuilding();
    return (
        <>
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-sm font-semibold text-foreground">Data Gedung</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Kelola data gedung rawat inap</p>
                </div>
                <Button size="sm" className="gap-1.5 h-8 text-xs bg-teal-600 hover:bg-teal-700 text-white"
                        onClick={() => building.setOpenModal()}>
                    <Plus className="w-3.5 h-3.5"/> Tambah Gedung
                </Button>
            </div>


            <div>
                {building.canDelete && building.selectedIds.length > 0 && (
                    <div
                        className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 animate-in transition-all">
                            <span className="text-sm font-medium text-destructive">
                                {building.selectedIds.length} Gedung dipilih
                            </span>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="ml-auto gap-2"
                            onClick={() => building.setOpenDeleteModal()}
                        >
                            <Trash2 className="h-4 w-4"/>
                            Hapus yang Dipilih
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => building.setSelectedIds([])}
                        >
                            Batal
                        </Button>
                    </div>
                )}
                <DataTable
                    title="Tabel Gedung"
                    description="Daftar gedung yang tersedia"
                    columns={BUILDING_COLUMNS}
                    data={building.buildings?.data || []}
                    isLoading={building.isLoading}
                    pagination={building.buildings ? {
                        from: building.buildings.from, to: building.buildings.to, total: building.buildings.total,
                        current_page: building.buildings.current_page, last_page: building.buildings.last_page,
                    } : null}
                    onPageChange={building.setCurrentPage}
                    currentPage={building.currentPage}
                    onSearch={building.setSearch}
                    search={building.search}
                    searchPlaceholder="Cari gedung..."
                    emptyStateIcon={Building2}
                    emptyStateText="Tidak ada data gedung ditemukan"
                    renderRow={(item, index, checkboxCell) => <BuildingRow item={item}
                                                                           expandedRows={building.expandedRows}
                                                                           toggleExpand={building.toggleExpand}
                                                                           setOpenModal={building.setOpenModal}
                                                                           canEdit={building.canEdit}
                                                                           checkboxCell={checkboxCell}
                    />
                    }
                    showSearch={true}
                    selectable={building.canDelete}
                    selectedIds={building.safeSelectedIds}
                    onToggleOne={building.toggleOne}
                    onToggleAll={building.toggleAll}
                    allSelected={building.allSelected}
                />
            </div>

            {/* Modal Tambah / Edit */}
            <Modal
                open={building.openModal} onOpenChange={building.setOpenModal}
                title={building.buildingValue ? "Edit Gedung" : "Tambah Gedung"}
                description={building.buildingValue ? "Ubah informasi gedung" : "Tambahkan gedung baru ke sistem."}
                onSubmit={building.handleSubmit(building.onSubmit)}
                submitText={building.buildingValue ? "Simpan Perubahan" : "Tambah Gedung"}
                isLoading={building.isSubmitting}
            >
                <BuildingModalFormContent register={building.register} errors={building.formState.errors}/>
            </Modal>

            {/* Modal Hapus */}
            <Modal
                open={building.openDeleteModal}
                onOpenChange={building.setOpenDeleteModal}
                title="Hapus Gedung"
                description="Tindakan ini tidak dapat dibatalkan. Gedung akan dihapus permanen."
                onSubmit={() => building.deleteBuilding(building.selectedIds)}
                submitText="Hapus Gedung"
                type="danger"
                isLoading={building.formState.isSubmitting}
            >
                <BuildingDeleteModalContent buildingValue={building.buildingValue}
                                            selectedIds={building.selectedIds}
                                            buildings={building.buildings}
                />
            </Modal>
        </>
    );
}

export default BuildingPage;