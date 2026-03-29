import {Building2, Plus, Stethoscope} from "lucide-react";
import {Button} from "@shared/components/ui/button.jsx";
import DataTable from "@shared/components/common/data-table.jsx";
import {useWardPage} from "@features/facilities/pages/inpatient/ward/components/use-ward.jsx";
import {WardRow} from "@features/facilities/pages/inpatient/ward/components/ward-row.jsx";
import {RoomDeleteModal, RoomModal, WardDeleteModal, WardModal} from "@features/facilities/pages/inpatient/ward/modal/index.jsx";

function WardPage() {
    const {
        ward, room,
        fetchBuildingOptions, fetchDepartmentOptions, fetchRoomTypeOptions,
        expandedRows, toggleExpand,
        registerWard, handleSubmitWard, controlWard, wardErrors, wardSubmitting,
        onWardSubmit,
        registerRoom, handleSubmitRoom, controlRoom, roomErrors, roomSubmitting,
        onRoomSubmit,
        openAddRoom,
    } = useWardPage();

    const renderRow = (w, index) => (
        <WardRow
            key={w.id}
            ward={w}
            index={ward.wards.from + index}
            isExpanded={expandedRows.has(w.id)}
            onToggle={() => toggleExpand(w.id)}
            onEdit={() => ward.setOpenModal(w.id)}
            onDelete={() => ward.setOpenDeleteModal(w.id)}
            onAddRoom={(e) => { e.stopPropagation(); openAddRoom(w.id); }}
            onRoomEdit={(id) => room.setOpenModal(id)}
            onRoomDelete={async (id) => {
                await room.deleteRoom(id);
                await ward.fetchWards({perPage: 20});
            }}
        />
    );

    return (
        <>
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-sm font-semibold text-foreground">Data Ruang Rawat</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Kelola ruang rawat dan ruangan di dalamnya</p>
                </div>
                <Button size="sm" className="gap-1.5 h-8 text-xs bg-teal-600 hover:bg-teal-700 text-white"
                        onClick={() => ward.setOpenModal()}>
                    <Plus className="w-3.5 h-3.5"/> Tambah Ruang Rawat
                </Button>
            </div>

            <DataTable
                title="Tabel Ruang Rawat"
                description="Daftar ruang rawat yang tersedia"
                columns={ward.columns()}
                data={ward.wards?.data || []}
                isLoading={ward.isLoading}
                pagination={ward.wards ? {
                    from: ward.wards.from, to: ward.wards.to, total: ward.wards.total,
                    current_page: ward.wards.current_page, last_page: ward.wards.last_page,
                } : null}
                onPageChange={ward.setCurrentPage}
                currentPage={ward.currentPage}
                onSearch={ward.setSearch}
                search={ward.search}
                searchPlaceholder="Cari ruang rawat..."
                emptyStateIcon={Stethoscope}
                emptyStateText="Tidak ada data ruang rawat ditemukan"
                renderRow={renderRow}
                showSearch={true}
            />

            <WardModal
                open={ward.openModal} onOpenChange={ward.setOpenModal}
                wardValue={ward.wardValue} onSubmit={handleSubmitWard(onWardSubmit)}
                isLoading={wardSubmitting} registerWard={registerWard}
                controlWard={controlWard} wardErrors={wardErrors}
                fetchBuildingOptions={fetchBuildingOptions} fetchDepartmentOptions={fetchDepartmentOptions}
            />
            <WardDeleteModal
                open={ward.openDeleteModal} onOpenChange={ward.setOpenDeleteModal}
                wardValue={ward.wardValue} onSubmit={() => ward.deleteWard(ward.wardValue.id)}
                isLoading={ward.isLoading}
            />
            <RoomModal
                open={room.openModal} onOpenChange={room.setOpenModal}
                roomValue={room.roomValue} onSubmit={handleSubmitRoom(onRoomSubmit)}
                isLoading={roomSubmitting} registerRoom={registerRoom}
                controlRoom={controlRoom} roomErrors={roomErrors}
                fetchRoomTypeOptions={fetchRoomTypeOptions}
            />
            <RoomDeleteModal
                open={room.openDeleteModal} onOpenChange={room.setOpenDeleteModal}
                roomValue={room.roomValue} onSubmit={room.deleteRoom}
                isLoading={room.deleteLoading}
            />
        </>
    );
}

export default WardPage;