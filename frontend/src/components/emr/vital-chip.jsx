export const VitalChip = ({icon: Icon, label, value, unit, warn}) => (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px] font-medium
        ${warn ? "bg-red-50 border-red-200 text-red-700" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
        <Icon className="w-3 h-3 shrink-0"/>
        <span className="text-muted-foreground font-normal">{label}</span>
        <span>{value}{unit && <span className="text-muted-foreground font-normal ml-0.5">{unit}</span>}</span>
    </div>
);