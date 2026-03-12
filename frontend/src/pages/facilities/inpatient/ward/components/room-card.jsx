import {Pencil, Trash2, DoorOpen, BedDouble} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";

export function RoomCard({room, onDetail, onEdit, onDelete}) {
    return (
        <div className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-background px-3 py-2 shadow-sm group">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/10 shrink-0">
                <DoorOpen className="w-3.5 h-3.5 text-primary"/>
            </div>

            <div className="min-w-0 flex-1 cursor-pointer" onClick={onDetail}>
                <p className="text-sm font-medium text-foreground truncate hover:text-primary transition-colors">
                    {room.name}
                </p>
                <p className="text-xs text-muted-foreground">No. {room.room_number}</p>
                <div className="flex items-center gap-1 mt-0.5">
                    <BedDouble className="w-3 h-3 text-muted-foreground"/>
                    <p className="text-xs text-muted-foreground">
                        {room.beds?.length ?? room.capacity} Tempat Tidur
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm"
                                    className="h-6 w-6 p-0 hover:bg-primary/10 hover:text-primary"
                                    onClick={onEdit}>
                                <Pencil className="w-3 h-3"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Edit Ruangan</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm"
                                    className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                                    onClick={onDelete}>
                                <Trash2 className="w-3 h-3"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Hapus Ruangan</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
}