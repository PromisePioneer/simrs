import {TableCell, TableRow} from "@shared/components/ui/table.jsx";
import {ChevronRight, Building2, DoorOpen, Layers,} from "lucide-react";
import {Badge} from "@shared/components/ui/badge.jsx";

export const BuildingRow = ({toggleExpand, expandedRows, item, setOpenModal, canEdit, checkboxCell}) => {
    const isExpanded = expandedRows.has(item.id);
    const wardCount = item.wards?.length ?? 0;

    return (
        <>
            <TableRow className="hover:bg-muted/30 transition-colors select-none">
            {checkboxCell}

                {/* Kolom CHEVRON — khusus expand */}
                <TableCell
                    className="w-8 cursor-pointer"
                    onClick={() => wardCount > 0 && toggleExpand(item.id)}
                >
                    <div className="w-4 h-4 flex items-center justify-center text-muted-foreground/50">
                        {wardCount > 0 && (
                            <ChevronRight
                                className="w-3.5 h-3.5 transition-transform duration-200"
                                style={{transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)"}}
                            />
                        )}
                    </div>
                </TableCell>

                {/* Kolom NAMA — buka modal */}
                <TableCell
                    className="cursor-pointer"
                    onClick={() => canEdit && setOpenModal(item.id)}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center shrink-0">
                            <Building2 className="w-4 h-4 text-teal-600"/>
                        </div>
                        <span className="font-medium text-sm">{item.name}</span>
                    </div>
                </TableCell>

                {/* Kolom WARD */}
                <TableCell
                    className="cursor-pointer"
                    onClick={() => canEdit && setOpenModal(item.id)}
                >
                    <Badge variant={wardCount > 0 ? "secondary" : "outline"} className="gap-1.5 font-normal">
                        <DoorOpen className="w-3 h-3"/>
                        {wardCount} Ruang Rawat
                    </Badge>
                </TableCell>

                {/* Kolom DESKRIPSI */}
                <TableCell
                    className="cursor-pointer"
                    onClick={() => canEdit && setOpenModal(item.id)}
                >
                    <span className="text-sm text-muted-foreground line-clamp-1">
                        {item.description || <span className="italic opacity-40">—</span>}
                    </span>
                </TableCell>

            </TableRow>

            {/* Row expanded wards */}
            <TableRow className="hover:bg-transparent border-0">
                <TableCell colSpan={5} className="p-0! border-0">
                    <div style={{
                        display: "grid",
                        gridTemplateRows: isExpanded ? "1fr" : "0fr",
                        transition: "grid-template-rows 0.25s cubic-bezier(0.4,0,0.2,1)",
                    }}>
                        <div style={{overflow: "hidden"}}>
                            <div style={{
                                opacity: isExpanded ? 1 : 0,
                                transition: "opacity 0.2s ease",
                                transitionDelay: isExpanded ? "0.05s" : "0s",
                            }}>
                                <div className="py-3 pl-14 pr-4 bg-muted/20 border-b">
                                    <div className="flex items-center gap-2 mb-2.5">
                                        <Layers className="w-3.5 h-3.5 text-muted-foreground"/>
                                        <span
                                            className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Ruang Rawat — {item.name}
                                        </span>
                                    </div>
                                    <div
                                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                        {item.wards?.map((ward) => (
                                            <div key={ward.id}
                                                 className="flex items-center gap-2 rounded-md border bg-background px-2.5 py-2">
                                                <div
                                                    className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center shrink-0">
                                                    <DoorOpen className="w-3 h-3 text-indigo-600"/>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-medium truncate">{ward.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">Lantai {ward.floor}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TableCell>
            </TableRow>
        </>
    );
}