import SettingPage from "@/pages/settings/index.jsx";
import {usePatientStore} from "@/store/usePatientStore.js";
import {UserRoundCog, Plus, Pencil, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {useEffect} from "react";
import {TableCell, TableRow} from "@/components/ui/table.jsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";
import DataTable from "@/components/common/data-table.jsx";
import {Link} from "@tanstack/react-router";
import {asset, assets} from "@/services/apiCall.js";
import {Avatar} from "@radix-ui/react-avatar";
import {AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";
import {getInitials} from "@/hooks/use-helpers.js";

function PatientPage() {

    const {
        isLoading,
        fetchPatients,
        patients,
        currentPage,
        setCurrentPage,
        setOpenModal,
        columns,
        search,
        setSearch
    } = usePatientStore();


    useEffect(() => {
        fetchPatients({perPage: 20});
    }, [currentPage, search]);


    const renderRow = (patient, index) => {
        return (<TableRow key={patient.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium text-muted-foreground">
                    {patients.from + index}
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-15 w-15 ring-2 ring-background shadow-md overflow-hidden rounded-full">
                            {patient.profile_picture ? (
                                <AvatarImage
                                    src={asset(patient.profile_picture)}
                                    alt={patient.name}
                                    className="object-cover"
                                />
                            ) : (
                                <AvatarFallback className="bg-teal-600 text-white font-semibold">
                                    {getInitials(patient.full_name)}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div className="flex flex-col gap-1">
                            <p>
                                {patient.full_name}
                            </p>
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <span className="font-semibold text-foreground">
                                {patient.phone}
                            </span>
                        </div>
                    </div>
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                        <TooltipProvider>
                            <>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button asChild
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                                        >
                                            <Link to={"/settings/patients/" + patient.id}>
                                                <Pencil className="h-4 w-4"/>
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Edit Payment Method</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => setOpenDeleteModal(true, patient.id)}>
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Delete Payment Method</p>
                                    </TooltipContent>
                                </Tooltip>
                            </>
                        </TooltipProvider>
                    </div>
                </TableCell>
            </TableRow>
        );
    };


    return (
        <>
            <SettingPage>
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div
                                className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5">
                                <UserRoundCog className="w-6 h-6 text-primary"/>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-teal-500">
                                    Daftar Pasien
                                </h1>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Tambah dan kelola pasien
                                </p>
                            </div>
                        </div>
                    </div>
                    <Link to="/settings/patients/create">
                        <Button
                            className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                            onClick={() => setOpenModal(true)}
                            size="lg"
                        >
                            <Plus className="w-4 h-4"/>
                            Tambah Pasien
                        </Button>
                    </Link>
                </div>


                <DataTable
                    title="Payment Method Data"
                    description="Kelola dan atur metode pembayaran di seluruh sistem"
                    columns={columns()}
                    data={patients?.data || []}
                    isLoading={isLoading}
                    pagination={patients ? {
                        from: patients.from,
                        to: patients.to,
                        total: patients.total,
                        current_page: patients.current_page,
                        last_page: patients.last_page
                    } : null}
                    onPageChange={setCurrentPage}
                    currentPage={currentPage}
                    onSearch={setSearch}
                    search={search}
                    searchPlaceholder="Cari pasien..."
                    emptyStateIcon={UserRoundCog}
                    emptyStateText="No data found"
                    renderRow={renderRow}
                    showSearch={true}
                />

            </SettingPage>
        </>
    );

}

export default PatientPage;