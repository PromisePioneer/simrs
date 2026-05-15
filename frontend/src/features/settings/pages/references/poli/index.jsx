import {useForm} from "react-hook-form";
import {useEffect} from "react";
import {TableCell, TableRow} from "@shared/components/ui/table.jsx";
import {Award, Pencil, Plus, Trash2} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@shared/components/ui/tooltip.jsx";
import {Button} from "@shared/components/ui/button.jsx";
import DataTable from "@shared/components/common/data-table.jsx";
import Modal from "@shared/components/common/modal.jsx";
import {Label} from "@shared/components/ui/label.jsx";
import {Input} from "@shared/components/ui/input.jsx";
import {usePoliStore} from "@features/settings";
import {POLI_COLUMNS} from "@features/settings/pages/constants/index.js";
import {usePoli} from "@features/settings/pages/hooks/usePoli.js";
import {PoliDeleteModalContent, PoliModalFormContent} from "@features/settings/pages/components/poli/modal-content.jsx";
import {PoliRow} from "@features/settings/pages/components/poli/poli-row.jsx";

function PoliPage() {
    const poli = usePoli();


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
                                Data Poli
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Kelola Manajemen Poli
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                    onClick={poli.setOpenModal}
                    size="lg"
                >
                    <Plus className="w-4 h-4"/> Tambah Poli
                </Button>
            </div>


            <div>
                {poli.canDelete && poli.selectedIds.length > 0 && (
                    <div
                        className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 animate-in transition-all">
                            <span className="text-sm font-medium text-destructive">
                                {poli.selectedIds.length} Gelar dipilih
                            </span>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="ml-auto gap-2"
                            onClick={() => poli.setOpenDeleteModal()}
                        >
                            <Trash2 className="h-4 w-4"/>
                            Hapus yang Dipilih
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => poli.setSelectedIds([])}
                        >
                            Batal
                        </Button>
                    </div>
                )}
                <DataTable
                    title="Tabel Poli"
                    description="Daftar Poli yang tersedia"
                    columns={POLI_COLUMNS}
                    data={poli.poliData?.data || []}
                    isLoading={poli.isLoading}
                    pagination={poli.poliData ? {
                        from: poli.poliData.meta?.from, to: poli.poliData.meta?.to, total: poli.poliData.meta?.total,
                        current_page: poli.poliData.meta?.current_page, last_page: poli.poliData.meta?.last_page
                    } : null}
                    onPageChange={poli.setCurrentPage}
                    currentPage={poli.currentPage}
                    onSearch={poli.setSearch}
                    search={poli.search}
                    searchPlaceholder="Cari Poli..."
                    emptyStateIcon={Award}
                    emptyStateText="Tidak ada data Poli ditemukan"
                    renderRow={(item) => <PoliRow item={item} canEdit={poli.canEdit} setOpenModal={poli.setOpenModal}/>}
                    showSearch={true}
                    selectable={poli.canDelete}
                    selectedIds={poli.safeSelectedIds}
                    onToggleOne={poli.toggleOne}
                    onToggleAll={poli.toggleAll}
                    allSelected={poli.allSelected}
                />

            </div>

            <Modal
                open={poli.openModal}
                onOpenChange={poli.setOpenModal}
                title={poli.poliValue ? "Edit Lembaga Pendaftaran" : "Create New Lembaga Pendaftaran"}
                description={poli.poliValue ? "Update cashier method information" : "Add a new cashier method to your system"}
                onSubmit={poli.handleSubmit(poli.onSubmit)}
                submitText={poli.institutionValue ? "Update Lembaga Pendaftaran" : "Create Lembaga Pendaftaran"}
                isLoading={poli.formState.isSubmitting}
            >
                <PoliModalFormContent register={poli.register} errors={poli.formState.errors}/>
            </Modal>

            {/* Modal: Delete */}
            <Modal
                open={poli.openDeleteModal}
                onOpenChange={poli.setOpenDeleteModal}
                title="Hapus Poli"
                description="Tindakan ini tidak dapat dibatalkan. Poli akan dihapus permanen."
                onSubmit={() => poli.bulkDeletePoli(poli.selectedIds)}
                submitText="Hapus Poli"
                type="danger"
                isLoading={poli.formState.isSubmitting}
            >
                <PoliDeleteModalContent poliValue={poli.poliValue}
                                        poliData={poli.poliData}
                                        selectedIds={poli.selectedIds}
                />
            </Modal>
        </>
    )
}


export default PoliPage;