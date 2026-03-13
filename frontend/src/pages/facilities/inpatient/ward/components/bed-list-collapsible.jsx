import {useState} from "react";
import {ChevronDown, ChevronUp, User} from "lucide-react";
import {Badge} from "@/components/ui/badge.jsx";
import {cn} from "@/lib/utils.js";
import {format} from "date-fns";

export function BedListCollapsible({beds = []}) {
    const [openBeds, setOpenBeds] = useState({});

    const toggle = (id) => setOpenBeds(prev => ({...prev, [id]: !prev[id]}));

    return (
        <div className="space-y-2">
            {beds.map(bed => {
                const isOpen = openBeds[bed.id];
                const activeAssignment = bed.bed_assignments?.[0] ?? null;
                const admission = activeAssignment?.inpatient_admission ?? null;

                return (
                    <div key={bed.id} className="border rounded-lg overflow-hidden">
                        {/* Header */}
                        <button
                            type="button"
                            onClick={() => toggle(bed.id)}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="font-medium text-sm">{bed.bed_number}</span>
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "text-xs",
                                        bed.status === "available"
                                            ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                                            : "border-red-500 text-red-600 bg-red-50"
                                    )}
                                >
                                    {bed.status === "available" ? "Tersedia" : "Terisi"}
                                </Badge>
                            </div>
                            {isOpen
                                ? <ChevronUp className="w-4 h-4 text-muted-foreground"/>
                                : <ChevronDown className="w-4 h-4 text-muted-foreground"/>}
                        </button>

                        {/* Detail */}
                        {isOpen && (
                            <div className="px-4 py-3 border-t bg-muted/30 text-sm space-y-3">
                                {admission ? (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-muted-foreground shrink-0"/>
                                            <span className="font-medium">
                                                {admission.patient?.full_name ?? "-"}
                                            </span>
                                            <span className="text-muted-foreground text-xs">
                                                {admission.patient?.medical_record_number}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <span className="text-muted-foreground">Diagnosis: </span>
                                                <span className="font-medium">{admission.diagnosis ?? "-"}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Sumber: </span>
                                                <span className="font-medium">{admission.admission_source ?? "-"}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Status: </span>
                                                <Badge variant="outline" className="text-xs ml-1">
                                                    {admission.status}
                                                </Badge>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Masuk: </span>
                                                <span className="font-medium">
                                                    {activeAssignment.assigned_at
                                                        ? format(new Date(activeAssignment.assigned_at), "dd MMM yyyy HH:mm")
                                                        : "-"}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-muted-foreground text-xs text-center py-2">
                                        Tidak ada pasien saat ini.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}