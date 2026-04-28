import {useForm, Controller} from "react-hook-form";
import {useEffect} from "react";
import {TableCell, TableRow} from "@shared/components/ui/table.jsx";
import {Stethoscope, Pencil, Plus, Trash2} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@shared/components/ui/tooltip.jsx";
import {Button} from "@shared/components/ui/button.jsx";
import DataTable from "@shared/components/common/data-table.jsx";
import Modal from "@shared/components/common/modal.jsx";
import {Label} from "@shared/components/ui/label.jsx";
import {Input} from "@shared/components/ui/input.jsx";
import {Textarea} from "@shared/components/ui/textarea.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@shared/components/ui/select.jsx";
import {DISEASE_COLUMNS, DISEASE_STATUS_BADGE} from "@features/settings/pages/constants/index.js";
import {useDiseaseStore} from "@features/settings/store/diseaseStore.js";
import {Badge} from "@shared/components/ui/badge.jsx";

const DEFAULT_VALUES = {
    code: "",
    name: "",
    symptoms: "",
    description: "",
    status: "not_contagious",
    valid_code: "1",
    accpdx: "Y",
    asterisk: "0",
    im: "0",
};

function DiseasePage() {
    const {
        isLoading, currentPage, search, diseases, openModal, openDeleteModal,
        diseaseValue, setCurrentPage, setSearch, setOpenModal, setOpenDeleteModal,
        fetchDiseases, createDisease, updateDisease, deleteDisease, setDiseaseValue
    } = useDiseaseStore();

    const {register, handleSubmit, reset, control, formState: {errors, isSubmitting}} = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: DEFAULT_VALUES
    });

    useEffect(() => {
        fetchDiseases({perPage: 20});
    }, [fetchDiseases, search, currentPage]);

    useEffect(() => {
        if (diseaseValue && !openDeleteModal) {
            reset({
                code: diseaseValue.code || "",
                name: diseaseValue.name || "",
                symptoms: diseaseValue.symptoms || "",
                description: diseaseValue.description || "",
                status: diseaseValue.status || "not_contagious",
                valid_code: diseaseValue.valid_code || "1",
                accpdx: diseaseValue.accpdx || "Y",
                asterisk: diseaseValue.asterisk || "0",
                im: diseaseValue.im || "0",
            });
        } else {
            reset(DEFAULT_VALUES);
        }
    }, [diseaseValue, openDeleteModal]);

    useEffect(() => {
        if (!openModal) {
            reset(DEFAULT_VALUES);
            if (setDiseaseValue) setDiseaseValue(null);
        }
    }, [openModal, setDiseaseValue]);

    const onSubmit = async (data) => {
        if (diseaseValue) {
            await updateDisease(diseaseValue.id, data);
        } else {
            await createDisease(data);
        }
    };

    const renderRow = (disease, index) => (
        <TableRow key={disease.id} className="hover:bg-muted/50 transition-colors">
            <TableCell className="font-medium text-muted-foreground">
                {diseases.meta?.from + index}
            </TableCell>
            <TableCell>
                <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{disease.code}</span>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        <Stethoscope className="w-5 h-5 text-primary"/>
                    </div>
                    <span className="font-semibold text-foreground">{disease.name}</span>
                </div>
            </TableCell>
            <TableCell>
                <span className="text-sm text-muted-foreground">{disease.symptoms ?? '-'}</span>
            </TableCell>
            <TableCell>
                <span className="text-sm text-foreground">{disease.description ?? '-'}</span>
            </TableCell>
            <TableCell>
                <Badge className={DISEASE_STATUS_BADGE[disease.status]?.className}
                       variant={DISEASE_STATUS_BADGE[disease.status]?.variant}>
                    {DISEASE_STATUS_BADGE[disease.status]?.label}
                </Badge>
            </TableCell>
            <TableCell>
                <Badge variant={disease.valid_code === "1" ? "default" : "outline"}>
                    {disease.valid_code === "1" ? "Valid" : "Tidak Valid"}
                </Badge>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                    <TooltipProvider>
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm"
                                            className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary"
                                            onClick={() => setOpenModal(disease.id)}>
                                        <Pencil className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Ubah Penyakit</p></TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm"
                                            className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => setOpenDeleteModal(disease.id)}>
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Hapus Penyakit</p></TooltipContent>
                            </Tooltip>
                        </>
                    </TooltipProvider>
                </div>
            </TableCell>
        </TableRow>
    );

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5">
                            <Stethoscope className="w-6 h-6 text-primary"/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-teal-500">Data Penyakit</h1>
                            <p className="text-sm text-muted-foreground mt-1">Kelola Penyakit (ICD-10)</p>
                        </div>
                    </div>
                </div>
                <Button className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                        onClick={() => setOpenModal()} size="lg">
                    <Plus className="w-4 h-4"/> Tambah Penyakit
                </Button>
            </div>

            <DataTable
                title="Tabel Penyakit"
                description="Daftar penyakit yang tersedia"
                columns={DISEASE_COLUMNS}
                data={diseases?.data || []}
                isLoading={isLoading}
                pagination={diseases ? {
                    from: diseases.meta?.from, to: diseases.meta?.to, total: diseases.meta?.total,
                    current_page: diseases.meta?.current_page, last_page: diseases.meta?.last_page
                } : null}
                onPageChange={setCurrentPage}
                currentPage={currentPage}
                onSearch={setSearch}
                search={search}
                searchPlaceholder="Cari kode atau nama penyakit..."
                emptyStateIcon={Stethoscope}
                emptyStateText="Tidak ada data penyakit ditemukan"
                renderRow={renderRow}
                showSearch={true}
            />

            {/* ── Modal Create / Edit ── */}
            <Modal
                open={openModal}
                onOpenChange={setOpenModal}
                title={diseaseValue ? "Edit Penyakit" : "Tambah Penyakit"}
                description={diseaseValue ? "Ubah informasi penyakit" : "Tambahkan penyakit baru ke sistem."}
                onSubmit={handleSubmit(onSubmit)}
                submitText={diseaseValue ? "Simpan Perubahan" : "Tambah Penyakit"}
                isLoading={isSubmitting}
            >
                <div className="space-y-4 py-2">

                    {/* Kode & Nama */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">
                                Kode ICD-10 <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="code"
                                placeholder="Contoh: A00"
                                {...register("code", {required: "Kode tidak boleh kosong"})}
                            />
                            {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Nama Penyakit <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="Contoh: Kolera"
                                {...register("name", {required: "Nama tidak boleh kosong"})}
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                        </div>
                    </div>

                    {/* Gejala */}
                    <div className="space-y-2">
                        <Label htmlFor="symptoms">Gejala</Label>
                        <Textarea
                            id="symptoms"
                            placeholder="Deskripsikan gejala penyakit..."
                            rows={2}
                            {...register("symptoms")}
                        />
                    </div>

                    {/* Deskripsi */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi</Label>
                        <Textarea
                            id="description"
                            placeholder="Deskripsi tambahan..."
                            rows={2}
                            {...register("description")}
                        />
                    </div>

                    {/* Status & Valid Code */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Status Penularan <span className="text-destructive">*</span></Label>
                            <Controller
                                name="status"
                                control={control}
                                render={({field}) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih status"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="infectious">Menular</SelectItem>
                                            <SelectItem value="not_contagious">Tidak Menular</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Valid Kode</Label>
                            <Controller
                                name="valid_code"
                                control={control}
                                render={({field}) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Valid</SelectItem>
                                            <SelectItem value="0">Tidak Valid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>

                    {/* ICD-10 Flags */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Diagnosis Primer</Label>
                            <Controller
                                name="accpdx"
                                control={control}
                                render={({field}) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Y">Ya</SelectItem>
                                            <SelectItem value="N">Tidak</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Asterisk ICD-10</Label>
                            <Controller
                                name="asterisk"
                                control={control}
                                render={({field}) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Tidak</SelectItem>
                                            <SelectItem value="1">Ya</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Kode Manifestasi</Label>
                            <Controller
                                name="im"
                                control={control}
                                render={({field}) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Tidak</SelectItem>
                                            <SelectItem value="1">Ya</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>

                </div>
            </Modal>

            {/* ── Modal Delete ── */}
            <Modal
                open={openDeleteModal}
                onOpenChange={setOpenDeleteModal}
                title="Hapus Penyakit"
                description="Tindakan ini tidak dapat dibatalkan. Penyakit akan dihapus permanen."
                onSubmit={() => deleteDisease(diseaseValue.id)}
                submitText="Hapus Penyakit"
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
                                    Anda akan menghapus penyakit:{" "}
                                    <span className="font-semibold text-foreground">{diseaseValue?.name}</span>
                                    {diseaseValue?.code && (
                                        <span className="font-mono text-xs ml-1">({diseaseValue.code})</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default DiseasePage;