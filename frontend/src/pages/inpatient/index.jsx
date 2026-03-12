import {useInpatientAdmissionStore} from "@/store/inpatientAdmissionStore.js";
import {useEffect} from "react";
import Layout from "@/pages/dashboard/layout.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {TableCell, TableRow} from "@/components/ui/table.jsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Plus, Users, BedDouble, LogOut, BanIcon, Thermometer, Heart} from "lucide-react";
import DataTable from "@/components/common/data-table.jsx";

const statusMap = {
    admitted: {label: "Dirawat", variant: "default"},
    discharged: {label: "Pulang", variant: "secondary"},
    cancelled: {label: "Batal", variant: "destructive"},
};

const columns = () => [
    {label: "Pasien", width: "200px"},
    {label: "Dokter"},
    {label: "Tempat Tidur"},
    {label: "Sumber"},
    {label: "Diagnosis"},
    {label: "Vital Sign Terakhir"},
    {label: "Masuk"},
    {label: "Keluar"},
    {label: "Status"},
];

const formatDate = (dateStr) =>
    dateStr
        ? new Date(dateStr).toLocaleDateString("id-ID", {day: "2-digit", month: "short", year: "numeric"})
        : "—";

const latestVitalSign = (vitalSigns = []) =>
    vitalSigns.length > 0
        ? [...vitalSigns].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
        : null;

function InpatientPage() {
    const {
        inpatientAdmissions,
        search,
        currentPage,
        isLoading,
        setSearch,
        setCurrentPage,
        fetchInpatientAdmission,
    } = useInpatientAdmissionStore();

    useEffect(() => {
        fetchInpatientAdmission({perPage: 20});
    }, [search, currentPage]);

    const admissions = inpatientAdmissions?.data || [];

    const stats = [
        {
            title: "Total Pasien",
            value: inpatientAdmissions?.total ?? 0,
            icon: <Users className="h-4 w-4 text-muted-foreground"/>,
        },
        {
            title: "Sedang Dirawat",
            value: admissions.filter((a) => a.status === "admitted").length,
            icon: <BedDouble className="h-4 w-4 text-muted-foreground"/>,
        },
        {
            title: "Pulang",
            value: admissions.filter((a) => a.status === "discharged").length,
            icon: <LogOut className="h-4 w-4 text-muted-foreground"/>,
        },
        {
            title: "Dibatalkan",
            value: admissions.filter((a) => a.status === "cancelled").length,
            icon: <BanIcon className="h-4 w-4 text-muted-foreground"/>,
        },
    ];

    const renderRow = (admission) => {
        const statusCfg = statusMap[admission.status] || statusMap.admitted;
        const vital = latestVitalSign(admission.vital_signs);
        const bedAssignment = admission.bed_assignments?.[0];

        return (
            <TableRow key={admission.id}>

                {/* Pasien */}
                <TableCell>
                    <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-sm">{admission.patient?.full_name || "—"}</span>
                        <span className="text-xs text-muted-foreground">
                            {admission.patient?.medical_record_number || "—"}
                        </span>
                    </div>
                </TableCell>

                {/* Dokter */}
                <TableCell>
                    <span className="text-sm text-muted-foreground">
                        {admission.doctor?.name || "—"}
                    </span>
                </TableCell>

                {/* Tempat Tidur */}
                <TableCell>
                    {bedAssignment?.bed ? (
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium">
                                {bedAssignment.bed.bed_number}
                            </span>
                            <Badge variant="outline" className="text-xs w-fit">
                                {bedAssignment.released_at ? "Selesai" : "Aktif"}
                            </Badge>
                        </div>
                    ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                    )}
                </TableCell>

                {/* Sumber */}
                <TableCell>
                    <span className="text-sm text-muted-foreground">
                        {admission.admission_source || "—"}
                    </span>
                </TableCell>

                {/* Diagnosis */}
                <TableCell className="max-w-[180px]">
                    <span className="text-sm text-muted-foreground line-clamp-2">
                        {admission.diagnosis || "—"}
                    </span>
                </TableCell>

                {/* Vital Sign Terakhir */}
                <TableCell>
                    {vital ? (
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Thermometer className="h-3 w-3"/>
                                {vital.temperature}°C
                            </span>
                            <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3"/>
                                {vital.systolic}/{vital.diastolic} mmHg · {vital.pulse_rate} bpm
                            </span>
                        </div>
                    ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                    )}
                </TableCell>

                {/* Masuk */}
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(admission.admitted_at)}
                </TableCell>

                {/* Keluar */}
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(admission.discharged_at)}
                </TableCell>

                {/* Status */}
                <TableCell>
                    <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                </TableCell>

            </TableRow>
        );
    };

    return (
        <Layout>
            <div className="p-6 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Rawat Inap</h1>
                        <p className="text-sm text-muted-foreground">
                            Manajemen admisi & monitoring pasien rawat inap
                        </p>
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4"/>
                        Admisi Baru
                    </Button>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                {stat.icon}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* DataTable */}
                <DataTable
                    title="Daftar Admisi"
                    description="Data pasien rawat inap beserta status dan informasi perawatan"
                    columns={columns()}
                    data={admissions}
                    isLoading={isLoading}
                    pagination={inpatientAdmissions ? {
                        from: inpatientAdmissions.from,
                        to: inpatientAdmissions.to,
                        total: inpatientAdmissions.total,
                        current_page: inpatientAdmissions.current_page,
                        last_page: inpatientAdmissions.last_page,
                    } : null}
                    onPageChange={setCurrentPage}
                    currentPage={currentPage}
                    onSearch={setSearch}
                    search={search}
                    searchPlaceholder="Cari pasien, dokter, diagnosis..."
                    emptyStateIcon={BedDouble}
                    emptyStateText="Tidak ada data admisi rawat inap"
                    renderRow={renderRow}
                    showSearch={true}
                />

            </div>
        </Layout>
    );
}

export default InpatientPage;