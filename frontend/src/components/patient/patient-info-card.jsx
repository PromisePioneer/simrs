import {
    Phone,
    MapPin,
    Calendar,
    CreditCard,
    Stethoscope,
    ClipboardList,
    Activity,
    Briefcase,
} from "lucide-react";
import {Badge} from "@/components/ui/badge.jsx";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {differenceInYears} from "date-fns";
import {formatDate} from "@/utils/formatDate.js";


function PatientInfoCard({patientValue, isLoading = false}) {

    const calculateAge = (dob) => {
        if (!dob) return "-";
        return differenceInYears(new Date(), new Date(dob));
    }

    const getGenderLabel = (gender) => {
        if (!gender) return "-";
        const map = {
            male: "Laki-laki", female: "Perempuan",
            "laki-laki": "Laki-laki", perempuan: "Perempuan", wanita: "Perempuan",
        };
        return map[gender.toLowerCase()] ?? gender;
    };

    const getBloodTypeBadge = (type) => {
        if (!type) return null;
        const colorMap = {
            a: "bg-red-50 text-red-700 border-red-200",
            b: "bg-blue-50 text-blue-700 border-blue-200",
            ab: "bg-purple-50 text-purple-700 border-purple-200",
            o: "bg-green-50 text-green-700 border-green-200",
        };
        const key = type.replace(/[^a-zA-Z]/g, "").toLowerCase();
        const color = colorMap[key] ?? "bg-gray-100 text-gray-700 border-gray-200";
        return (
            <Badge variant="outline" className={`text-xs ${color}`}>
                Gol. {type.toUpperCase()}
            </Badge>
        );
    };

    const getVisitTypeBadge = (type) => {
        if (!type) return null;
        const map = {
            rujuk: {label: "Rujukan", color: "bg-yellow-50 text-yellow-700 border-yellow-200"},
            normal: {label: "Umum", color: "bg-teal-50 text-teal-700 border-teal-200"},
            bpjs: {label: "BPJS", color: "bg-blue-50 text-blue-700 border-blue-200"},
        };
        const cfg = map[type.toLowerCase()] ?? {label: type, color: "bg-gray-100 text-gray-700 border-gray-200"};
        return (
            <Badge variant="outline" className={`text-xs ${cfg.color}`}>
                {cfg.label}
            </Badge>
        );
    };

    // ── Loading skeleton ──────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="h-1.5 bg-teal-500"/>
                <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-14 h-14 rounded-full"/>
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-40"/>
                            <Skeleton className="h-4 w-24"/>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {Array.from({length: 6}).map((_, i) => (
                            <Skeleton key={i} className="h-12 rounded-lg"/>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!patientValue) return null;

    // JSON shape: { id, complain, type, status, doctor_id, patient: { full_name, ... } }
    const patient = patientValue.patient ?? patientValue;
    const visit = patientValue; // complain, type, status ada di root

    const age = calculateAge(patient?.date_of_birth);

    const initials = patient?.full_name
        ? patient.full_name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()
        : "?";

    return (
        <div className="rounded-xl border bg-card overflow-hidden shadow-sm mb-4">
            {/* accent bar */}
            <div className="h-1.5 bg-linear-to-r from-teal-400 to-teal-600"/>

            <div className="p-5 space-y-5">

                {/* ── Header ──────────────────────────────────────────── */}
                <div className="flex items-center gap-4">
                    <div
                        className="flex items-center justify-center w-14 h-14 rounded-full bg-teal-50 border-2 border-teal-200 shrink-0">
                        <span className="text-lg font-bold text-teal-600">{initials}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-lg font-bold leading-tight">
                                {patient?.full_name ?? "-"}
                            </h2>
                            {getBloodTypeBadge(patient?.blood_type)}
                            {getVisitTypeBadge(visit?.type)}
                        </div>
                        <div
                            className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-sm text-muted-foreground">
                            <span>{age} tahun</span>
                            <span className="text-muted-foreground/40">•</span>
                            <span>{getGenderLabel(patient?.gender)}</span>
                            {patient?.medical_record_number && (
                                <>
                                    <span className="text-muted-foreground/40">•</span>
                                    <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                                        {patient.medical_record_number}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="h-px bg-border"/>

                {/* ── Info grid pasien ────────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoItem
                        icon={Calendar}
                        iconColor="text-teal-500"
                        label="Tanggal Lahir"
                        value={`${formatDate(patient?.date_of_birth)} (${age} th)`}
                    />
                    <InfoItem
                        icon={Phone}
                        iconColor="text-blue-500"
                        label="No. Telepon"
                        value={patient?.phone ?? "-"}
                    />
                    <InfoItem
                        icon={CreditCard}
                        iconColor="text-orange-500"
                        label="No. KTP"
                        value={patient?.id_card_number ?? "-"}
                        mono
                    />
                    <InfoItem
                        icon={Briefcase}
                        iconColor="text-indigo-500"
                        label="Pekerjaan"
                        value={patient?.job ?? "-"}
                    />
                    {patient?.address && (
                        <div className="sm:col-span-2">
                            <InfoItem
                                icon={MapPin}
                                iconColor="text-red-500"
                                label="Alamat"
                                value={patient.address}
                            />
                        </div>
                    )}
                </div>

                {/* ── Info kunjungan ───────────────────────────────────── */}
                {visit?.complain && (
                    <>
                        <div className="h-px bg-border"/>
                        <div className="space-y-2.5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Kunjungan Ini
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="sm:col-span-2">
                                    <InfoItem
                                        icon={ClipboardList}
                                        iconColor="text-orange-500"
                                        label="Keluhan Utama"
                                        value={visit.complain}
                                    />
                                </div>
                                {visit?.doctor?.name && (
                                    <InfoItem
                                        icon={Stethoscope}
                                        iconColor="text-teal-500"
                                        label="Dokter Pemeriksa"
                                        value={visit.doctor.name}
                                    />
                                )}
                                {visit?.status && (
                                    <InfoItem
                                        icon={Activity}
                                        iconColor="text-purple-500"
                                        label="Status"
                                        value={
                                            visit.status === "in-progress" ? "Sedang Diperiksa"
                                                : visit.status === "waiting" ? "Menunggu"
                                                    : visit.status === "completed" ? "Selesai"
                                                        : visit.status
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

/* ── Sub-component ───────────────────────────────────────────────────────── */
function InfoItem({icon: Icon, iconColor, label, value, mono = false}) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <div className={`mt-0.5 shrink-0 ${iconColor}`}>
                <Icon className="w-4 h-4"/>
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                <p className={`text-sm font-medium leading-snug break-words ${mono ? "font-mono" : ""}`}>
                    {value}
                </p>
            </div>
        </div>
    );
}

export default PatientInfoCard;