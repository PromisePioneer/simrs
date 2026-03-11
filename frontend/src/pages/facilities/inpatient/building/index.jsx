import {useBuildingStore} from "@/store/buildingStore.js";
import {TableCell, TableRow} from "@/components/ui/table.jsx";
import {Pencil, Plus, Trash2, Building2, DoorOpen, ChevronDown, ChevronRight, Layers} from "lucide-react";
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
        isLoading,
        currentPage,
        search,
        buildings,
        openModal,
        openDeleteModal,
        buildingValue,

        setCurrentPage,
        setSearch,
        setOpenModal,
        columns,
        setOpenDeleteModal,
        fetchBuildings,
        createBuilding,
        updateBuilding,
        deleteBuilding,
        setBuildingValue
    } = useBuildingStore();

    const [expandedRows, setExpandedRows] = useState(new Set());

    const toggleExpand = (id) => {
        setExpandedRows(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting}
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {
            name: "",
            description: ""
        }
    });

    useEffect(() => {
        fetchBuildings({perPage: 20});
    }, [fetchBuildings, search, currentPage]);

    useEffect(() => {
        if (buildingValue && !openDeleteModal) {
            reset({
                name: buildingValue.name || "",
                description: buildingValue.description || ""
            });
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
        if (buildingValue) {
            await updateBuilding(buildingValue.id, data);
        } else {
            await createBuilding(data);
        }
    };

    const renderRow = (building, index) => {
        const isExpanded = expandedRows.has(building.id);
        const wardCount = building.wards?.length ?? 0;
        // jumlah kolom total (no + nama + deskripsi + ruangan + aksi = 5)
        const colSpan = 5;

        return (
            <>
                {/* Baris Utama Gedung */}
                <TableRow
                    key={building.id}
                    className="hover:bg-muted/50 transition-colors cursor-pointer select-none"
                    onClick={() => wardCount > 0 && toggleExpand(building.id)}
                >
                    <TableCell className="font-medium text-muted-foreground">
                        {buildings.from + index}
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            {/* Chevron toggle */}
                            <div className="flex items-center justify-center w-5 h-5 text-muted-foreground/60">
                                {wardCount > 0 ? (
                                    <ChevronRight
                                        className="w-4 h-4"
                                        style={{
                                            transition: "transform 0.3s ease",
                                            transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                                            color: isExpanded ? "var(--primary)" : "currentColor",
                                        }}
                                    />
                                ) : (
                                    <span className="w-4 h-4"/>
                                )}
                            </div>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                <Building2 className="w-5 h-5 text-primary"/>
                            </div>
                            <span className="font-semibold text-foreground">{building.name}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <span className="text-sm text-muted-foreground line-clamp-2">
                            {building.description || (
                                <span className="italic text-muted-foreground/50">Tidak ada deskripsi</span>
                            )}
                        </span>
                    </TableCell>
                    <TableCell>
                        <Badge
                            variant={wardCount > 0 ? "secondary" : "outline"}
                            className="flex items-center gap-1.5 w-fit px-2.5 py-1"
                        >
                            <DoorOpen className="w-3.5 h-3.5"/>
                            <span>{wardCount} Ruangan</span>
                        </Badge>
                    </TableCell>
                    <TableCell
                        className="text-right"
                        onClick={e => e.stopPropagation()} // biar klik aksi tidak toggle expand
                    >
                        <div className="flex justify-end gap-1">
                            <TooltipProvider>
                                <>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary"
                                                onClick={() => setOpenModal(building.id)}
                                            >
                                                <Pencil className="h-4 w-4"/>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent><p>Ubah Gedung</p></TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() => setOpenDeleteModal(building.id)}
                                            >
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent><p>Hapus Gedung</p></TooltipContent>
                                    </Tooltip>
                                </>
                            </TooltipProvider>
                        </div>
                    </TableCell>
                </TableRow>

                {/* Baris Expand: Daftar Ruangan */}

                    <TableRow key={`${building.id}-wards`}>
                        <TableCell colSpan={colSpan} className="!p-0 border-0">
                            {/* Tiru persis Collapse component dari ListCard */}
                            <div style={{
                                display: "grid",
                                gridTemplateRows: isExpanded ? "1fr" : "0fr",
                                transition: "grid-template-rows 0.3s cubic-bezier(0.4,0,0.2,1)",
                            }}>
                                <div style={{overflow: "hidden"}}>
                                    <div style={{
                                        opacity: isExpanded ? 1 : 0,
                                        transform: isExpanded ? "translateY(0)" : "translateY(-6px)",
                                        transition: "opacity 0.25s ease, transform 0.25s ease",
                                        transitionDelay: isExpanded ? "0.05s" : "0s",
                                    }}>
                                        <div className="py-3 pl-16 pr-4 bg-muted/30">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Layers className="w-4 h-4 text-primary"/>
                                                <span
                                                    className="text-xs font-semibold text-primary uppercase tracking-wider">
                                Daftar Ruangan — {building.name}
                            </span>
                                            </div>
                                            <div
                                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 pb-1">
                                                {building.wards.map((ward) => (
                                                    <div key={ward.id}
                                                         className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-background px-3 py-2 shadow-sm">
                                                        <div
                                                            className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/10 shrink-0">
                                                            <DoorOpen className="w-3.5 h-3.5 text-primary"/>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-foreground truncate">{ward.name}</p>
                                                            <p className="text-xs text-muted-foreground">Lantai {ward.floor}</p>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5">
                            <Building2 className="w-6 h-6 text-primary"/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-teal-500">
                                Data Gedung
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Kelola Gedung
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => setOpenModal()}
                    size="lg"
                >
                    <Plus className="w-4 h-4"/> Tambah Gedung
                </Button>
            </div>

            <DataTable
                title="Tabel Gedung"
                description="Daftar gedung yang tersedia"
                columns={columns()}
                data={buildings?.data || []}
                isLoading={isLoading}
                pagination={buildings ? {
                    from: buildings.from,
                    to: buildings.to,
                    total: buildings.total,
                    current_page: buildings.current_page,
                    last_page: buildings.last_page
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
                open={openModal}
                onOpenChange={setOpenModal}
                title={buildingValue ? "Edit Gedung" : "Tambah Gedung"}
                description={buildingValue ? "Ubah informasi gedung" : "Tambahkan gedung baru ke sistem."}
                onSubmit={handleSubmit(onSubmit)}
                submitText={buildingValue ? "Simpan Perubahan" : "Tambah Gedung"}
                isLoading={isSubmitting}
            >
                <div className="space-y-5 py-2">
                    <div className="space-y-2.5">
                        <Label htmlFor="name" className="text-sm font-semibold">
                            Nama Gedung <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Contoh: Gedung A"
                            {...register("name", {required: "Nama gedung tidak boleh kosong"})}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Deskripsi <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Masukkan deskripsi gedung..."
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">{errors.description.message}</p>
                        )}
                    </div>
                </div>
            </Modal>

            {/* Modal Hapus */}
            <Modal
                open={openDeleteModal}
                onOpenChange={setOpenDeleteModal}
                title="Hapus Gedung"
                description="Tindakan ini tidak dapat dibatalkan. Gedung akan dihapus permanen."
                onSubmit={() => deleteBuilding(buildingValue.id)}
                submitText="Hapus Gedung"
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
                                <p className="text-sm text-muted-foreground">
                                    Anda akan menghapus gedung:{" "}
                                    <span className="font-semibold text-foreground">{buildingValue?.name}</span>
                                </p>
                                {buildingValue?.wards?.length > 0 && (
                                    <p className="text-sm text-destructive font-medium mt-1">
                                        ⚠️ Gedung ini memiliki {buildingValue.wards.length} ruangan yang akan ikut
                                        terhapus.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default BuildingPage;