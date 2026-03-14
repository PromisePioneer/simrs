import {useInpatientAdmissionStore} from "@/store/inpatientAdmissionStore.js";
import {useNavigate, useParams} from "@tanstack/react-router";
import {useEffect} from "react";
import Layout from "@/pages/dashboard/layout.jsx";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {
    ArrowLeft,
    User,
    Stethoscope,
    BedDouble,
    Activity,
    Calendar,
    MapPin,
    Phone,
    Briefcase,
    HeartPulse,
    Thermometer,
    Wind,
    Droplets,
} from "lucide-react";
import DataTable from "@/components/common/data-table.jsx";

function InfoRow({icon: Icon, label, value}) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3 py-2">
            <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0"/>
            <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-sm font-medium text-foreground break-words">{value}</span>
            </div>
        </div>
    );
}

function VitalCard({icon: Icon, label, value, unit, color = "blue"}) {
    const colorMap = {
        red: "bg-red-50 border-red-100 text-red-600",
        blue: "bg-blue-50 border-blue-100 text-blue-600",
        green: "bg-green-50 border-green-100 text-green-600",
        orange: "bg-orange-50 border-orange-100 text-orange-600",
        purple: "bg-purple-50 border-purple-100 text-purple-600",
    };
    return (
        <div className={`rounded-xl border p-4 flex flex-col gap-2 ${colorMap[color]}`}>
            <div className="flex items-center gap-2">
                <Icon className="w-4 h-4"/>
                <span className="text-xs font-medium">{label}</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{value ?? "—"}</span>
                {unit && <span className="text-xs font-medium opacity-70">{unit}</span>}
            </div>
        </div>
    );
}

