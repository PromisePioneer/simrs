import {format} from "date-fns";
import {id} from "date-fns/locale";

export const formatDate = (date) => {
    if (!date) return "-";
    try {
        return format(new Date(date), "dd MMMM yyyy", {locale: id});
    } catch {
        return "-";
    }
};