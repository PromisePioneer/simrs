import {CreditCard} from "lucide-react";
import {TableCell, TableRow} from "@shared/components/ui/table.jsx";


export const PaymentMethodsRow = ({item, checkboxCell, canEdit, setOpenModal}) => {
    return (
        <TableRow>
            {checkboxCell}
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
        </TableRow>
    );

}