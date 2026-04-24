import {Activity, Phone, FileText, Pencil, Trash2} from "lucide-react";
import {Link} from "@tanstack/react-router";
import {Button} from "@shared/components/ui/button.jsx";
import {TableCell, TableRow} from "@shared/components/ui/table.jsx";
import {Avatar} from "@radix-ui/react-avatar";
import {AvatarFallback, AvatarImage} from "@shared/components/ui/avatar.jsx";
import {getInitials} from "@shared/hooks";
import {Badge} from "@shared/components/ui/badge.jsx";
import {format} from "date-fns";
import {TooltipContent} from "@radix-ui/react-tooltip";
import {Tooltip, TooltipProvider, TooltipTrigger} from "@shared/components/ui/tooltip.jsx";
import {id} from "date-fns/locale";
import {asset} from "@shared/services/apiCall.js";

export const PatientRow = ({patients, patient, index}) => {

    return (
        <TableRow
            className="hover:bg-teal-50/50 transition-all duration-200 border-b border-gray-100 group cursor-pointer "
        >
            <TableCell className="font-semibold text-gray-500">
                #{(patients.meta?.from || 0) + index}
            </TableCell>

            {/* Patient Info */}
            <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar
                        className="h-12 w-12 ring-2 ring-white shadow-md overflow-hidden rounded-full group-hover:ring-teal-200 transition-all">
                        {patient.profile_picture ? (
                            <AvatarImage
                                src={asset(patient.profile_picture)}
                                alt={patient.full_name}
                                className="object-cover"
                            />
                        ) : (
                            <AvatarFallback className="bg-teal-500 text-white font-bold text-sm">
                                {getInitials(patient.full_name)}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <p className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                            {patient.full_name}
                        </p>
                        <Badge variant="secondary"
                               className="w-fit text-xs font-medium bg-gray-100 hover:bg-gray-200 transition-colors">
                            {patient.medical_record_number}
                        </Badge>
                    </div>
                </div>
            </TableCell>

            {/* Phone */}
            <TableCell>
                <Badge variant="outline" className="gap-2 font-normal border-gray-200">
                    <Phone className="w-3 h-3"/>
                    {patient.phone}
                </Badge>
            </TableCell>
            {/* Consultation Date */}
            <TableCell>
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                            {format(patient.date_of_consultation, 'dd MMM yyyy', {locale: id})}
                        </span>
                </div>
            </TableCell>

            {/* Diagnosis & Doctor */}
            <TableCell>
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-gray-400"/>
                        <span className="text-sm font-medium text-gray-900">
                                {patient.last_diagnosis || 'Belum ada diagnosis'}
                            </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-teal-500"/>
                        <span className="text-xs text-gray-600">
                                {patient.assigned_doctor || 'Belum ditentukan'}
                            </span>
                    </div>
                </div>
            </TableCell>

            {/* Actions */}
            <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                    <TooltipProvider>
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        size="sm"
                                        className="h-9 w-9 p-0 hover:bg-green-100 hover:text-green-600 transition-all"
                                    >
                                        <Link to={"/settings/patients/" + patient.id}>
                                            <Pencil className="h-4 w-4"/>
                                        </Link>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-gray-900 text-white">
                                    <p>Edit Pasien</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-9 w-9 p-0 hover:bg-red-100 hover:text-red-600 transition-all"
                                        onClick={() => setOpenDeleteModal(patient.id)}
                                    >
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-gray-900 text-white">
                                    <p>Hapus Pasien</p>
                                </TooltipContent>
                            </Tooltip>
                        </>
                    </TooltipProvider>
                </div>
            </TableCell>
        </TableRow>
    );
};
