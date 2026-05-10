import {TableCell} from "@shared/components/ui/table.jsx";
import {Award} from "lucide-react";


export const DegreeRow = (degree, index, canEdit, setOpenModal) => {
    return (
        <>
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && setOpenModal(degree.id)}>
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        <Award className="w-5 h-5 text-primary"/>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{degree.name}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell className="hover:cursor-pointer"
                       onClick={() => canEdit && setOpenModal(degree.id)}>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{degree.type}</span>
                    </div>
                </div>
            </TableCell>
        </>
    );
}