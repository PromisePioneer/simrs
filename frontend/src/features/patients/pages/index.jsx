import SettingPage from "@features/settings/pages/index.jsx";
import {
    UserRoundCog,
    Plus,
    Activity, Trash2,
} from "lucide-react";
import {Button} from "@shared/components/ui/button.jsx";
import DataTable from "@shared/components/common/data-table.jsx";
import {Link} from "@tanstack/react-router";
import {PatientRow} from "@features/patients/pages/components/patient-row.jsx";
import {PATIENT_COLUMNS} from "@features/patients/constants/index.js";
import {usePatient} from "@features/patients/hooks/usePatient.js";
import Modal from "@shared/components/common/modal.jsx";
import {PatientDeleteModalContent} from "@features/patients/components/modal-content.jsx";

function PatientPage() {
    const patient = usePatient();
    return (
        <>
            <SettingPage>
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-4">
                            <div
                                className="flex items-center justify-center w-14 h-14 rounded-xl bg-teal-500 shadow-lg shadow-teal-500/30">
                                <UserRoundCog className="w-7 h-7 text-white"/>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                    Manajemen Pasien
                                </h1>
                                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                                    <Activity className="w-4 h-4"/>
                                    Kelola data dan riwayat pasien
                                </p>
                            </div>
                        </div>
                    </div>
                    <Link to="/settings/patients/create">
                        <Button
                            className="flex items-center gap-2 bg-teal-500 hover:to-teal-800 shadow-lg shadow-teal-500/30 hover:shadow-xl transition-all duration-300"
                            onClick={() => setOpenModal(true)}
                            size="lg"
                        >
                            <Plus className="w-5 h-5"/>
                            Tambah Pasien Baru
                        </Button>
                    </Link>
                </div>


                {/* Data Table */}
                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {patient.canDelete && patient.selectedIds.length > 0 && (
                        <div
                            className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 animate-in transition-all">
                            <span className="text-sm font-medium text-destructive">
                                {patient.selectedIds.length} Pasien dipilih
                            </span>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="ml-auto gap-2"
                                onClick={() => patient.setOpenDeleteModal()}
                            >
                                <Trash2 className="h-4 w-4"/>
                                Hapus yang Dipilih
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => patient.setSelectedIds([])}
                            >
                                Batal
                            </Button>
                        </div>
                    )}
                    <DataTable
                        title="Data Pasien"
                        description="Kelola dan atur data pasien"
                        columns={PATIENT_COLUMNS}
                        data={patient.patients?.data || []}
                        isLoading={patient.isLoading}
                        pagination={patient.patients ? {
                            from: patient.patients.meta?.from,
                            to: patient.patients.meta?.to,
                            total: patient.patients.meta?.total,
                            current_page: patient.patients.meta?.current_page,
                            last_page: patient.patients.meta?.last_page
                        } : null}
                        onPageChange={patient.setCurrentPage}
                        currentPage={patient.currentPage}
                        onSearch={patient.setSearch}
                        search={patient.search}
                        searchPlaceholder="Cari nama pasien, nomor rekam medis..."
                        emptyStateIcon={UserRoundCog}
                        emptyStateText="Belum ada data pasien"
                        renderRow={(item, index, checkboxCell) =>
                            <PatientRow item={item} canEdit={patient.canEdit} checkboxCell={checkboxCell}/>
                        }
                        showSearch={true}
                        selectable={patient.canDelete}
                        selectedIds={patient.safeSelectedIds}
                        onToggleOne={patient.toggleOne}
                        onToggleAll={patient.toggleAll}
                        allSelected={patient.allSelected}
                    />
                </div>


                <Modal
                    open={patient.openDeleteModal}
                    onOpenChange={patient.setOpenDeleteModal}
                    title="Hapus Poli"
                    description="Tindakan ini tidak dapat dibatalkan. Poli akan dihapus permanen."
                    onSubmit={() => patient.bulkDeletePatient(patient.selectedIds)}
                    submitText="Hapus Poli"
                    type="danger"
                    isLoading={patient.isLoading}
                >

                    <PatientDeleteModalContent patientValue={patient.patientValue}
                                               selectedIds={patient.selectedIds}
                                               patients={patient.patients}
                    />

                </Modal>
            </SettingPage>
        </>
    );
}

export default PatientPage;