function InpatientDetailPage(opts) {
    const {id} = useParams(opts);
    const navigate = useNavigate();
    const {
        showInpatientAdmission,
        inpatientAdmissionValue,
        isLoading,
        setCurrentPage,
        search,
        setSearch,
        currentPage
    } = useInpatientAdmissionStore();

    const columns = () => [
        {key: "date", label: "Tanggal"},
        {key: "notes", label: "Catatan Perawatan"},
        {key: "doctor", label: "Dokter"},
        {key: "actions", label: ""},
    ];

    const renderRow = (row) => (
        <tr key={row.id} className="border-b hover:bg-slate-50 transition-colors">
            <td className="px-4 py-3 text-sm text-slate-700">
                {row.date
                    ? new Date(row.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })
                    : "—"}
            </td>
            <td className="px-4 py-3 text-sm text-slate-700 max-w-xs truncate">
                {row.notes ?? "—"}
            </td>
            <td className="px-4 py-3 text-sm text-slate-700">
                {row.doctor?.full_name_with_degrees ?? "—"}
            </td>
            <td className="px-4 py-3 text-right">
                {/* action buttons here */}
            </td>
        </tr>
    );

    useEffect(() => {
        showInpatientAdmission(id);
    }, [showInpatientAdmission]);

    // response shape: { data: { ...admission, active_bed }, daily_cares: { ...paginated } }
    const data = inpatientAdmissionValue?.data;
    const {patient, doctor, vital_signs, active_bed} = data ?? {};
    const vitals = vital_signs?.[0] ?? {};
    const dailyCares = inpatientAdmissionValue?.daily_cares;

    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        return new Date(dateStr).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const calcAge = (dob) => {
        if (!dob) return null;
        const diff = Date.now() - new Date(dob).getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)) + " tahun";
    };

    const initials = (name) =>
        name
            ?.split(" ")
            .slice(0, 2)
            .map((n) => n[0])
            .join("")
            .toUpperCase();

    return (
        <Layout>
            {/* Page Header */}
            <div className="flex items-center gap-3 mb-6">
                <Button variant="ghost" size="icon" onClick={() => navigate({to: "/inpatient"})}>
                    <ArrowLeft className="w-4 h-4"/>
                </Button>
                <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-bold text-slate-800">Detail Rawat Inap</h1>
                    <p className="text-sm text-muted-foreground">
                        {patient?.medical_record_number ?? "—"}
                    </p>
                </div>
                {data && (
                    <Badge
                        className={data.status === "admitted" ? "bg-green-500 hover:bg-green-600" : ""}
                        variant={data.status === "admitted" ? "default" : "secondary"}
                    >
                        {data.status === "admitted" ? "Dirawat" : data.status}
                    </Badge>
                )}
            </div>

            {/* Loading State */}
            {!data ? (
                <div className="flex items-center justify-center py-24">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <Activity className="w-8 h-8 animate-pulse"/>
                        <span className="text-sm">Memuat data pasien...</span>
                    </div>
                </div>
            ) : (
                <div className="space-y-5">

                    {/* Patient Identity + Vital Signs */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle
                                    className="text-sm font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                                    <User className="w-4 h-4"/> Identitas Pasien
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-4 mb-4">
                                    <Avatar className="w-14 h-14 shrink-0">
                                        <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-bold">
                                            {initials(patient?.full_name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">{patient?.full_name}</h2>
                                        <p className="text-sm text-muted-foreground capitalize">
                                            {patient?.gender} · {calcAge(patient?.date_of_birth)}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                                            {patient?.religion}
                                        </p>
                                    </div>
                                </div>
                                <Separator className="mb-3"/>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                                    <InfoRow
                                        icon={Calendar}
                                        label="Tanggal Lahir"
                                        value={
                                            patient?.date_of_birth
                                                ? new Date(patient.date_of_birth).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })
                                                : null
                                        }
                                    />
                                    <InfoRow icon={MapPin} label="Kota Lahir" value={patient?.city_of_birth}/>
                                    <InfoRow icon={Phone} label="Nomor Telepon" value={patient?.phone}/>
                                    <InfoRow icon={Briefcase} label="Pekerjaan" value={patient?.job}/>
                                    <InfoRow icon={User} label="No. KTP" value={patient?.id_card_number}/>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle
                                    className="text-sm font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                                    <HeartPulse className="w-4 h-4"/> Tanda-Tanda Vital
                                </CardTitle>
                                <p className="text-xs text-muted-foreground">
                                    Dicatat: {formatDate(vitals.created_at) ?? "—"}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    <VitalCard icon={Thermometer} label="Suhu" value={vitals.temperature} unit="°C"
                                               color="orange"/>
                                    <VitalCard icon={HeartPulse} label="Nadi" value={vitals.pulse_rate} unit="bpm"
                                               color="red"/>
                                    <VitalCard icon={Wind} label="Laju Napas" value={vitals.respiratory_rate}
                                               unit="/mnt" color="blue"/>
                                    <VitalCard icon={Droplets} label="Sistolik" value={vitals.systolic} unit="mmHg"
                                               color="purple"/>
                                    <VitalCard icon={Droplets} label="Diastolik" value={vitals.diastolic} unit="mmHg"
                                               color="green"/>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Admission Info */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle
                                className="text-sm font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                                <BedDouble className="w-4 h-4"/> Informasi Rawat Inap
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                            <InfoRow icon={Calendar} label="Tanggal Masuk" value={formatDate(data.admitted_at)}/>
                            <InfoRow
                                icon={Calendar}
                                label="Tanggal Keluar"
                                value={data.discharged_at ? formatDate(data.discharged_at) : "Masih dirawat"}
                            />
                            <InfoRow icon={MapPin} label="Sumber Masuk" value={data.admission_source}/>
                            <InfoRow icon={Activity} label="Diagnosa" value={data.diagnosis}/>
                            <InfoRow
                                icon={BedDouble}
                                label="Nomor Tempat Tidur"
                                value={active_bed?.bed?.bed_number}
                            />
                        </CardContent>
                    </Card>

                    {/* Daily Cares */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle
                                className="text-sm font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                                <Activity className="w-4 h-4"/> Perawatan Harian
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                title="Perawatan Harian"
                                description="Riwayat perawatan harian pasien selama rawat inap"
                                columns={columns()}
                                data={dailyCares?.data ?? []}
                                isLoading={isLoading}
                                pagination={dailyCares ? {
                                    from: dailyCares.from,
                                    to: dailyCares.to,
                                    total: dailyCares.total,
                                    current_page: dailyCares.current_page,
                                    last_page: dailyCares.last_page,
                                } : null}
                                onPageChange={setCurrentPage}
                                currentPage={currentPage}
                                onSearch={setSearch}
                                search={search}
                                searchPlaceholder="Cari catatan perawatan..."
                                emptyStateIcon={Activity}
                                emptyStateText="Belum ada data perawatan harian"
                                renderRow={renderRow}
                                showSearch={true}
                            />
                        </CardContent>
                    </Card>

                    {/* Doctor Info */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle
                                className="text-sm font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                                <Stethoscope className="w-4 h-4"/> Dokter Penanggung Jawab
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10 shrink-0">
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
                                        {initials(doctor?.full_name_with_degrees)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-slate-900">{doctor?.full_name_with_degrees}</p>
                                    <p className="text-xs text-muted-foreground">{doctor?.email}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </Layout>
    );
}

export default InpatientDetailPage;