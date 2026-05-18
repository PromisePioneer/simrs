import {TableCell} from "@shared/components/ui/table.jsx";
import {Stethoscope} from "lucide-react";
import {Badge} from "@shared/components/ui/badge.jsx";
import {DISEASE_STATUS_BADGE} from "@features/settings/pages/constants/index.js";

export const DiseaseRow = ({item, canEdit, setOpenModal}) => {
    return (
        <>
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && setOpenModal(item.id)}>
                <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{item.code}</span>
            </TableCell>
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && setOpenModal(item.id)}>
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        <Stethoscope className="w-5 h-5 text-primary"/>
                    </div>
                    <span className="font-semibold text-foreground">{item.name}</span>
                </div>
            </TableCell>
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && setOpenModal(item.id)}>
                <span className="text-sm text-muted-foreground">{item.symptoms ?? '-'}</span>
            </TableCell>
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && setOpenModal(item.id)}>
                <span className="text-sm text-foreground">{item.description ?? '-'}</span>
            </TableCell>
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && setOpenModal(item.id)}>
                <Badge className={DISEASE_STATUS_BADGE[item.status]?.className}
                       variant={DISEASE_STATUS_BADGE[item.status]?.variant}>
                    {DISEASE_STATUS_BADGE[item.status]?.label}
                </Badge>
            </TableCell>
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && setOpenModal(item.id)}>
                <Badge variant={item.valid_code === "1" ? "default" : "outline"}>
                    {item.valid_code === "1" ? "Valid" : "Tidak Valid"}
                </Badge>
            </TableCell>

        </>
    );
}