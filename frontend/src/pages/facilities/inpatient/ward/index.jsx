import {useForm} from "react-hook-form";
import {useEffect, useMemo} from "react";
import {DoorClosed, Pencil, Plus, Trash2, Building2, LayoutGrid, ChevronLeft, ChevronRight} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card.jsx";
import Modal from "@/components/common/modal.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {useWardStore} from "@/store/wardStore.js";

function WardPage() {
    const {
        isLoading,
        currentPage,
        search,
        wards,
        openModal,
        openDeleteModal,
        wardValue,
        setCurrentPage,
        setSearch,
        setOpenModal,
        setOpenDeleteModal,
        fetchWards,
        createWard,
        updateWard,
        deleteWard,
        setWardValue
    } = useWardStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting}
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {name: "", description: ""}
    });

    useEffect(() => {
        fetchWards({perPage: 20});
    }, [fetchWards, search, currentPage]);

    useEffect(() => {
        if (wardValue && !openDeleteModal) {
            reset({name: wardValue.name || "", description: wardValue.description || ""});
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

    const onSubmit = async (data) => {
        if (wardValue) {
            await updateWard(wardValue.id, data);
        } else {
            await createWard(data);
        }
    };

    // Group: building_id -> department_id -> wards[]
    const grouped = useMemo(() => {
        const data = wards?.data || [];
        const map = {};

        data.forEach(ward => {
            const bId = ward.building_id;
            const dId = ward.department_id;

            if (!map[bId]) {
                map[bId] = {
                    building: ward.building,
                    departments: {}
                };
            }
            if (!map[bId].departments[dId]) {
                map[bId].departments[dId] = {
                    department: ward.department,
                    wards: []
                };
            }
            map[bId].departments[dId].wards.push(ward);
        });

        return Object.values(map);
    }, [wards]);

    return (
        <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                        <DoorClosed className="w-6 h-6 text-primary"/>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-teal-500">Data Ruangan</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">Kelola ruangan per gedung &amp; departemen</p>
                    </div>
                </div>
                <Button className="flex items-center gap-2 shadow-md" onClick={() => setOpenModal()} size="lg">
                    <Plus className="w-4 h-4"/> Tambah Ruangan
                </Button>
            </div>

            {/* Search */}
            <div className="mb-4">
                <Input
                    placeholder="Cari ruangan..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            {/* Grouped Table */}
            {isLoading ? (
                <div className="flex items-center justify-center h-48 text-muted-foreground">Memuat...</div>
            ) : grouped.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-2">
                    <DoorClosed className="w-10 h-10 opacity-30"/>
                    <p>Tidak ada data ruangan ditemukan</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {grouped.map(({building, departments}) => (
                        <Card key={building.id}>
                            {/* Building Header */}
                            <CardHeader className="pb-0">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                                        <Building2 className="w-5 h-5 text-primary"/>
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">Gedung {building.name}</CardTitle>
                                        <CardDescription className="text-xs line-clamp-1">{building.description}</CardDescription>
                                    </div>
                                    <Badge variant="secondary" className="ml-auto">
                                        {Object.values(departments).reduce((acc, d) => acc + d.wards.length, 0)} ruangan
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-4 space-y-4">
                                {Object.values(departments).map(({department, wards: dWards}) => (
                                    <div key={department.id}>
                                        {/* Department sub-header */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex items-center justify-center w-6 h-6 rounded bg-muted">
                                                <LayoutGrid className="w-3.5 h-3.5 text-muted-foreground"/>
                                            </div>
                                            <span className="text-sm font-semibold text-foreground">
                                                Departemen {department.name}
                                            </span>
                                            <Badge variant="outline" className="text-xs">{dWards.length} ruangan</Badge>
                                        </div>

                                        {/* Ward rows */}
                                        <div className="rounded-md border overflow-hidden">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-muted/40">
                                                        <TableHead className="w-12 text-xs">No</TableHead>
                                                        <TableHead className="text-xs">Nama Ruangan</TableHead>
                                                        <TableHead className="text-xs">Lantai</TableHead>
                                                        <TableHead className="text-xs text-right">Aksi</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {dWards.map((ward, idx) => (
                                                        <TableRow key={ward.id} className="hover:bg-muted/30 transition-colors">
                                                            <TableCell className="text-muted-foreground text-sm">{idx + 1}</TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0">
                                                                        <DoorClosed className="w-4 h-4 text-primary"/>
                                                                    </div>
                                                                    <span className="font-medium">{ward.name}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-muted-foreground text-sm">
                                                                Lantai {ward.floor}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <TooltipProvider>
                                                                    <div className="flex justify-end gap-1">
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Button
                                                                                    variant="ghost" size="sm"
                                                                                    className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                                                                                    onClick={() => setOpenModal(ward.id)}
                                                                                >
                                                                                    <Pencil className="h-3.5 w-3.5"/>
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent><p>Ubah Ruangan</p></TooltipContent>
                                                                        </Tooltip>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Button
                                                                                    variant="ghost" size="sm"
                                                                                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                                                                                    onClick={() => setOpenDeleteModal(ward.id)}
                                                                                >
                                                                                    <Trash2 className="h-3.5 w-3.5"/>
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent><p>Hapus Ruangan</p></TooltipContent>
                                                                        </Tooltip>
                                                                    </div>
                                                                </TooltipProvider>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}


            {/* Pagination */}
            {wards && wards.last_page > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-muted-foreground">
                        Menampilkan <span className="font-medium">{wards.from}</span>–<span className="font-medium">{wards.to}</span> dari <span className="font-medium">{wards.total}</span> ruangan
                    </p>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage <= 1} className="h-8 w-8 p-0">
                            <ChevronLeft className="w-4 h-4"/>
                        </Button>
                        {Array.from({length: wards.last_page}, (_, i) => i + 1).map(page => (
                            <Button key={page} variant={page === currentPage ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)} className="h-8 w-8 p-0">
                                {page}
                            </Button>
                        ))}
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= wards.last_page} className="h-8 w-8 p-0">
                            <ChevronRight className="w-4 h-4"/>
                        </Button>
                    </div>
                </div>
            )}
            {/* Add/Edit Modal */}
            <Modal
                open={openModal}
                onOpenChange={setOpenModal}
                title={wardValue ? "Edit Ruangan" : "Tambah Ruangan"}
                description={wardValue ? "Ubah informasi ruangan" : "Tambahkan ruangan baru ke sistem."}
                onSubmit={handleSubmit(onSubmit)}
                submitText={wardValue ? "Simpan Perubahan" : "Tambah Ruangan"}
                isLoading={isSubmitting}
            >
                <div className="space-y-5 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold">
                            Nama <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Nama ruangan"
                            {...register("name", {required: "Nama ruangan tidak boleh kosong"})}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi</Label>
                        <Textarea id="description" {...register("description")}/>
                        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal
                open={openDeleteModal}
                onOpenChange={setOpenDeleteModal}
                title="Hapus Ruangan"
                description="Tindakan ini tidak dapat dibatalkan. Ruangan akan dihapus permanen."
                onSubmit={() => deleteWard(wardValue.id)}
                submitText="Hapus Ruangan"
                type="danger"
                isLoading={isLoading}
            >
                <div className="space-y-4 py-2">
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                        <div className="flex gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/20 shrink-0">
                                <Trash2 className="w-5 h-5 text-destructive"/>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold">Konfirmasi Penghapusan</p>
                                <p className="text-sm text-muted-foreground">
                                    Anda akan menghapus ruangan:{" "}
                                    <span className="font-semibold text-foreground">{wardValue?.name}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default WardPage;