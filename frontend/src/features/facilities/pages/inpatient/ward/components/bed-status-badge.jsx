import {CheckCircle2, XCircle, Clock} from "lucide-react";

const STATUS_MAP = {
    available: {label: "Tersedia", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-700 border-emerald-200"},
    occupied: {label: "Terisi", icon: XCircle, className: "bg-red-50 text-red-700 border-red-200"},
    reserved: {label: "Dipesan", icon: Clock, className: "bg-amber-50 text-amber-700 border-amber-200"},
};

export function BedStatusBadge({status}) {
    const cfg = STATUS_MAP[status] ?? STATUS_MAP.available;
    const Icon = cfg.icon;
    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.className}`}>
            <Icon className="w-3 h-3"/> {cfg.label}
        </span>
    );
}