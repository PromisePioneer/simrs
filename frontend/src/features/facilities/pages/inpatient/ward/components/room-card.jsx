import {Pencil, Trash2, DoorOpen, BedDouble, ExternalLink} from "lucide-react";
import {Button} from "@shared/components/ui/button.jsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@shared/components/ui/tooltip.jsx";

export function RoomCard({room, onDetail, onEdit, onDelete}) {
    return (
        <div className="group flex items-center gap-2 rounded-md border bg-background px-2.5 py-2 hover:border-teal-200 dark:hover:border-teal-800 transition-colors">
            <div className="w-7 h-7 rounded-md bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center shrink-0">
                <DoorOpen className="w-3.5 h-3.5 text-teal-600"/>
            </div>

            <div className="min-w-0 flex-1 cursor-pointer" onClick={onDetail}>
                <p className="text-xs font-medium truncate group-hover:text-teal-600 transition-colors">
                    {room.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-muted-foreground">No. {room.room_number}</span>
                    <span className="text-muted-foreground/30">·</span>
                    <BedDouble className="w-2.5 h-2.5 text-muted-foreground"/>
                    <span className="text-[10px] text-muted-foreground">
                        {room.beds?.length ?? room.capacity}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm"
                                    className="h-5 w-5 p-0 hover:bg-teal-50 hover:text-teal-600"
                                    onClick={onDetail}>
                                <ExternalLink className="w-2.5 h-2.5"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Lihat Detail</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm"
                                    className="h-5 w-5 p-0 hover:bg-amber-50 hover:text-amber-600"
                                    onClick={onEdit}>
                                <Pencil className="w-2.5 h-2.5"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Edit</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm"
                                    className="h-5 w-5 p-0 hover:bg-red-50 hover:text-red-600"
                                    onClick={onDelete}>
                                <Trash2 className="w-2.5 h-2.5"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Hapus</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
}