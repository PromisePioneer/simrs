import {TableCell} from "@shared/components/ui/table.jsx";
import {Archive, Pill} from "lucide-react";
import {Link, useNavigate} from "@tanstack/react-router";

export const MedicineWarehouseRow = ({item, canEdit}) => {

    const navigate = useNavigate();

    return (
        <>
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && navigate({
                    to: '/settings/medicine-management/warehouse/$medicineWarehouseId',
                    params: {medicineWarehouseId: item.id}
                })}>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{item.code}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && navigate({
                    to: '/settings/medicine-management/warehouse/$medicineWarehouseId',
                    params: {medicineWarehouseId: item.id}
                })}>
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        <Pill className="w-5 h-5 text-primary"/>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{item.name}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && navigate({
                    to: '/settings/medicine-management/warehouse/$medicineWarehouseId',
                    params: {medicineWarehouseId: item.id}
                })}>
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        <Archive/>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{item.racks_count}</span>
                    </div>
                </div>
            </TableCell>
        </>
    );
}