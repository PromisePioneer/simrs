import {useBuildingStore} from "@/store/buildingStore.js";
import {TableCell, TableRow} from "@/components/ui/table.jsx";
import {Pencil, Plus, Trash2, Building2, DoorOpen, ChevronRight, Layers} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import DataTable from "@/components/common/data-table.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import Modal from "@/components/common/modal.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";

function BuildingPage() {
    const {
        isLoading, currentPage, search, buildings, openModal, openDeleteModal, buildingValue,
        setCurrentPage, setSearch, setOpenModal, columns, setOpenDeleteModal,
        fetchBuildings, createBuilding, updateBuilding, deleteBuilding, setBuildingValue,
    } = useBuildingStore();

    const [expandedRows, setExpandedRows] = useState(new Set());

    const toggleExpand = (id) => {
        setExpandedRows(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const {register, handleSubmit, reset, formState: {errors, isSubmitting}} = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {name: "", description: ""},
    });

    useEffect(() => { fetchBuildings({perPage: 20}); }, [fetchBuildings, search, currentPage]);

    useEffect(() => {
        if (buildingValue && !openDeleteModal) {
            reset({name: buildingValue.name || "", description: buildingValue.description || ""});
        } else {
            reset({name: "", description: ""});
        }
    }, [buildingValue, openDeleteModal]);

    useEffect(() => {
        if (!openModal) {
            reset({name: "", description: ""});
            if (setBuildingValue) setBuildingValue(null);
        }
    }, [openModal, setBuildingValue]);

    const onSubmit = async (data) => {
        if (buildingValue) await updateBuilding(buildingValue.id, data);
        else await createBuilding(data);
    };

    const renderRow = (building, index) => {
        const isExpanded = expandedRows.has(building.id);
        const wardCount = building.wards?.length ?? 0;

        return (
            <>
                <TableRow
                    key={building.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer select-none"
                    onClick={() => wardCount > 0 && toggleExpand(building.id)}
                >
                    <TableCell className="text-sm text-muted-foreground w-12">
                        {buildings.from + index}
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 flex items-center justify-center text-muted-foreground/50 shrink-0">
                                {wardCount > 0 && (
                                    <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200"
                                                  style={{transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)"}}/>
                                )}
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center shrink-0">
                                <Building2 className="w-4 h-4 text-teal-600"/>
                            </div>
                            <span className="font-medium text-sm">{building.name}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <span className="text-sm text-muted-foreground line-clamp-1">
                            {building.description || <span className="italic opacity-40">—</span>}
                        </span>
                    </TableCell>
                    <TableCell>
                        <Badge variant={wardCount > 0 ? "secondary" : "outline"}
                               className="gap-1.5 font-normal">
                            <DoorOpen className="w-3 h-3"/>
                            {wardCount} Ruang Rawat
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-end gap-0.5">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="sm"
                                                className="h-8 w-8 p-0 hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-teal-950/40"
                                                onClick={() => setOpenModal(building.id)}>
                                            <Pencil className="h-3.5 w-3.5"/>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Edit Gedung</p></TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="sm"
                                                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                                                onClick={() => setOpenDeleteModal(building.id)}>
                                            <Trash2 className="h-3.5 w-3.5"/>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Hapus Gedung</p></TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </TableCell>
                </TableRow>

                {/* Expanded wards */}
                <TableRow key={`${building.id}-wards`}>
                    <TableCell colSpan={5} className="!p-0 border-0">
                        <div style={{
                            display: "grid",
                            gridTemplateRows: isExpanded ? "1fr" : "0fr",
                            transition: "grid-template-rows 0.25s cubic-bezier(0.4,0,0.2,1)",
                        }}>
                            <div style={{overflow: "hidden"}}>
                                <div style={{
                                    opacity: isExpanded ? 1 : 0,
                                    transition: "opacity 0.2s ease",
                                    transitionDelay: isExpanded ? "0.05s" : "0s",
                                }}>
                                    <div className="py-3 pl-14 pr-4 bg-muted/20 border-b">
                                        <div className="flex items-center gap-2 mb-2.5">
                                            <Layers className="w-3.5 h-3.5 text-muted-foreground"/>
                                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Ruang Rawat — {building.name}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                            {building.wards?.map((ward) => (
                                                <div key={ward.id}
                                                     className="flex items-center gap-2 rounded-md border bg-background px-2.5 py-2">
                                                    <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center shrink-0">
                                                        <DoorOpen className="w-3 h-3 text-indigo-600"/>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-medium truncate">{ward.name}</p>
                                                        <p className="text-[10px] text-muted-foreground">Lantai {ward.floor}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            </>
        );
    };

    return (
        <>
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-sm font-semibold text-foreground">Data Gedung</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Kelola data gedung rawat inap</p>
                </div>
                <Button size="sm" className="gap-1.5 h-8 text-xs bg-teal-600 hover:bg-teal-700 text-white"
                        onClick={() => setOpenModal()}>
                    <Plus className="w-3.5 h-3.5"/> Tambah Gedung
                </Button>
            </div>

            <DataTable
                title="Tabel Gedung"
                description="Daftar gedung yang tersedia"
                columns={columns()}
                data={buildings?.data || []}
                isLoading={isLoading}
                pagination={buildings ? {
                    from: buildings.from, to: buildings.to, total: buildings.total,
                    current_page: buildings.current_page, last_page: buildings.last_page,
                } : null}
                onPageChange={setCurrentPage}
                currentPage={currentPage}
                onSearch={setSearch}
                search={search}
                searchPlaceholder="Cari gedung..."
                emptyStateIcon={Building2}
                emptyStateText="Tidak ada data gedung ditemukan"
                renderRow={renderRow}
                showSearch={true}
            />

            {/* Modal Tambah / Edit */}
            <Modal
                open={openModal} onOpenChange={setOpenModal}
                title={buildingValue ? "Edit Gedung" : "Tambah Gedung"}
                description={buildingValue ? "Ubah informasi gedung" : "Tambahkan gedung baru ke sistem."}
                onSubmit={handleSubmit(onSubmit)}
                submitText={buildingValue ? "Simpan Perubahan" : "Tambah Gedung"}
                isLoading={isSubmitting}
            >
                <div className="space-y-4 py-1">
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm font-medium">
                            Nama Gedung <span className="text-destructive">*</span>
                        </Label>
                        <Input id="name" placeholder="Contoh: Gedung A"
                               {...register("name", {required: "Nama gedung tidak boleh kosong"})}/>
                        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="description" className="text-sm font-medium">Deskripsi</Label>
                        <Textarea id="description" placeholder="Masukkan deskripsi gedung..."
                                  className="resize-none" rows={3}
                                  {...register("description")}/>
                    </div>
                </div>
            </Modal>

            {/* Modal Hapus */}
            <Modal
                open={openDeleteModal} onOpenChange={setOpenDeleteModal}
                title="Hapus Gedung"
                description="Tindakan ini tidak dapat dibatalkan. Gedung akan dihapus permanen."
                onSubmit={() => deleteBuilding(buildingValue.id)}
                submitText="Hapus Gedung"
                type="danger"
                isLoading={isLoading}
            >
                <div className="py-1">
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-4">
                        <p className="text-sm font-medium text-foreground">
                            Anda akan menghapus:{" "}
                            <span className="text-red-600 dark:text-red-400">{buildingValue?.name}</span>
                        </p>
                        {buildingValue?.wards?.length > 0 && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                                ⚠️ {buildingValue.wards.length} Ruang Rawat di dalamnya akan ikut terhapus.
                            </p>
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default BuildingPage;