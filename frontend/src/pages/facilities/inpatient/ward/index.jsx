import {useForm, Controller} from "react-hook-form";
import {useEffect, useMemo, useState} from "react";
import {
    DoorClosed,
    Pencil,
    Plus,
    Trash2,
    Building2,
    LayoutGrid,
    ChevronLeft,
    ChevronRight,
    DoorOpen, Layers,
    Stethoscope
} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import Modal from "@/components/common/modal.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {useWardStore} from "@/store/wardStore.js";
import {useDepartmentStore} from "@/store/departmentStore.js";
import {useBuildingStore} from "@/store/buildingStore.js";
import DataTable from "@/components/common/data-table.jsx";
import {AsyncSelect} from "@/components/common/async-select.jsx";
import {Fragment} from "react";


function WardPage() {

    const [expandedRows, setExpandedRows] = useState(new Set());

    const {
        isLoading,
        currentPage,
        search,
        wards,
        openModal,
        openDeleteModal,
        wardValue,
        columns,
        setCurrentPage,
        setSearch,
        setOpenModal,
        setOpenDeleteModal,
        fetchWards,
        createWard,
        updateWard,
        deleteWard,
        setWardValue,
    } = useWardStore();


    const {fetchBuildingOptions} = useBuildingStore();
    const {fetchDepartmentOptions} = useDepartmentStore();

    useEffect(() => {
        fetchWards({perPage: 20});
    }, [fetchWards, search, currentPage]);

    useEffect(() => {
        if (wardValue && !openDeleteModal) {
            reset({
                name: wardValue.name || "",
                floor: wardValue.floor || "",
                building_id: wardValue.building_id || "",
                department_id: wardValue.department_id || "",
            });
        } else {
            reset({name: "", description: ""});
        }
    }, [wardValue, openDeleteModal]);

    useEffect(() => {
        if (!openModal) {
            reset({name: "", description: ""});
            if (setWardValue) setWardValue(null);
        }
    }, [openModal, setWardValue]);


    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: {errors, isSubmitting}
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {
            name: "",
            description: "",
            building_id: "",
            department_id: "",
            floor: ""
        }
    });


    const toggleExpand = (id) => {
        setExpandedRows(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };


    const wardOnSubmit = async (data) => {
        if (wardValue) {
            await updateWard(data, wardValue.id);
        } else {
            await createWard(data);
        }
    }


    const renderRow = (ward, index) => {
        const isExpanded = expandedRows.has(ward.id);
        const roomCount = ward.rooms?.length ?? 0;
        const colSpan = 5;

        return (
            <Fragment key={ward.id}>
                {/* Baris Utama Ruang Rawat */}
                <TableRow
                    key={ward.id}
                    className="hover:bg-muted/50 transition-colors cursor-pointer select-none"
                    onClick={() => roomCount > 0 && toggleExpand(ward.id)}
                >
                    <TableCell className="font-medium text-muted-foreground">
                        {wards.from + index}
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            {/* Chevron toggle */}
                            <div className="flex items-center justify-center w-5 h-5 text-muted-foreground/60">
                                {roomCount > 0 ? (
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
                            <span className="font-semibold text-foreground">{ward.name}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <span className="text-sm text-muted-foreground line-clamp-2">
                            {ward.department.name}
                        </span>
                    </TableCell>
                    <TableCell>
                        <Badge
                            variant={roomCount > 0 ? "secondary" : "outline"}
                            className="flex items-center gap-1.5 w-fit px-2.5 py-1"
                        >
                            <DoorOpen className="w-3.5 h-3.5"/>
                            <span>{roomCount} Ruangan</span>
                        </Badge>
                    </TableCell>
                    <TableCell
                        className="text-right"
                        onClick={e => e.stopPropagation()}
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
                                                onClick={() => setOpenModal(ward.id)}
                                            >
                                                <Pencil className="h-4 w-4"/>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent><p>Ubah Ruang Rawat</p></TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() => setOpenDeleteModal(ward.id)}
                                            >
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent><p>Hapus Ruang Rawat</p></TooltipContent>
                                    </Tooltip>
                                </>
                            </TooltipProvider>
                        </div>
                    </TableCell>
                </TableRow>

                {roomCount > 0 && (
                    <TableRow key={`${ward.id}-rooms`}>
                        <TableCell colSpan={colSpan} className="p-0! border-0">
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
                                                    Daftar Ruangan — {ward.name}
                                                </span>
                                            </div>
                                            <div
                                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 pb-1">
                                                {/* ✅ FIX 3: Ganti nama variable inner loop dari 'ward' ke 'room' */}
                                                {ward.rooms.map((room) => (
                                                    <div key={room.id}
                                                         className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-background px-3 py-2 shadow-sm">
                                                        <div
                                                            className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/10 shrink-0">
                                                            <DoorOpen className="w-3.5 h-3.5 text-primary"/>
                                                        </div>
                                                        <div className="min-w-0">
                                                            {/* ✅ FIX 3: Pakai 'room' bukan 'ward' */}
                                                            <p className="text-sm font-medium text-foreground truncate">{room.name}</p>
                                                            <p className="text-xs text-muted-foreground">Nomor {room.room_number}</p>
                                                            <p className="text-xs text-muted-foreground">Kapasitas {room.capacity}</p>
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
                )}
            </Fragment>
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
                                Data Ruang Rawat
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Kelola Ruang Rawat
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => setOpenModal()}
                    size="lg"
                >
                    <Plus className="w-4 h-4"/> Tambah Ruang Rawat
                </Button>
            </div>


            <DataTable
                title="Tabel Ruang Rawat"
                description="Daftar ruang rawat yang tersedia"
                columns={columns()}
                data={wards?.data || []}
                isLoading={isLoading}
                pagination={wards ? {
                    from: wards.from,
                    to: wards.to,
                    total: wards.total,
                    current_page: wards.current_page,
                    last_page: wards.last_page
                } : null}
                onPageChange={setCurrentPage}
                currentPage={currentPage}
                onSearch={setSearch}
                search={search}
                searchPlaceholder="Cari ruang rawat..."
                emptyStateIcon={Stethoscope}
                emptyStateText="Tidak ada data ruang rawat ditemukan"
                renderRow={renderRow}
                showSearch={true}
            />


            {/* Ward Modal Form */}
            <Modal
                open={openModal}
                onOpenChange={setOpenModal}
                title={wardValue ? "Edit Ruang Rawat" : "Tambah Ruang Rawat"}
                description={wardValue ? "Ubah informasi ruang rawat" : "Tambahkan ruang rawat baru ke sistem."}
                onSubmit={handleSubmit(wardOnSubmit)}
                submitText={wardValue ? "Simpan Perubahan" : "Tambah Ruang Rawat"}
                isLoading={isSubmitting}
            >
                <div className="space-y-5 py-2">
                    <div className="space-y-2.5">
                        <Label htmlFor="name" className="text-sm font-semibold">
                            Nama Ruang Rawat <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Contoh: Ruang Rawat A"
                            {...register("name", {required: "Nama tidak boleh kosong"})}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>


                    <div className="space-y-2.5">
                        <Label htmlFor="floot" className="text-sm font-semibold">
                            Lantai <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            type="number"
                            placeholder="Contoh: 1"
                            {...register("floor", {required: "Lantai tidak boleh kosong"})}
                        />
                        {errors.floor && (
                            <p className="text-sm text-destructive">{errors.floor.message}</p>
                        )}
                    </div>

                    <div className="space-y-2.5">
                        <Label htmlFor="ruang rawat">
                            Ruang Rawat <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                            name="building_id"
                            control={control}
                            rules={{required: "Ruang Rawat tidak boleh kosong"}}
                            render={({field}) => (
                                <Controller
                                    name="building_id"
                                    control={control}
                                    rules={{required: "Ruang Rawat tidak boleh kosong"}}
                                    render={({field}) => (
                                        <AsyncSelect
                                            fetchFn={fetchBuildingOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Cari ruang rawat..."
                                            debounce={300}
                                            defaultLabel={wardValue?.building?.name ?? null}  // ✅
                                        />
                                    )}
                                />
                            )}
                        />
                        {errors.building_id && (
                            <p className="text-sm text-destructive">{errors.building_id.message}</p>
                        )}
                    </div>
                    <div className="space-y-2.5">
                        <Label htmlFor="role">
                            Departemen <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                            name="department_id"
                            control={control}
                            rules={{required: "Departemen tidak boleh kosong"}}
                            render={({field}) => (
                                <Controller
                                    name="department_id"
                                    control={control}
                                    rules={{required: "Departemen tidak boleh kosong"}}
                                    render={({field}) => (
                                        <AsyncSelect
                                            fetchFn={fetchDepartmentOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Cari departemen..."
                                            debounce={300}
                                            defaultLabel={wardValue?.department?.name ?? null}  // ✅
                                        />
                                    )}
                                />
                            )}
                        />
                        {errors.department_id && (
                            <p className="text-sm text-destructive">{errors.department_id.message}</p>
                        )}
                    </div>
                </div>
            </Modal>


            <Modal
                open={openDeleteModal}
                onOpenChange={setOpenDeleteModal}
                title="Hapus Ruang Rawat"
                description="Tindakan ini tidak dapat dibatalkan. Ruang Rawat akan dihapus permanen."
                onSubmit={() => deleteWard(wardValue.id)}
                submitText="Hapus Ruang Rawat"
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
                                    Anda akan menghapus ruang rawat:{" "}
                                    <span className="font-semibold text-foreground">{wardValue?.name}</span>
                                </p>
                                {wardValue?.rooms?.length > 0 && (
                                    <p className="text-sm text-destructive font-medium mt-1">
                                        ⚠️ Ruang Rawat ini memiliki {wardValue.rooms.length} Ruangan yang akan ikut
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

export default WardPage;