import {TableCell} from "@shared/components/ui/table.jsx";
import {Award} from "lucide-react";


export const PoliRow = ({item, canEdit, setOpenModal}) => {
    return (
        <>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        <Award className="w-5 h-5 text-primary"/>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{item.name}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <span className="font-semibold text-teal-600">
                    {item.consultation_fee ? `Rp ${Number(item.consultation_fee).toLocaleString('id-ID')}` : '-'}
                </span>
            </TableCell>
        </>
    )
}