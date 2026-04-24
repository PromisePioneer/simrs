import SettingPage from "@features/settings/pages/index.jsx";
import {usePatientStore} from "@features/patients";
import {
    UserRoundCog,
    Plus,
    Activity,
} from "lucide-react";
import {Button} from "@shared/components/ui/button.jsx";
import {useEffect} from "react";
import DataTable from "@shared/components/common/data-table.jsx";
import {Link} from "@tanstack/react-router";
import {PatientRow} from "@features/patients/pages/components/patient-row.jsx";
import {PATIENT_COLUMNS} from "@features/patients/constants/index.js";

function PatientPage() {

    const {
        isLoading,
        fetchPatients,
        patients,
        currentPage,
        setCurrentPage,
        setOpenModal,
        search,
        setSearch,
    } = usePatientStore();

    useEffect(() => {
        fetchPatients({perPage: 20});
    }, [currentPage, search]);

    const renderRow = (patient, index) => {
        return (
            <PatientRow key={patient.id} patients={patients} patient={patient} index={index}/>
        );
    };

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
                    <DataTable
                        title="Data Pasien"
                        description="Kelola dan atur data pasien"
                        columns={PATIENT_COLUMNS}
                        data={patients?.data || []}
                        isLoading={isLoading}
                        pagination={patients ? {
                            from: patients.meta?.from,
                            to: patients.meta?.to,
                            total: patients.meta?.total,
                            current_page: patients.meta?.current_page,
                            last_page: patients.meta?.last_page
                        } : null}
                        onPageChange={setCurrentPage}
                        currentPage={currentPage}
                        onSearch={setSearch}
                        search={search}
                        searchPlaceholder="Cari nama pasien, nomor rekam medis..."
                        emptyStateIcon={UserRoundCog}
                        emptyStateText="Belum ada data pasien"
                        renderRow={renderRow}
                        showSearch={true}
                    />
                </div>
            </SettingPage>
        </>
    );
}

export default PatientPage;