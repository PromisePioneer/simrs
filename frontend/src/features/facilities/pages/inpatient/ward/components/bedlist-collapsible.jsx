import {useState} from "react";
import {ChevronRight, ChevronDown, BedDouble, BedSingle, User} from "lucide-react";
import {BedStatusBadge} from "@features/facilities/pages/inpatient/ward/components/bed-status-badge.jsx";
import {Badge} from "@shared/components/ui/badge.jsx";
import {format} from "date-fns";

export function BedListCollapsible({beds}) {
    const [open, setOpen] = useState(true);
    const [openBeds, setOpenBeds] = useState({});
    const toggleBed = (id) => setOpenBeds(prev => ({...prev, [id]: !prev[id]}));

    return (
        <div className="rounded-lg border border-border/60 overflow-hidden">
            {/* Header collapsible utama */}
            <button
                type="button"
                onClick={() => setOpen(p => !p)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-muted/40 hover:bg-muted/70 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <BedDouble className="w-4 h-4 text-primary"/>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                        Daftar Tempat Tidur
                    </span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" style={{
                    transition: "transform 0.3s ease",
                    transform: open ? "rotate(90deg)" : "rotate(0deg)",
                }}/>
            </button>

            {/* List bed */}
            <div style={{
                display: "grid",
                gridTemplateRows: open ? "1fr" : "0fr",
                transition: "grid-template-rows 0.3s cubic-bezier(0.4,0,0.2,1)",
            }}>
                <div style={{overflow: "hidden"}}>
                    <div style={{
                        opacity: open ? 1 : 0,
                        transform: open ? "translateY(0)" : "translateY(-6px)",
                        transition: "opacity 0.25s ease, transform 0.25s ease",
                        transitionDelay: open ? "0.05s" : "0s",
                    }}>
                        {beds.length === 0 ? (
                            <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
                                <BedSingle className="w-8 h-8 opacity-40"/>
                                <p className="text-sm">Belum ada tempat tidur di ruangan ini</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-2 p-3">
                                {beds.map((bed) => {
                                    const isBedOpen = openBeds[bed.id];
                                    const activeAssignment = bed.bed_assignments?.[0] ?? null;
                                    const admission = activeAssignment?.inpatient_admission ?? null;

                                    return (
                                        <div key={bed.id}
                                             className="rounded-lg border border-border/60 overflow-hidden">
                                            {/* Bed header */}
                                            <button
                                                type="button"
                                                onClick={() => toggleBed(bed.id)}
                                                className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-muted/30 hover:bg-muted/60 transition-colors"
                                            >
                                                <div
                                                    className={`flex items-center justify-center w-8 h-8 rounded-md shrink-0 ${
                                                        bed.status === "occupied" ? "bg-red-100" :
                                                            bed.status === "reserved" ? "bg-amber-100" : "bg-emerald-100"
                                                    }`}>
                                                    <BedSingle className={`w-4 h-4 ${
                                                        bed.status === "occupied" ? "text-red-600" :
                                                            bed.status === "reserved" ? "text-amber-600" : "text-emerald-600"
                                                    }`}/>
                                                </div>
                                                <div className="min-w-0 flex-1 text-left">
                                                    <p className="text-sm font-semibold">{bed.bed_number}</p>
                                                    <BedStatusBadge status={bed.status ?? "available"}/>
                                                </div>
                                                {bed.status === "occupied" && (
                                                    isBedOpen
                                                        ? <ChevronDown
                                                            className="w-4 h-4 text-muted-foreground shrink-0"/>
                                                        : <ChevronRight
                                                            className="w-4 h-4 text-muted-foreground shrink-0"/>
                                                )}
                                            </button>

                                            {/* Detail pasien */}
                                            {isBedOpen && admission && (
                                                <div className="px-4 py-3 border-t bg-muted/10 text-sm space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-muted-foreground shrink-0"/>
                                                        <span
                                                            className="font-medium">{admission.patient?.full_name ?? "-"}</span>
                                                        <span className="text-muted-foreground text-xs">
                                                            {admission.patient?.medical_record_number}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        <div>
                                                            <span className="text-muted-foreground">Diagnosis: </span>
                                                            <span
                                                                className="font-medium">{admission.diagnosis ?? "-"}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">Sumber: </span>
                                                            <span
                                                                className="font-medium">{admission.admission_source ?? "-"}</span>
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
                                                                {activeAssignment?.assigned_at
                                                                    ? format(new Date(activeAssignment.assigned_at), "dd MMM yyyy HH:mm")
                                                                    : "-"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}