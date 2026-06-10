import {Activity, Phone, FileText, Pencil, Trash2} from "lucide-react";
import {useNavigate} from "@tanstack/react-router";
import {TableCell, TableRow} from "@shared/components/ui/table.jsx";
import {Avatar} from "@radix-ui/react-avatar";
import {AvatarFallback, AvatarImage} from "@shared/components/ui/avatar.jsx";
import {getInitials} from "@shared/hooks";
import {Badge} from "@shared/components/ui/badge.jsx";
import {format} from "date-fns";
import {id} from "date-fns/locale";
import {asset} from "@shared/services/apiCall.js";

export const PatientRow = ({item, canEdit, checkboxCell}) => {
    const navigate = useNavigate();
    return (
        <>
            <TableRow>
                {checkboxCell}
                <TableCell
                    className="hover:cursor-pointer"
                    onClick={() => canEdit && navigate({
                        to: '/settings/patients/$patientId',
                        params: {patientId: item.id}
                    })}>
                    <div className="flex items-center gap-3">
                        <Avatar
                            className="h-12 w-12 ring-2 ring-white shadow-md overflow-hidden rounded-full group-hover:ring-teal-200 transition-all">
                            {item.profile_picture ? (
                                <AvatarImage
                                    src={asset(item.profile_picture)}
                                    alt={item.full_name}
                                    className="object-cover"
                                />
                            ) : (
                                <AvatarFallback className="bg-teal-500 text-white font-bold text-sm">
                                    {getInitials(item.full_name)}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div className="flex flex-col gap-1">
                            <p className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                                {item.full_name}
                            </p>
                            <Badge variant="secondary"
                                   className="w-fit text-xs font-medium bg-gray-100 hover:bg-gray-200 transition-colors">
                                {item.medical_record_number}
                            </Badge>
                        </div>
                    </div>
                </TableCell>

                {/* Phone */}
                <TableCell
                    className="hover:cursor-pointer"
                    onClick={() => canEdit && navigate({
                        to: '/settings/patients/$patientId',
                        params: {patientId: item.id}
                    })}>
                    <Badge variant="outline" className="gap-2 font-normal border-gray-200">
                        <Phone className="w-3 h-3"/>
                        {item.phone}
                    </Badge>
                </TableCell>
                {/* Consultation Date */}
                <TableCell
                    className="hover:cursor-pointer"
                    onClick={() => canEdit && navigate({
                        to: '/settings/patients/$patientId',
                        params: {patientId: item.id}
                    })}>
                    <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                            {format(item.date_of_consultation, 'dd MMM yyyy', {locale: id})}
                        </span>
                    </div>
                </TableCell>

                {/* Diagnosis & Doctor */}
                <TableCell
                    className="hover:cursor-pointer"
                    onClick={() => canEdit && navigate({
                        to: '/settings/patients/$patientId',
                        params: {patientId: item.id}
                    })}>
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-gray-400"/>
                            <span className="text-sm font-medium text-gray-900">
                                {item.last_diagnosis || 'Belum ada diagnosis'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5 text-teal-500"/>
                            <span className="text-xs text-gray-600">
                                {item.assigned_doctor || 'Belum ditentukan'}
                            </span>
                        </div>
                    </div>
                </TableCell>
            </TableRow>
        </>
    );
};
