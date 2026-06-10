import {TableCell, TableRow} from "@shared/components/ui/table.jsx";
import {Avatar, AvatarFallback, AvatarImage} from "@shared/components/ui/avatar.jsx";
import {asset} from "@shared/services/index.js";
import {getInitials} from "@shared/hooks/index.js";
import {Link, useNavigate} from "@tanstack/react-router";
import {MailWarning, MailCheck, Phone, MapPin} from "lucide-react";
import {Badge} from "@shared/components/ui/badge.jsx";

export const UserRow = ({item, canEdit, getRoleBadgeVariant, checkboxCell}) => {

    const navigate = useNavigate();

    return (
        <TableRow>
            {checkboxCell}
            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && navigate({
                    to: '/settings/users-management/users/$userId',
                    params: {userId: item.id}
                })}>
                <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 ring-2 ring-background shadow-md">
                        {item.profile_picture ? (
                            <AvatarImage
                                src={asset(item.profile_picture)}
                                alt={item.name}
                                className="object-cover"
                            />
                        ) : (
                            <AvatarFallback className="bg-teal-600 text-white font-semibold">
                                {getInitials(item.name)}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <Link
                            to="/settings/users-management/users/$id/detail"
                            params={{id: item.id}}
                            className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1.5"
                        >
                            {item.name}
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            {item.email_verified_at
                                ? <MailCheck className="w-4 h-4 text-teal-600"/>
                                : <MailWarning className="w-4 h-4 text-amber-400"/>}
                            <span className="font-mono">{item.email}</span>
                        </div>
                    </div>
                </div>
            </TableCell>

            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && navigate({
                    to: '/settings/users-management/users/$userId',
                    params: {userId: item.id}
                })}>
                <Badge
                    variant={getRoleBadgeVariant(item.roles[0]?.name)}
                    className="font-medium"
                >
                    {item.roles[0]?.name || 'No Role'}
                </Badge>
            </TableCell>

            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && navigate({
                    to: '/settings/users-management/users/$userId',
                    params: {userId: item.id}
                })}>
                {item.phone ? (
                    <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground"/>
                        <span className="font-medium">{item.phone}</span>
                    </div>
                ) : (
                    <Badge variant="outline" className="text-xs gap-1">
                        <Phone className="h-3 w-3"/>
                        Not set
                    </Badge>
                )}
            </TableCell>

            <TableCell
                className="hover:cursor-pointer"
                onClick={() => canEdit && navigate({
                    to: '/settings/users-management/users/$userId',
                    params: {userId: item.id}
                })}>
                {item.address ? (
                    <div className="flex items-start gap-2 text-sm max-w-[250px]">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0"/>
                        <span className="line-clamp-2 text-muted-foreground">{item.address}</span>
                    </div>
                ) : (
                    <Badge variant="outline" className="text-xs gap-1">
                        <MapPin className="h-3 w-3"/>
                        Not set
                    </Badge>
                )}
            </TableCell>
        </TableRow>
    );
}