import {useAppointmentStore} from "@features/appointment";
import {useEffect} from "react";
import Layout from "@features/dashboard/pages/layout.jsx";
import {Button} from "@shared/components/ui/button.jsx";
import {Badge} from "@shared/components/ui/badge.jsx";
import {TableCell, TableRow} from "@shared/components/ui/table.jsx";
import {Card, CardContent, CardHeader, CardTitle} from "@shared/components/ui/card.jsx";
import {
    CirclePlus, CalendarDays, Clock, CheckCircle2, XCircle, ArrowRightLeft,
} from "lucide-react";
import DataTable from "@shared/components/common/data-table.jsx";
import {Link, useNavigate} from "@tanstack/react-router";
import {
    APPOINTMENT_ADVANCED_STATUS,
    APPOINTMENT_COLUMNS, APPOINTMENT_REGISTRATION_STATUS_LABEL,
    APPOINTMENT_STATUS_CONFIG
} from "@features/appointment/constants/index.js";
import {formatDateTime} from "@features/appointment/helpers/index.js";



// ── Component ────────────────────────────────────────────────────────────────
function AppointmentPage() {
    const {
        appointments,
        search,
        currentPage,
        isLoading,
        setSearch,
        setCurrentPage,
        fetchAppointments,
    } = useAppointmentStore();


    useEffect(() => {
        fetchAppointments({perPage: 20});
    }, [search, currentPage]);


    const stats = [
        {
            title: "Total Kunjungan",
            value: appointments?.total ?? 0,
            icon: <CalendarDays className="h-4 w-4 text-muted-foreground"/>,
        },
        {
            title: "Belum Dilayani",
            value: appointments?.data.filter((a) => a.status === "not_yet").length,
            icon: <Clock className="h-4 w-4 text-muted-foreground"/>,
        },
        {
            title: "Sudah Dilayani",
            value: appointments?.data.filter((a) => a.status === "already").length,
            icon: <CheckCircle2 className="h-4 w-4 text-muted-foreground"/>,
        },
        {
            title: "Dibatalkan",
            value: appointments?.data.filter((a) => a.status === "canceled").length,
            icon: <XCircle className="h-4 w-4 text-muted-foreground"/>,
        },
    ];

    const navigate = useNavigate();

    const renderRow = (appointment) => {
        const statusCfg = APPOINTMENT_STATUS_CONFIG[appointment.status] || APPOINTMENT_STATUS_CONFIG.not_yet;
        const advancedStatusCfg = APPOINTMENT_ADVANCED_STATUS[appointment.advanced_status] || APPOINTMENT_ADVANCED_STATUS.outpatient;

        return (
            <TableRow
                key={appointment.id}
                onClick={() => navigate({to: `/appointments/${appointment.id}`})}
                className="hover:cursor-pointer"
            >
                {/* No. Kunjungan */}
                <TableCell>
                    <span className="font-mono text-xs text-muted-foreground">
                        {appointment.visit_number || "—"}
                    </span>
                </TableCell>

                {/* Pasien */}
                <TableCell>
                    <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-sm">
                            {appointment.patient?.full_name || "—"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {appointment.patient.emr || "—"}
                        </span>
                    </div>
                </TableCell>

                {/* Tanggal & Jam */}
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDateTime(appointment.date)}
                </TableCell>

                {/* Penjamin */}
                <TableCell>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm text-muted-foreground">
                            {appointment.guarantor_name || "—"}
                        </span>
                        {appointment.guarantor_relationship && (
                            <span className="text-xs text-muted-foreground">
                                {appointment.guarantor_relationship}
                            </span>
                        )}
                    </div>
                </TableCell>

                {/* Jenis Kunjungan */}
                <TableCell>
                    <Badge variant={advancedStatusCfg.variant}>
                        {advancedStatusCfg.label}
                    </Badge>
                </TableCell>

                {/* Status Daftar */}
                <TableCell className="text-sm text-muted-foreground">
                    {APPOINTMENT_REGISTRATION_STATUS_LABEL[appointment.registration_status] ?? "—"}
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
                        <h1 className="text-2xl font-semibold tracking-tight">Pendaftaran</h1>
                        <p className="text-sm text-muted-foreground">
                            Manajemen registrasi & kunjungan pasien
                        </p>
                    </div>
                    <Button asChild>
                        <Link to="/appointments/create">
                            <CirclePlus/>
                            Daftar Baru
                        </Link>
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
                    title="Daftar Kunjungan"
                    description="Data registrasi kunjungan pasien rawat jalan dan rawat inap"
                    columns={APPOINTMENT_COLUMNS}
                    data={appointments?.data}
                    isLoading={isLoading}
                    pagination={
                        appointments
                            ? {
                                from: appointments?.meta?.from,
                                to: appointments?.meta?.to,
                                total: appointments?.meta?.total,
                                current_page: appointments?.meta?.current_page,
                                last_page: appointments?.meta?.last_page,
                            }
                            : null
                    }
                    onPageChange={setCurrentPage}
                    currentPage={currentPage}
                    onSearch={setSearch}
                    search={search}
                    searchPlaceholder="Cari no. kunjungan, nama pasien, penjamin..."
                    emptyStateIcon={ArrowRightLeft}
                    emptyStateText="Tidak ada data pendaftaran kunjungan"
                    renderRow={renderRow}
                    showSearch={true}
                />

            </div>
        </Layout>
    );
}

export default AppointmentPage;
