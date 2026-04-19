import {Fragment, useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {Pencil, Trash2, Building2, ChevronRight, DoorOpen, Layers, Plus} from "lucide-react";
import {TableCell, TableRow} from "@shared/components/ui/table.jsx";
import {Button} from "@shared/components/ui/button.jsx";
import {Badge} from "@shared/components/ui/badge.jsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@shared/components/ui/tooltip.jsx";
import {RoomCard} from "@features/facilities/pages/inpatient/ward/components/room-card.jsx";

export function WardRow({ward, index, isExpanded, onToggle, onEdit, onDelete, onAddRoom, onRoomEdit, onRoomDelete}) {
    const navigate = useNavigate();
    const [hasExpanded, setHasExpanded] = useState(false);
    const roomCount = ward.rooms?.length ?? 0;

    const handleToggle = () => {
        if (!hasExpanded) setHasExpanded(true);
        onToggle();
    };

    return (
        <Fragment>
            <TableRow
                className="hover:bg-muted/30 transition-colors cursor-pointer select-none"
                onClick={handleToggle}
            >
                <TableCell className="text-sm text-muted-foreground w-12">{index}</TableCell>

                <TableCell>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 flex items-center justify-center text-muted-foreground/50 shrink-0">
                            {roomCount > 0 && (
                                <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200"
                                              style={{transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)"}}/>
                            )}
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center shrink-0">
                            <Building2 className="w-4 h-4 text-indigo-600"/>
                        </div>
                        <span className="font-medium text-sm">{ward.name}</span>
                    </div>
                </TableCell>

                <TableCell>
                    <span className="text-sm text-muted-foreground">{ward.department?.name ?? "—"}</span>
                </TableCell>

                <TableCell>
                    <Badge variant={roomCount > 0 ? "secondary" : "outline"} className="gap-1.5 font-normal">
                        <DoorOpen className="w-3 h-3"/>
                        {roomCount} Ruangan
                    </Badge>
                </TableCell>

                <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-end gap-0.5">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm"
                                            className="h-8 w-8 p-0 hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-teal-950/40"
                                            onClick={onEdit}>
                                        <Pencil className="h-3.5 w-3.5"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Edit Ruang Rawat</p></TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm"
                                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                                            onClick={onDelete}>
                                        <Trash2 className="h-3.5 w-3.5"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Hapus Ruang Rawat</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </TableCell>
            </TableRow>

            {hasExpanded && (
                <TableRow>
                    <TableCell colSpan={5} className="!p-0 border-0">
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
                                        <div className="flex items-center justify-between mb-2.5">
                                            <div className="flex items-center gap-2">
                                                <Layers className="w-3.5 h-3.5 text-muted-foreground"/>
                                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Ruangan — {ward.name}
                                                </span>
                                            </div>
                                            <Button size="sm" variant="outline"
                                                    className="h-7 px-2.5 text-xs gap-1 border-teal-200 text-teal-700 hover:bg-teal-50 dark:border-teal-800 dark:text-teal-400"
                                                    onClick={onAddRoom}>
                                                <Plus className="w-3 h-3"/> Tambah Ruangan
                                            </Button>
                                        </div>

                                        {roomCount === 0 ? (
                                            <div className="flex items-center justify-center py-5 gap-2 text-muted-foreground">
                                                <DoorOpen className="w-4 h-4 opacity-40"/>
                                                <span className="text-xs">Belum ada ruangan</span>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                                {ward.rooms.map((room) => (
                                                    <RoomCard
                                                        key={room.id}
                                                        room={room}
                                                        onDetail={(e) => {
                                                            e.stopPropagation();
                                                            navigate({to: `/facilities/inpatient/rooms/${room.id}`});
                                                        }}
                                                        onEdit={(e) => { e.stopPropagation(); onRoomEdit(room.id); }}
                                                        onDelete={async (e) => { e.stopPropagation(); await onRoomDelete(room.id); }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </Fragment>
    );
}