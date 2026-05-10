import {CreditCard} from "lucide-react";
import {Button} from "@shared/components/ui/button.jsx";
import {TableCell} from "@shared/components/ui/table.jsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@shared/components/ui/tooltip.jsx";


export const PaymentMethodsRow = (item, canEdit, setOpenModal) => {
    return (
        <>
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && setOpenModal(item.id)}>
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        <CreditCard className="w-5 h-5 text-primary"/>
                    </div>
                    <div className="flex flex-col">
                            <span className="font-semibold text-foreground">
                                {item.name}
                            </span>
                    </div>
                </div>
            </TableCell>
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && setOpenModal(item.id)}>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                            <span className="font-semibold text-foreground">
                                {item?.type?.name}
                            </span>
                    </div>
                </div>
            </TableCell>
        </>
    );

}