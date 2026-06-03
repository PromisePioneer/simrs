import {MirrorRectangular, Plus, Trash2} from "lucide-react";
import {Button} from "@shared/components/ui/button.jsx";
import DataTable from "@shared/components/common/data-table.jsx";
import Modal from "@shared/components/common/modal.jsx";

import {ROOM_TYPE_COLUMNS} from "@features/settings/pages/constants/index.js";
import {useRoomType} from "@features/settings/pages/hooks/useRoomType.js";
import {
    RoomTypeDeleteModalContent,
    RoomTypeModalFormContent
} from "@features/settings/pages/components/room-type/modal-content.jsx";
import {RoomTypeRow} from "@features/settings/pages/components/room-type/room-type-row.jsx";

function RoomTypePage() {

    const roomType = useRoomType();

    return (
        <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5">
                            <MirrorRectangular className="w-6 h-6 text-primary"/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-teal-500">
                                Data Tipe Ruangan
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Kelola Manajemen Tipe Ruangan & Tarif Rawat Inap
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => setOpenModal()}
                    size="lg"
                >
                    <Plus className="w-4 h-4"/> Tambah Tipe Ruangan
                </Button>
            </div>

            {/* Table */}
            <div>

                {roomType.canDelete && roomType.selectedIds.length > 0 && (
                    <div
                        className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 animate-in transition-all">
                            <span className="text-sm font-medium text-destructive">
                                {roomType.selectedIds.length} Gelar dipilih
                            </span>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="ml-auto gap-2"
                            onClick={() => roomType.setOpenDeleteModal()}
                        >
                            <Trash2 className="h-4 w-4"/>
                            Hapus yang Dipilih
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => roomType.setSelectedIds([])}
                        >
                            Batal
                        </Button>
                    </div>
                )}
                <DataTable
                    title="Tabel Tipe Ruangan"
                    description="Daftar Tipe Ruangan beserta tarif per malam"
                    columns={ROOM_TYPE_COLUMNS}
                    data={roomType.roomTypes?.data || []}
                    isLoading={roomType.isLoading}
                    pagination={roomType.roomTypes ? {
                        from: roomType.roomTypes.meta?.from,
                        to: roomType.roomTypes.meta?.to,
                        total: roomType.roomTypes.meta?.total,
                        current_page: roomType.roomTypes.meta?.current_page,
                        last_page: roomType.roomTypes.meta?.last_page,
                    } : null}
                    onPageChange={roomType.setCurrentPage}
                    currentPage={roomType.currentPage}
                    onSearch={roomType.setSearch}
                    search={roomType.search}
                    searchPlaceholder="Cari Tipe Ruangan..."
                    emptyStateIcon={MirrorRectangular}
                    emptyStateText="Tidak ada data Tipe Ruangan ditemukan"
                    renderRow={(item, index, checkboxCell) =>
                        <RoomTypeRow item={item}
                                     checkboxCell={checkboxCell}
                                     canEdit={roomType.canEdit}
                                     setOpenModal={roomType.setOpenModal}
                        />
                    }
                    showSearch={true}
                    selectable={roomType.canDelete}
                    selectedIds={roomType.safeSelectedIds}
                    onToggleOne={roomType.toggleOne}
                    onToggleAll={roomType.toggleAll}
                    allSelected={roomType.allSelected}
                />

            </div>
            {/* Create / Edit Modal */}
            <Modal
                open={roomType.openModal}
                onOpenChange={roomType.setOpenModal}
                title={roomType.roomTypeValue ? "Edit Tipe Ruangan" : "Tambah Tipe Ruangan"}
                description={roomType.roomTypeValue ? "Ubah informasi Tipe Ruangan" : "Tambahkan Tipe Ruangan baru ke sistem."}
                onSubmit={roomType.handleSubmit(roomType.onSubmit)}
                submitText={roomType.roomTypeValue ? "Simpan Perubahan" : "Tambah Tipe Ruangan"}
                isLoading={roomType.formState.isSubmitting}
            >
                <RoomTypeModalFormContent register={roomType.register} isLoading={roomType.isLoading}
                                          errors={roomType.formState.errors}/>
            </Modal>

            {/* Delete Modal */}
            <Modal
                open={roomType.openDeleteModal}
                onOpenChange={roomType.setOpenDeleteModal}
                title="Hapus Tipe ruangan"
                description="Tindakan ini tidak dapat dibatalkan. Tipe ruangan akan dihapus permanen."
                onSubmit={() => roomType.bulkDeleteRoomType(roomType.selectedIds)}
                submitText="Hapus Tipe ruangan"
                type="danger"
                isLoading={roomType.formState.isSubmitting}
            >
                <RoomTypeDeleteModalContent roomTypeValue={roomType.roomTypeValue}
                                            selectedIds={roomType.selectedIds}
                                            roomTypes={roomType.roomTypes}/>
            </Modal>
        </>
    );
}

export default RoomTypePage;
