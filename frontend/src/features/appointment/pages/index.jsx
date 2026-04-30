import {useAppointmentStore} from "@features/appointment";
import {useEffect, useState} from "react";
import Layout from "@features/dashboard/pages/layout.jsx";
import {Button} from "@shared/components/ui/button.jsx";
import {Badge} from "@shared/components/ui/badge.jsx";
import {TableCell} from "@shared/components/ui/table.jsx";
import {Card, CardContent, CardHeader, CardTitle} from "@shared/components/ui/card.jsx";
import {
    CirclePlus, CalendarDays, Clock, CheckCircle2, XCircle,
    ArrowRightLeft, Trash2, Pencil, Loader2, CalendarIcon, X
} from "lucide-react";
import DataTable from "@shared/components/common/data-table.jsx";
import {Link, useNavigate} from "@tanstack/react-router";
import {
    APPOINTMENT_ADVANCED_STATUS,
    APPOINTMENT_COLUMNS,
    APPOINTMENT_REGISTRATION_STATUS_LABEL,
    APPOINTMENT_STATUS_CONFIG,
} from "@features/appointment/constants/index.js";
import {formatDateTime} from "@features/appointment/helpers/index.js";
import {useAuthStore} from "@features/auth";           // adjust to your auth store path
import {toast} from "sonner";
import {Calendar} from "@shared/components/ui/calendar.jsx";
import {format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subMonths,} from "date-fns";
import {id} from "date-fns/locale";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@shared/components/ui/alert-dialog.jsx";
import {PERMISSIONS} from "@shared/constants/index.js";
import {usePermission} from "@shared/hooks/index.js";
import {Popover, PopoverContent, PopoverTrigger} from "@shared/components/ui/popover.jsx";

