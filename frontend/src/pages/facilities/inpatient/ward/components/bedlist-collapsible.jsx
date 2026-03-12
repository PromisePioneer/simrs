import {useState} from "react";
import {ChevronRight, BedDouble, BedSingle} from "lucide-react";
import {BedStatusBadge} from "@/pages/facilities/inpatient/ward/components/bed-status-badge.jsx";

export function BedListCollapsible({beds}) {
    const [open, setOpen] = useState(true);

    return (
        <div className="rounded-lg border border-border/60 overflow-hidden">
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
                    <span className="text-xs text-muted-foreground">({beds.length})</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" style={{
                    transition: "transform 0.3s ease",
                    transform: open ? "rotate(90deg)" : "rotate(0deg)",
                }}/>
            </button>

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
                            <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground">
                                <BedSingle className="w-8 h-8 opacity-40"/>
                                <p className="text-sm">Belum ada tempat tidur di ruangan ini</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3">
                                {beds.map((bed) => (
                                    <div key={bed.id}
                                         className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5">
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-md shrink-0 ${
                                            bed.status === "occupied" ? "bg-red-100" :
                                                bed.status === "reserved" ? "bg-amber-100" : "bg-emerald-100"
                                        }`}>
                                            <BedSingle className={`w-4 h-4 ${
                                                bed.status === "occupied" ? "text-red-600" :
                                                    bed.status === "reserved" ? "text-amber-600" : "text-emerald-600"
                                            }`}/>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-foreground">
                                                {bed.bed_number ?? bed.name}
                                            </p>
                                            <BedStatusBadge status={bed.status ?? "available"}/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}