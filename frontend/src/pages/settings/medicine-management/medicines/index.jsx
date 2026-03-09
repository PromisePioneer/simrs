import {useEffect} from "react";
import {TableCell, TableRow} from "@/components/ui/table.jsx";
import {CircleEllipsis, Pencil, Plus, Trash2, Archive, Warehouse, Award} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import DataTable from "@/components/common/data-table.jsx";
import Modal from "@/components/common/modal.jsx";
import {Link} from "@tanstack/react-router";
import {useMedicineStore} from "@/store/medicineStore.js";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup, DropdownMenuItem, DropdownMenuShortcut,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {Badge} from "@/components/ui/badge.jsx";


function MedicinePage() {

    const {
        isLoading,
        search,
        setSearch,
        medicines,
        currentPage,
        setCurrentPage,
        columns,
        fetchMedicines,
        openDeleteModal,
        setOpenDeleteModal,
        medicineValue,
        deleteMedicine,
    } = useMedicineStore();


    useEffect(() => {
        fetchMedicines({perPage: 20});
    }, [currentPage, search]);

    const renderRow = (medicine, index) => (
            <TableRow key={medicine.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium text-muted-foreground">
                    {medicines.from + index}
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <span className="font-semibold text-foreground">{medicine.sku}</span>
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{medicine.name}</span>
                            {medicine.is_for_sell ? (
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border border-emerald-200">
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
                            <span className="font-semibold text-foreground">{medicine.type.toUpperCase()}</span>
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <Button className="hover:cursor-pointer" asChild>
                        <Link to={`/settings/medicine-management/medicine/stocks/${medicine.id}`}>
                            <Warehouse/>
                        </Link>
                    </Button>
                </TableCell>
                <TableCell className="text-right">

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <CircleEllipsis/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuGroup>
                                <Link to={`/settings/medicine-management/medicine/${medicine.id}`}>
                                    <DropdownMenuItem>

                                        Edit
                                        <DropdownMenuShortcut>
                                            <Pencil/>
                                        </DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem onClick={() => setOpenDeleteModal(medicine.id)}>
                                    Hapus
                                    <DropdownMenuShortcut>
                                        <Trash2/>
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
        )
    ;


    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5">
                            <Award className="w-6 h-6 text-primary"/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-teal-500">
                                Data Obat
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Kelola data obat
                            </p>
                        </div>
                    </div>
                </div>

                <Button
                    className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                    size="lg" asChild
                >
                    <Link to="/settings/medicine-management/medicine/create">
                        <Plus className="w-4 h-4"/> Tambah Obat
                    </Link>
                </Button>
            </div>

            <DataTable
                title="Tabel Obat"
                description="Daftar Obat yang dijual"
            columns={columns()}
                data={medicines?.data || []}
                isLoading={isLoading}
                pagination={medicines ? {
                    from: medicines.from, to: medicines.to, total: medicines.total,
                    current_page: medicines.current_page, last_page: medicines.last_page
                } : null}
                onPageChange={setCurrentPage}
                currentPage={currentPage}
                onSearch={setSearch}
                search={search}
                searchPlaceholder="Cari obat..."
                emptyStateIcon={Archive}
                emptyStateText="Tidak ada daftar obat ditemukan"
                renderRow={renderRow}
                showSearch={true}
            />

            {/* Modal Degree: Delete */}
            <Modal
                open={openDeleteModal}
                onOpenChange={setOpenDeleteModal}
                title="Hapus Obat"
                description="Tindakan ini tidak dapat dibatalkan. obat akan dihapus permanen."
                onSubmit={() => deleteMedicine(medicineValue.id)}
                submitText="Hapus obat"
                type="danger"
                isLoading={isLoading}
            >
                <div className="space-y-4 py-2">
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                        <div className="flex gap-3">
                            <div className="shrink-0">
                                <div
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/20">
                                    <Trash2 className="w-5 h-5 text-destructive"/>
                                </div>
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-semibold text-foreground">Konfirmasi Penghapusan</p>
                                <p className="text-sm text-muted-foreground">Anda akan menghapus obat: <span
                                    className="font-semibold text-foreground">{medicineValue?.name}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default MedicinePage;