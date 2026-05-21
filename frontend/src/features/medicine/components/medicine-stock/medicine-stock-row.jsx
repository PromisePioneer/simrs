import {TableCell} from "@shared/components/ui/table.jsx";
import {format} from "date-fns";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@shared/components/ui/tooltip.jsx";
import {Button} from "@shared/components/ui/button.jsx";
import {Pencil, Trash2} from "lucide-react";


export const MedicineStockRow = ({item, canEdit, setOpenModal}) => {
    return (
        <>
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && setOpenModal(item.id)}>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{item.batch_number}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && setOpenModal(item.id)}>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{item.stock?.rack.name}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && setOpenModal(item.id)}>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{item.stock?.warehouse?.name}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && setOpenModal(item.id)}>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span
                            className="font-semibold text-foreground">{format(item.expired_date, 'd/M/yyyy')}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && setOpenModal(item.id)}>
                <span className="font-semibold text-foreground">{item.stock?.stock_amount}</span>
            </TableCell>
        </>
    );
}