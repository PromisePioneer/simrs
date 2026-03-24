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
