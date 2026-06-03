import {TableCell, TableRow} from "@shared/components/ui/table.jsx";
import {Badge} from "@shared/components/ui/badge.jsx";


const formatCurrency = (value) =>
    `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;
export const RoomTypeRow = ({item, checkboxCell, canEdit, setOpenModal}) => {
    return (
        <TableRow>
            {checkboxCell}
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && setOpenModal(item.id)}>
                <span className="font-semibold text-foreground">{item.code}</span>
            </TableCell>
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && setOpenModal(item.id)}>
                <span className="font-semibold text-foreground">{item.name}</span>
            </TableCell>
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && setOpenModal(item.id)}>
                <span className="text-foreground">{item.default_capacity}</span>
            </TableCell>
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && setOpenModal(item.id)}>
                {item.rate_per_night > 0 ? (
                    <Badge variant="outline"
                           className="text-teal-700 border-teal-300 bg-teal-50 dark:bg-teal-950/30 font-semibold">
                        {formatCurrency(item.rate_per_night)}
                    </Badge>
                ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                )}
            </TableCell>
        </TableRow>
    )
}