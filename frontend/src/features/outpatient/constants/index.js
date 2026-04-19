// Dipindahkan dari src/constants/outpatient-visits.js
export const OUTPATIENT_VISIT_STATUSES = {
    WAITING: "waiting",
    IN_PROGRESS: "in_progress",
    DONE: "done",
    CANCELLED: "cancelled",
};

export const OUTPATIENT_VISIT_STATUS_LABELS = {
    [OUTPATIENT_VISIT_STATUSES.WAITING]: "Menunggu",
    [OUTPATIENT_VISIT_STATUSES.IN_PROGRESS]: "Sedang Dilayani",
    [OUTPATIENT_VISIT_STATUSES.DONE]: "Selesai",
    [OUTPATIENT_VISIT_STATUSES.CANCELLED]: "Dibatalkan",
};

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
