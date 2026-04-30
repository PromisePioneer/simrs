export const formatDateTime = (dateStr) =>
    dateStr
        ? new Date(dateStr).toLocaleString("id-ID", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        })
        : "—";


export const formatToDateTimeLocal = (value) => {
    if (!value) return "";

    const date = new Date(value);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

    return date.toISOString().slice(0, 16);
};


