import {Fragment} from "react";
import {Pencil, Trash2, Building2, ChevronRight, DoorOpen, Layers, Plus} from "lucide-react";
import {TableCell, TableRow} from "@/components/ui/table.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";
import {RoomCard} from "@/pages/facilities/inpatient/ward/components/room-card.jsx";

export function WardRow({
                            ward,
                            index,
                            isExpanded,
                            onToggle,
                            onEdit,
                            onDelete,
                            onAddRoom,
                            onRoomDetail,
                            onRoomEdit,
                            onRoomDelete
                        }) {
    const roomCount = ward.rooms?.length ?? 0;
    const colSpan = 5;

    return (
        <Fragment>
            <TableRow
                className="hover:bg-muted/50 transition-colors cursor-pointer select-none"
                onClick={onToggle}
            >
                <TableCell className="font-medium text-muted-foreground">{index}</TableCell>

                <TableCell>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-5 h-5 text-muted-foreground/60">
                            <ChevronRight className="w-4 h-4" style={{
                                transition: "transform 0.3s ease",
                                transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                                color: isExpanded ? "var(--primary)" : "currentColor",
                            }}/>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                            <Building2 className="w-5 h-5 text-primary"/>
                        </div>
                        <span className="font-semibold text-foreground">{ward.name}</span>
                    </div>
                </TableCell>

                <TableCell>
                    <span className="text-sm text-muted-foreground">{ward.department?.name}</span>
                </TableCell>

                <TableCell>
                    <Badge
                        variant={roomCount > 0 ? "secondary" : "outline"}
                        className="flex items-center gap-1.5 w-fit px-2.5 py-1"
                    >
                        <DoorOpen className="w-3.5 h-3.5"/>
                        <span>{roomCount} Ruangan</span>
                    </Badge>
                </TableCell>

                <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm"
                                            className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary"
                                            onClick={onEdit}>
                                        <Pencil className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Ubah Ruang Rawat</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm"
                                            className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
                                            onClick={onDelete}>
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Hapus Ruang Rawat</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </TableCell>
            </TableRow>

            {/* Collapsible rooms */}
            <TableRow>
                <TableCell colSpan={colSpan} className="p-0! border-0">
                    <div style={{
                        display: "grid",
                        gridTemplateRows: isExpanded ? "1fr" : "0fr",
                        transition: "grid-template-rows 0.3s cubic-bezier(0.4,0,0.2,1)",
                    }}>
                        <div style={{overflow: "hidden"}}>
                            <div style={{
                                opacity: isExpanded ? 1 : 0,
                                transform: isExpanded ? "translateY(0)" : "translateY(-6px)",
                                transition: "opacity 0.25s ease, transform 0.25s ease",
                                transitionDelay: isExpanded ? "0.05s" : "0s",
                            }}>
                                <div className="py-3 pl-16 pr-4 bg-muted/30">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Layers className="w-4 h-4 text-primary"/>
                                            <span
                                                className="text-xs font-semibold text-primary uppercase tracking-wider">
                                                Daftar Ruangan — {ward.name}
                                            </span>
                                        </div>
                                        <Button size="sm" variant="outline"
                                                className="h-7 px-2.5 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                                                onClick={onAddRoom}>
                                            <Plus className="w-3 h-3"/> Tambah Ruangan
                                        </Button>
                                    </div>

                                    {/* Room list */}
                                    {roomCount === 0 ? (
                                        <div
                                            className="flex items-center justify-center py-6 text-sm text-muted-foreground gap-2">
                                            <DoorOpen className="w-4 h-4"/>
                                            <span>Belum ada ruangan</span>
                                        </div>
                                    ) : (
                                        <div
                                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 pb-1">
                                            {ward.rooms.map((room) => (
                                                <RoomCard
                                                    key={room.id}
                                                    room={room}
                                                    onDetail={(e) => {
                                                        e.stopPropagation();
                                                        onRoomDetail(room);
                                                    }}
                                                    onEdit={(e) => {
                                                        e.stopPropagation();
                                                        onRoomEdit(room.id);
                                                    }}
                                                    onDelete={async (e) => {
                                                        e.stopPropagation();
                                                        await onRoomDelete(room.id);
                                                    }}
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
        </Fragment>
    );
}