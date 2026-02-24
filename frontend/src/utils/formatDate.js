export const formatDate = (date) => {
    if (!date) return "-";
    try {
        return format(new Date(date), "dd MMMM yyyy", {locale: localeId});
    } catch {
        return "-";
    }
};