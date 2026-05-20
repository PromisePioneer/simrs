import {TableCell} from "@shared/components/ui/table.jsx";
import {Lock, Settings, Shield} from "lucide-react";
import {Badge} from "@shared/components/ui/badge.jsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@shared/components/ui/tooltip.jsx";
import {Button} from "@shared/components/ui/button.jsx";


export const RoleRow = ({item, canEdit, setOpenModal, setOpenPermissionModal}) => {
    const isGlobalRole = item.tenant_id === null;
    const canModify = !isGlobalRole;
    return (
        <>
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canModify && setOpenModal(item.uuid)}>
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        <Shield className="w-5 h-5 text-primary"/>
                    </div>
                    <div className="flex flex-col">
                            <span className="font-semibold text-foreground">
                                {item.name}
                            </span>
                        {isGlobalRole && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <Lock className="w-3 h-3"/>
                                    System Role
                                </span>
                        )}
                    </div>
                </div>
            </TableCell>
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canModify && setOpenModal(item.uuid)}>
                <Badge
                    variant={isGlobalRole ? 'destructive' : 'default'}
                    className="font-medium"
                >
                    {isGlobalRole ? 'Global' : 'Tenant'}
                </Badge>
            </TableCell>
            <TableCell
                onClick={() => canModify && setOpenModal(item.uuid)}
                className="hover:cursor-pointer text-sm text-muted-foreground">
                {new Date(item.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })}
            </TableCell>
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canModify && setOpenModal(item.uuid)}>
                <TooltipProvider>
                    {canModify && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                                    onClick={() => setOpenPermissionModal(item.uuid)}
                                >
                                    <Settings className="h-4 w-4"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Assign Permissions</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </TooltipProvider>
            </TableCell>
        </>
    );
}