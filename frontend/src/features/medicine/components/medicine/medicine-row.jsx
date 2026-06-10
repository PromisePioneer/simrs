import {TableCell, TableRow} from "@shared/components/ui/table.jsx";
import {Badge} from "@shared/components/ui/badge.jsx";
import {Button} from "@shared/components/ui/button.jsx";
import {Link} from "@tanstack/react-router";
import {Warehouse} from "lucide-react";

export const MedicineRow = ({item, checkboxCell, canEdit}) => {
    return (
        <TableRow>
            {checkboxCell}
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{item.sku}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{item.name}</span>
                        {item.is_for_sell ? (
                            <Badge
                                className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border border-emerald-200">
                                Dijual
                            </Badge>
                        ) : (
                            <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border border-slate-200">
                                Tidak Dijual
                            </Badge>
                        )}
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{item.type.toUpperCase()}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <Button className="hover:cursor-pointer" asChild>
                    <Link to={`/settings/medicine-management/medicine/stocks/${item.id}`}>
                        <Warehouse/>
                    </Link>
                </Button>
            </TableCell>
        </TableRow>
    );
}