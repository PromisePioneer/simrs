import {CheckCircle, Clock, Stethoscope, Users} from "lucide-react";


export const stats = (
    countTodayQueues = {},
) => {
    return [
        {
            title: "Total Antrian Rawat Jalan Hari Ini",
            value: countTodayQueues.today_queues,
            icon: Users,
            color: "bg-teal-500",
            change: `0 dari kemarin`
        },
        {
            title: "Sedang Menunggu",
            value: countTodayQueues?.waiting ?? 0,
            icon: Clock,
            color: "bg-teal-500",
            change: "Antrian aktif"
        },
        {
            title: "Sedang Diperiksa",
            value: countTodayQueues?.in_progress ?? 0,
            icon: Stethoscope,
            color: "bg-teal-500",
            change: "Di ruang dokter"
        },
        {
            title: "Selesai",
            value: countTodayQueues?.completed ?? 0,
            icon: CheckCircle,
            color: "bg-teal-500",
            change: "Hari ini"
        },
    ];
};