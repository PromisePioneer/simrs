export const formatDateTime = (dateStr) =>
    dateStr
        ? new Date(dateStr).toLocaleString("id-ID", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        })
        : "—";