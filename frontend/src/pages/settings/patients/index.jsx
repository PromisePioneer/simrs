import SettingPage from "@/pages/settings/index.jsx";
import {usePatientStore} from "@/store/usePatientStore.js";
import {
    UserRoundCog,
    Plus,
    Pencil,
    Trash2,
    Phone,
    Filter,
    Download,
    Calendar,
    Grid3x3,
    List,
    CheckCircle2,
    Clock,
    AlertCircle,
    FileText,
    Activity,
    TrendingUp,
    Users
} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {useEffect, useState} from "react";
import {TableCell, TableRow} from "@/components/ui/table.jsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";
import DataTable from "@/components/common/data-table.jsx";
import {Link} from "@tanstack/react-router";
import {asset} from "@/services/apiCall.js";
import {Avatar} from "@radix-ui/react-avatar";
import {AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";
import {getInitials} from "@/hooks/use-helpers.js";
import {Badge} from "@/components/ui/badge.jsx";
import {format} from "date-fns";
import {id} from "date-fns/locale";

function PatientPage() {

    const {
        isLoading,
        fetchPatients,
        patients,
        currentPage,
        setCurrentPage,
        setOpenModal,
        columns,
        search,
        setSearch,
        setOpenDeleteModal,
        openDeleteModal
    } = usePatientStore();

    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [viewMode, setViewMode] = useState('table');

    const handleExport = () => {
        console.log('Exporting data...');
    };

    useEffect(() => {
        fetchPatients({perPage: 20});
    }, [currentPage, search]);

    // Enhanced Stats Component with animations
    const PatientStats = ({patients}) => {
        const activeCount = patients?.data?.filter(p => p.status === 'active').length || 0;
        const followUpCount = patients?.data?.filter(p => p.status === 'follow-up').length || 0;
        const urgentCount = patients?.data?.filter(p => p.priority === 'urgent').length || 0;
        const totalCount = patients?.total || 0;

        const stats = [
            {
                title: "Total Pasien",
                value: totalCount,
                icon: Users,
                color: "teal",
                bgColor: "bg-teal-50",
                iconColor: "text-teal-600",
                textColor: "text-teal-600",
                trend: "+12%",
                trendUp: true
            },
            {
                title: "Pasien Aktif",
                value: activeCount,
                icon: CheckCircle2,
                color: "green",
                bgColor: "bg-green-50",
                iconColor: "text-green-600",
                textColor: "text-green-600",
                trend: "+8%",
                trendUp: true
            },
            {
                title: "Follow Up",
                value: followUpCount,
                icon: Clock,
                color: "orange",
                bgColor: "bg-orange-50",
                iconColor: "text-orange-600",
                textColor: "text-orange-600",
                trend: "+5%",
                trendUp: true
            },
            {
                title: "Urgent Cases",
                value: urgentCount,
                icon: AlertCircle,
                color: "red",
                bgColor: "bg-red-50",
                iconColor: "text-red-600",
                textColor: "text-red-600",
                trend: "-3%",
                trendUp: false
            }
        ];

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                                    <Icon className={`w-6 h-6 ${stat.iconColor}`}/>
                                </div>
                                <div className="flex items-center gap-1">
                                    <TrendingUp
                                        className={`w-4 h-4 ${stat.trendUp ? 'text-green-500' : 'text-red-500 rotate-180'}`}
                                    />
                                    <span
                                        className={`text-xs font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                                        {stat.trend}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 font-medium mb-1">{stat.title}</p>
                                <p className={`text-3xl font-bold ${stat.textColor}`}>
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Enhanced Filter Bar with better styling
    const PatientFilterBar = ({
                                  filterStatus,
                                  setFilterStatus,
                                  filterPriority,
                                  setFilterPriority,
                                  onExport,
                                  viewMode,
                                  setViewMode
                              }) => {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4 justify-between">
                    {/* Filters Section */}
                    <div className="flex flex-wrap gap-3 items-center">
                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                            <Filter className="w-4 h-4 text-gray-600"/>
                            <span className="text-sm font-semibold text-gray-700">Filter</span>
                        </div>

                        {/* Status Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white hover:border-gray-300 transition-colors"
                        >
                            <option value="all">Semua Status</option>
                            <option value="active">Aktif</option>
                            <option value="follow-up">Follow Up</option>
                            <option value="completed">Selesai</option>
                        </select>

                        {/* Priority Filter */}
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white hover:border-gray-300 transition-colors"
                        >
                            <option value="all">Semua Prioritas</option>
                            <option value="urgent">Urgent</option>
                            <option value="normal">Normal</option>
                        </select>

                        {/* Date Range Filter */}
                        <Button
                            variant="outline"
                            size="default"
                            className="gap-2 border-gray-200 hover:bg-gray-50"
                        >
                            <Calendar className="w-4 h-4"/>
                            <span className="hidden sm:inline">Pilih Tanggal</span>
                        </Button>
                    </div>

                    {/* Actions Section */}
                    <div className="flex gap-2 items-center">
                        {/* View Toggle */}
                        <div className="flex border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-4 py-2.5 transition-all ${
                                    viewMode === 'table'
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <List className="w-4 h-4"/>
                            </button>
                            <button
                                onClick={() => setViewMode('cards')}
                                className={`px-4 py-2.5 border-l border-gray-200 transition-all ${
                                    viewMode === 'cards'
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <Grid3x3 className="w-4 h-4"/>
                            </button>
                        </div>

                        {/* Export Button */}
                        <Button
                            variant="outline"
                            size="default"
                            onClick={onExport}
                            className="gap-2 border-gray-200 hover:bg-gray-50"
                        >
                            <Download className="w-4 h-4"/>
                            <span className="hidden sm:inline">Export</span>
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    // Enhanced renderRow with better styling
    const renderRow = (patient, index) => {
        return (
                <TableRow
                    key={patient.id}
                    className="hover:bg-teal-50/50 transition-all duration-200 border-b border-gray-100 group cursor-pointer "
                    onClick={() => window.location.href = `/settings/patients/details/${patient.id}`}
                >
                    <TableCell className="font-semibold text-gray-500">
                        #{(patients.from || 0) + index}
                    </TableCell>

                    {/* Patient Info */}
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar
                                className="h-12 w-12 ring-2 ring-white shadow-md overflow-hidden rounded-full group-hover:ring-teal-200 transition-all">
                                {patient.profile_picture ? (
                                    <AvatarImage
                                        src={asset(patient.profile_picture)}
                                        alt={patient.full_name}
                                        className="object-cover"
                                    />
                                ) : (
                                    <AvatarFallback className="bg-teal-500 text-white font-bold text-sm">
                                        {getInitials(patient.full_name)}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div className="flex flex-col gap-1">
                                <p className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                                    {patient.full_name}
                                </p>
                                <Badge variant="secondary"
                                       className="w-fit text-xs font-medium bg-gray-100 hover:bg-gray-200 transition-colors">
                                    {patient.medical_record_number}
                                </Badge>
                            </div>
                        </div>
                    </TableCell>

                    {/* Phone */}
                    <TableCell>
                        <Badge variant="outline" className="gap-2 font-normal border-gray-200">
                            <Phone className="w-3 h-3"/>
                            {patient.phone}
                        </Badge>
                    </TableCell>

                    {/* Status & Priority */}
                    <TableCell>
                        <div className="flex flex-col gap-2">
                            <Badge
                                className={`w-fit font-medium shadow-sm ${
                                    patient.status === 'active'
                                        ? 'bg-green-100 text-green-700 border-green-200'
                                        : patient.status === 'follow-up'
                                            ? 'bg-teal-100 text-teal-700 border-teal-200'
                                            : 'bg-gray-100 text-gray-700 border-gray-200'
                                } border`}
                            >
                                {patient.status === 'active' ? '✅ Aktif' : patient.status === 'follow-up' ? '🔄 Follow Up' : '✔️ Selesai'}
                            </Badge>

                            {patient.priority === 'urgent' && (
                                <Badge
                                    className="w-fit bg-red-100 text-red-700 border-red-200 border font-medium shadow-sm animate-pulse">
                                    🚨 Urgent
                                </Badge>
                            )}
                        </div>
                    </TableCell>

                    {/* Consultation Date */}
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400"/>
                            <span className="font-medium text-gray-900">
                            {format(patient.date_of_consultation, 'dd MMM yyyy', {locale: id})}
                        </span>
                        </div>
                    </TableCell>

                    {/* Diagnosis & Doctor */}
                    <TableCell>
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-gray-400"/>
                                <span className="text-sm font-medium text-gray-900">
                                {patient.last_diagnosis || 'Belum ada diagnosis'}
                            </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5 text-teal-500"/>
                                <span className="text-xs text-gray-600">
                                {patient.assigned_doctor || 'Belum ditentukan'}
                            </span>
                            </div>
                        </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                            <TooltipProvider>
                                <>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm"
                                                className="h-9 w-9 p-0 hover:bg-green-100 hover:text-green-600 transition-all"
                                            >
                                                <Link to={"/settings/patients/" + patient.id}>
                                                    <Pencil className="h-4 w-4"/>
                                                </Link>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-900 text-white">
                                            <p>Edit Pasien</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-9 w-9 p-0 hover:bg-red-100 hover:text-red-600 transition-all"
                                                onClick={() => setOpenDeleteModal(patient.id)}
                                            >
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-900 text-white">
                                            <p>Hapus Pasien</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </>
                            </TooltipProvider>
                        </div>
                    </TableCell>
                </TableRow>
        );
    };

    return (
        <>
            <SettingPage>
                {/* Enhanced Header */}
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

                {/* Stats Cards */}
                <PatientStats patients={patients}/>

                {/* Filter Bar */}
                <PatientFilterBar
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                    filterPriority={filterPriority}
                    setFilterPriority={setFilterPriority}
                    onExport={handleExport}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />

                {/* Data Table */}
                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <DataTable
                        title="Data Pasien"
                        description="Kelola dan atur data pasien"
                        columns={columns()}
                        data={patients?.data || []}
                        isLoading={isLoading}
                        pagination={patients ? {
                            from: patients.from,
                            to: patients.to,
                            total: patients.total,
                            current_page: patients.current_page,
                            last_page: patients.last_page
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