function AppointmentPage() {
    const {
        appointments,
        search,
        currentPage,
        isLoading,
        isDeleting,
        selectedIds,
        openDeleteModal,

        setOpenDeleteModal,
        setSelectedIds,
        setIsDeleting,
        setSearch,
        setCurrentPage,
        fetchAppointments,
        bulkDeleteAppointments,
    } = useAppointmentStore();

    const {hasPermission} = usePermission();
    const canCreate = hasPermission(PERMISSIONS.APPOINTMENT.CREATE);
    const canEdit = hasPermission(PERMISSIONS.APPOINTMENT.EDIT);
    const canDelete = hasPermission(PERMISSIONS.APPOINTMENT.DELETE);

    const navigate = useNavigate();

    // ── Multi-select state ──────────────────────────────────────────────────
    const allIds = appointments?.data?.map((a) => a.id) ?? [];
    const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));
    const someSelected = selectedIds.length > 0 && !allSelected;
    const safeSelectedIds = Array.isArray(selectedIds) ? selectedIds : [];


    const toggleAll = () =>
        setSelectedIds(allSelected ? [] : allIds);

    const toggleOne = (id) =>
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );

    // Reset selection when page / search changes
    useEffect(() => {
        setSelectedIds([]);
        fetchAppointments({perPage: 20});
    }, [search, currentPage]);

    // ── Bulk delete ─────────────────────────────────────────────────────────
    const handleBulkDelete = async () => {
        setIsDeleting(true);
        try {
            await bulkDeleteAppointments(selectedIds);
            toast.success(`${selectedIds.length} pendaftaran berhasil dihapus.`);
            setSelectedIds([]);
        } catch (err) {
            const msg = err?.response?.data?.message || "Gagal menghapus pendaftaran.";
            toast.error(msg);
        } finally {
            setIsDeleting(false);
            setOpenDeleteModal(false);
        }
    };

    // ── Stats ───────────────────────────────────────────────────────────────
    const stats = [
        {
            title: "Total Kunjungan",
            value: appointments?.total ?? 0,
            icon: <CalendarDays className="h-4 w-4 text-muted-foreground"/>,
        },
        {
            title: "Belum Dilayani",
            value: appointments?.data?.filter((a) => a.status === "not_yet").length ?? 0,
            icon: <Clock className="h-4 w-4 text-muted-foreground"/>,
        },
        {
            title: "Sudah Dilayani",
            value: appointments?.data?.filter((a) => a.status === "already").length ?? 0,
            icon: <CheckCircle2 className="h-4 w-4 text-muted-foreground"/>,
        },
        {
            title: "Dibatalkan",
            value: appointments?.data?.filter((a) => a.status === "canceled").length ?? 0,
            icon: <XCircle className="h-4 w-4 text-muted-foreground"/>,
        },
    ];

    // ── Row renderer ─────────────────────────────────────────────────────────
    const renderRow = (appointment) => {
        const statusCfg = APPOINTMENT_STATUS_CONFIG[appointment.status] ?? APPOINTMENT_STATUS_CONFIG.not_yet;
        const advancedStatusCfg = APPOINTMENT_ADVANCED_STATUS[appointment.advanced_status] ?? APPOINTMENT_ADVANCED_STATUS.outpatient;

        return (
            <>
                <TableCell
                    className="hover:cursor-pointer"
                    onClick={() => canEdit && navigate({to: `/appointments/${appointment.id}`})}
                >
                <span className="font-mono text-xs text-muted-foreground">
                    {appointment.visit_number || "—"}
                </span>
                </TableCell>

                <TableCell
                    className="hover:cursor-pointer"
                    onClick={() => navigate({to: `/appointments/${appointment.id}`})}
                >
                    <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-sm">{appointment.patient?.full_name || "—"}</span>
                        <span className="text-xs text-muted-foreground">{appointment.patient?.emr || "—"}</span>
                    </div>
                </TableCell>

                <TableCell
                    className="text-sm text-muted-foreground whitespace-nowrap hover:cursor-pointer"
                    onClick={() => navigate({to: `/appointments/${appointment.id}`})}
                >
                    {formatDateTime(appointment.date)}
                </TableCell>

                <TableCell
                    className="hover:cursor-pointer"
                    onClick={() => navigate({to: `/appointments/${appointment.id}`})}
                >
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm text-muted-foreground">{appointment.guarantor_name || "—"}</span>
                        {appointment.guarantor_relationship && (
                            <span className="text-xs text-muted-foreground">{appointment.guarantor_relationship}</span>
                        )}
                    </div>
                </TableCell>

                <TableCell
                    className="hover:cursor-pointer"
                    onClick={() => navigate({to: `/appointments/${appointment.id}`})}
                >
                    <Badge variant={advancedStatusCfg.variant}>{advancedStatusCfg.label}</Badge>
                </TableCell>

                <TableCell
                    className="text-sm text-muted-foreground hover:cursor-pointer"
                    onClick={() => navigate({to: `/appointments/${appointment.id}`})}
                >
                    {APPOINTMENT_REGISTRATION_STATUS_LABEL[appointment.registration_status] ?? "—"}
                </TableCell>

                <TableCell
                    className="hover:cursor-pointer"
                    onClick={() => navigate({to: `/appointments/${appointment.id}`})}
                >
                    <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                </TableCell>
            </>
        );
    };


    const [dateRange, setDateRange] = useState({from: null, to: null});

    const presets = [
        {label: "Hari ini", range: {from: new Date(), to: new Date()}},
        {label: "Kemarin", range: {from: subDays(new Date(), 1), to: subDays(new Date(), 1)}},
        {label: "7 hari terakhir", range: {from: subDays(new Date(), 6), to: new Date()}},
        {label: "30 hari terakhir", range: {from: subDays(new Date(), 29), to: new Date()}},
        {
            label: "Minggu ini",
            range: {from: startOfWeek(new Date(), {weekStartsOn: 1}), to: endOfWeek(new Date(), {weekStartsOn: 1})}
        },
        {label: "Bulan ini", range: {from: startOfMonth(new Date()), to: endOfMonth(new Date())}},
        {
            label: "Bulan lalu",
            range: {from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1))}
        },
    ];

    const isPresetActive = (preset) =>
        dateRange.from?.toDateString() === preset.range.from.toDateString() &&
        dateRange.to?.toDateString() === preset.range.to.toDateString();

    const hasDateFilter = !!dateRange.from;

    const clearDate = (e) => {
        e.stopPropagation();
        setDateRange({from: null, to: null});
    };

    const formatDateLabel = () => {
        if (!dateRange.from) return "Filter Tanggal";
        if (!dateRange.to || dateRange.from.toDateString() === dateRange.to.toDateString())
            return format(dateRange.from, "dd MMM yyyy", {locale: id});
        return `${format(dateRange.from, "dd MMM", {locale: id})} – ${format(dateRange.to, "dd MMM yyyy", {locale: id})}`;
    };

    // Update useEffect untuk include dateRange
    useEffect(() => {
        setSelectedIds([]);
        fetchAppointments({
            perPage: 20,
            dateFrom: dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : null,
            dateTo: dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : null,
        });
    }, [search, currentPage, dateRange]);

    const DateFilter = (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={`h-9 gap-2 whitespace-nowrap transition-colors ${
                        hasDateFilter
                            ? "border-teal-500 bg-teal-50 text-teal-700 hover:bg-teal-100 hover:border-teal-600"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    <CalendarIcon className="h-4 w-4 shrink-0"/>
                    <span>{formatDateLabel()}</span>
                    {hasDateFilter && (
                        <span
                            onClick={clearDate}
                            className="ml-0.5 rounded-full p-0.5 hover:bg-teal-200 transition-colors"
                        >
                            <X className="h-3 w-3"/>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 shadow-lg" align="end">
                <div className="flex divide-x divide-gray-100">
                    {/* Preset list */}
                    <div className="flex flex-col p-2 gap-0.5 w-40">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 py-1.5">
                            Cepat Pilih
                        </p>
                        {presets.map((preset) => (
                            <button
                                key={preset.label}
                                onClick={() => setDateRange(preset.range)}
                                className={`text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
                                    isPresetActive(preset)
                                        ? "bg-teal-50 text-teal-700 font-medium"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                {preset.label}
                            </button>
                        ))}
                        {hasDateFilter && (
                            <>
                                <div className="border-t border-gray-100 my-1"/>
                                <button
                                    onClick={() => setDateRange({from: null, to: null})}
                                    className="text-left text-sm px-3 py-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    Reset filter
                                </button>
                            </>
                        )}
                    </div>

                    {/* Calendar */}
                    <div className="p-2">
                        <Calendar
                            mode="range"
                            selected={dateRange}
                            onSelect={(range) => setDateRange(range ?? {from: null, to: null})}
                            locale={id}
                            initialFocus
                            numberOfMonths={1}
                        />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );

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
                    {canCreate && (
                        <Button asChild>
                            <Link to="/appointments/create">
                                <CirclePlus/>
                                Daftar Baru
                            </Link>
                        </Button>
                    )}
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

                {/* ── Bulk-action toolbar (appears when rows are selected) ── */}
                {canDelete && selectedIds.length > 0 && (
                    <div
                        className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 animate-in transition-all">
                            <span className="text-sm font-medium text-destructive">
                                {selectedIds.length} pendaftaran dipilih
                            </span>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="ml-auto gap-2"
                            onClick={() => setOpenDeleteModal()}
                        >
                            <Trash2 className="h-4 w-4"/>
                            Hapus yang Dipilih
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedIds([])}
                        >
                            Batal
                        </Button>
                    </div>
                )}

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
                    selectable={canDelete}
                    selectedIds={safeSelectedIds}
                    onToggleOne={toggleOne}
                    onToggleAll={toggleAll}
                    allSelected={allSelected}
                    filterSlot={DateFilter}
                />
            </div>

            {/* ── Confirm Delete Dialog ───────────────────────────────────── */}
            <AlertDialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Pendaftaran</AlertDialogTitle>
                        <AlertDialogDescription>
                            Anda akan menghapus <strong>{selectedIds.length} pendaftaran</strong>. Tindakan ini
                            tidak dapat dibatalkan. Lanjutkan?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleBulkDelete}
                            disabled={isDeleting}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {isDeleting
                                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Menghapus...</>
                                : "Ya, Hapus"
                            }
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Layout>
    );
}

export default AppointmentPage;