import {Building2, Plus, Stethoscope} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import DataTable from "@/components/common/data-table.jsx";
import {useWardPage} from "@/pages/facilities/inpatient/ward/components/use-ward.jsx";
import {WardRow} from "@/pages/facilities/inpatient/ward/components/ward-row.jsx";
import {
    RoomDeleteModal, RoomDetailModal,
    RoomModal,
    WardDeleteModal,
    WardModal
} from "@/pages/facilities/inpatient/ward/modal/index.jsx";

function WardPage() {
    const {
        ward, room,
        fetchBuildingOptions, fetchDepartmentOptions, fetchRoomTypeOptions,
        expandedRows, toggleExpand,
        registerWard,
        handleSubmitWard,
        controlWard,
        wardErrors,
        wardSubmitting,
        onWardSubmit,
        registerRoom,
        handleSubmitRoom,
        controlRoom,
        roomErrors,
        roomSubmitting,
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
            onAddRoom={(e) => {
                e.stopPropagation();
                openAddRoom(w.id);
            }}
            onRoomDetail={(r) => room.setRoomDetailModal(r.id)}
            onRoomEdit={(id) => room.setOpenModal(id)}
            onRoomDelete={async (id) => {
                await room.deleteRoom(id);
                await ward.fetchWards({perPage: 20});
            }}
        />
    );

    return (
        <>
            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5">
                            <Building2 className="w-6 h-6 text-primary"/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-teal-500">Data Ruang Rawat</h1>
                            <p className="text-sm text-muted-foreground mt-1">Kelola Ruang Rawat</p>
                        </div>
                    </div>
                </div>
                <Button className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                        onClick={() => ward.setOpenModal()} size="lg">
                    <Plus className="w-4 h-4"/> Tambah Ruang Rawat
                </Button>
            </div>

            {/* ── DataTable ── */}
            <DataTable
                title="Tabel Ruang Rawat"
                description="Daftar ruang rawat yang tersedia"
                columns={ward.columns()}
                data={ward.wards?.data || []}
                isLoading={ward.isLoading}
                pagination={ward.wards ? {
                    from: ward.wards.from, to: ward.wards.to,
                    total: ward.wards.total, current_page: ward.wards.current_page,
                    last_page: ward.wards.last_page,
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

            {/* ── Modals ── */}
            <RoomDetailModal
                open={!!room.openRoomDetailModal}
                onOpenChange={room.setRoomDetailModal}
                roomValue={room.roomValue}
            />

            <WardModal
                open={ward.openModal}
                onOpenChange={ward.setOpenModal}
                wardValue={ward.wardValue}
                onSubmit={handleSubmitWard(onWardSubmit)}
                isLoading={wardSubmitting}
                registerWard={registerWard}
                controlWard={controlWard}
                wardErrors={wardErrors}
                fetchBuildingOptions={fetchBuildingOptions}
                fetchDepartmentOptions={fetchDepartmentOptions}
            />
            <WardDeleteModal
                open={ward.openDeleteModal}
                onOpenChange={ward.setOpenDeleteModal}
                wardValue={ward.wardValue}
                onSubmit={() => ward.deleteWard(ward.wardValue.id)}
                isLoading={ward.isLoading}
            />

            <RoomModal
                open={room.openModal}
                onOpenChange={room.setOpenModal}
                roomValue={room.roomValue}
                onSubmit={handleSubmitRoom(onRoomSubmit)}
                isLoading={roomSubmitting}
                registerRoom={registerRoom}
                controlRoom={controlRoom}
                roomErrors={roomErrors}
                fetchRoomTypeOptions={fetchRoomTypeOptions}
            />

            <RoomDeleteModal
                open={room.openDeleteModal}
                onOpenChange={room.setOpenDeleteModal}
                roomValue={room.roomValue}
                onSubmit={room.deleteRoom}
                isLoading={room.deleteLoading}
            />
        </>
    );
}

export default WardPage;