import {CheckCircle, Clock, Stethoscope, Users} from "lucide-react";


export const stats = (
    patientTodayCount = {},
    todayPatientCountByStatus = {}
) => {
    return [
        {
            title: "Total Pasien Hari Ini",
            value: patientTodayCount?.total_today ?? 0,
            icon: Users,
            color: "bg-teal-500",
            change: `${patientTodayCount?.difference ?? 0} dari kemarin`
        },
        {
            title: "Sedang Menunggu",
            value: todayPatientCountByStatus?.waiting ?? 0,
            icon: Clock,
            color: "bg-teal-500",
            change: "Antrian aktif"
        },
        {
            title: "Sedang Diperiksa",
            value: todayPatientCountByStatus?.in_progress ?? 0,
            icon: Stethoscope,
            color: "bg-teal-500",
            change: "Di ruang dokter"
        },
        {
            title: "Selesai",
            value: todayPatientCountByStatus?.completed ?? 0,
            icon: CheckCircle,
            color: "bg-teal-500",
            change: "Hari ini"
        },
    ];
};