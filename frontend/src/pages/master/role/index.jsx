import Layout from "@/pages/dashboard/layout.jsx";
import {useEffect, useMemo} from "react";
import {useRoleStore} from "@/store/useRoleStore.js";
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Plus, Pencil, Trash2, Shield, Lock, Users, Settings} from "lucide-react";
import {Badge} from "@/components/ui/badge.jsx";
import {TableRow, TableCell} from "@/components/ui/table.jsx";
import DataTable from "@/components/common/data-table.jsx";
import Modal from "@/components/common/modal.jsx";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {Checkbox} from "@/components/ui/checkbox.jsx";
import {ScrollArea} from "@/components/ui/scroll-area.jsx";
import {useForm} from "react-hook-form";

function RolePage() {
    const {
        fetchRoles,
        fetchPermissions,
        roleData,
        permissionsData,
        isLoading,
        search,
        roleValue,
        setOpenDeleteModal,
        setOpenModal,
        openModal,
        openDeleteModal,
        createRole,
        updateRole,
        columns,
        currentPage,
        setCurrentPage,
        openPermissionModal,
        setOpenPermissionModal,
        assignPermissions,
        selectedPermissions,
        setSelectedPermissions,
        setSearch,
        permissionSearch,
        setPermissionSearch,
        deleteRole,
    } = useRoleStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting}
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {
            name: ""
        }
    });


    useEffect(() => {
        if (roleValue) {
            reset({
                name: roleValue.name || ""
            });
        } else {
            reset();
        }
    }, [roleValue, reset]);

    useEffect(() => {
        if (openPermissionModal && roleValue?.permissions) {
            const currentPermissions = roleValue.permissions.map(p => p.uuid);
            setSelectedPermissions(currentPermissions);
        }
    }, [roleValue, openPermissionModal]);


    useEffect(() => {
        fetchRoles({page: currentPage, perPage: 20});
        fetchPermissions();
    }, [currentPage, search]);


    useEffect(() => {
        if (roleValue && !openDeleteModal) {
            reset({
                name: roleValue.name || "",
            })
        } else {
            reset({
                name: "",
            });
        }
    }, [roleValue, reset]);


    const filteredPermissions = useMemo(() => {
        if (!permissionsData) return [];
        return permissionsData.filter(permission =>
            permission.name.toLowerCase().includes(permissionSearch.toLowerCase())
        );
    }, [permissionsData, permissionSearch]);

    const onSubmit = async (data) => {
        if (!roleValue) {
            await createRole(data);
        } else {
            await updateRole(data);
        }
    };

    const renderRow = (role, index) => {
        const isGlobalRole = role.tenant_id === null;
        const canModify = !isGlobalRole;

        return (
            <TableRow key={role.uuid} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium text-muted-foreground">
                    {roleData.from + index}
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                            <Shield className="w-5 h-5 text-primary"/>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-foreground">
                                {role.name}
                            </span>
                            {isGlobalRole && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <Lock className="w-3 h-3"/>
                                    System Role
                                </span>
                            )}
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <Badge
                        variant={isGlobalRole ? 'destructive' : 'default'}
                        className="font-medium"
                    >
                        {isGlobalRole ? 'Global' : 'Tenant'}
                    </Badge>
                </TableCell>
                <TableCell>
                    <code className="text-xs bg-muted px-2.5 py-1.5 rounded-md font-mono">
                        {role.guard_name}
                    </code>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                    {new Date(role.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                        <TooltipProvider>
                            {
                                canModify &&
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className="flex justify-end gap-1 opacity-100 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                                                onClick={() => setOpenPermissionModal(role.uuid)}
                                            >
                                                {isModalLoading ? (
                                                    <div
                                                        className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                                ) : (
                                                    <Settings className="h-4 w-4"/>
                                                )}
                                            </Button>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Assign Permissions</p>
                                    </TooltipContent>
                                </Tooltip>
                            }

                            {canModify && (
                                <>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary"
                                                onClick={() => setOpenModal(role.uuid)}
                                            >
                                                <Pencil className="h-4 w-4"/>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Edit Role</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() => setOpenDeleteModal(role.uuid)}
                                            >
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Delete Role</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </>
                            )}

                            {!canModify && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center justify-center h-9 px-3">
                                            <Lock className="h-4 w-4 text-muted-foreground"/>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Peran sistem tidak dapat dimodifikasi</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </TooltipProvider>
                    </div>
                </TableCell>
            </TableRow>
        );
    };

    return (
        <Layout>
            <div className="space-y-6 p-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div
                                className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5">
                                <Users className="w-6 h-6 text-primary"/>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-teal-500">
                                    Role Management
                                </h1>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Peran sistem
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button
                        className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                        onClick={() => setOpenModal()}
                        size="lg"
                    >
                        <Plus className="w-4 h-4"/>
                        Tambah Role Baru
                    </Button>
                </div>

                {/* Data Table */}
                <DataTable
                    title="Role Data"
                    description="Kelola dan atur peran pengguna di seluruh sistem"
                    columns={columns()}
                    data={roleData?.data}
                    isLoading={isLoading}
                    pagination={roleData ? {
                        from: roleData.from,
                        to: roleData.to,
                        total: roleData.total,
                        current_page: roleData.current_page,
                        last_page: roleData.last_page
                    } : null}
                    onPageChange={setCurrentPage}
                    currentPage={currentPage}
                    onSearch={setSearch}
                    searchPlaceholder="Search roles..."
                    emptyStateIcon={Shield}
                    emptyStateText="No roles found"
                    renderRow={renderRow}
                    showSearch={true}
                />

                {/* Assign Permissions Modal */}
                <Modal
                    open={openPermissionModal}
                    onOpenChange={setOpenPermissionModal}
                    title="Assign Permissions"
                    description={`Manage permissions for: ${roleValue?.name}`}
                    onSubmit={assignPermissions}
                    submitText="Save Permissions"
                    isLoading={isLoading}
                    size="lg"
                >
                    <div className="space-y-4 py-2">
                        {/* Search Permissions */}
                        <div className="space-y-2">
                            <Label htmlFor="permission-search" className="text-sm font-semibold">
                                Search Permissions
                            </Label>
                            <Input
                                id="permission-search"
                                placeholder="Search for permissions..."
                                value={permissionSearch}
                                onChange={(e) => setPermissionSearch(e.target.value)}
                                className="h-10"
                            />
                        </div>

                        {/* Permissions List */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-semibold">
                                    Available Permissions
                                </Label>
                                <span className="text-xs text-muted-foreground">
                                    {selectedPermissions.length} selected
                                </span>
                            </div>

                            <ScrollArea className="h-[400px] w-full rounded-lg border bg-muted/30 p-4">
                                {filteredPermissions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-32 text-center">
                                        <Shield className="w-8 h-8 text-muted-foreground mb-2"/>
                                        <p className="text-sm text-muted-foreground">
                                            Hak akses tidak ditemukan
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {filteredPermissions.map((permission) => (
                                            <div
                                                key={permission.uuid}
                                                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-background/80 transition-colors border border-transparent hover:border-border"
                                            >
                                                <Checkbox
                                                    id={permission.uuid}
                                                    checked={selectedPermissions.includes(permission.uuid)}
                                                    onCheckedChange={() => setSelectedPermissions(permission.uuid)}
                                                    className="mt-1"
                                                />
                                                <div className="flex-1 space-y-1">
                                                    <Label
                                                        htmlFor={permission.uuid}
                                                        className="text-sm font-medium cursor-pointer leading-none"
                                                    >
                                                        {permission.name}
                                                    </Label>
                                                    {permission.description && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {permission.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>

                        {/* Summary */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground">
                                <span className="font-semibold text-foreground">
                                    {selectedPermissions.length}
                                </span>
                                {" "}permissions will be assigned to this role
                            </p>
                        </div>
                    </div>
                </Modal>

                {/* Create Modal */}
                <Modal
                    open={openModal}
                    onOpenChange={setOpenModal}
                    title="Tambah Role Baru"
                    description="Tambahkan peran baru dengan hak akses khusus ke sistem Anda."
                    onSubmit={handleSubmit(onSubmit)}
                    submitText="Tambah Role"
                    isLoading={isSubmitting}
                >
                    <div className="space-y-2.5">
                        <Label htmlFor="name" className="text-sm font-semibold">
                            Nama<span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="e.g., Content Manager"
                            {...register("name", {
                                required: "Nama tidak boleh kosong",
                            })}
                            className="h-11"
                        />
                        {errors.name && (
                            <p className="text-xs text-destructive">
                                {errors.name.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Pilih nama yang deskriptif untuk peran ini.
                        </p>
                    </div>
                </Modal>
                {/* Delete Modal */}
                <Modal
                    open={openDeleteModal}
                    onOpenChange={setOpenDeleteModal}
                    title="Hapus Peran"
                    description="Tindakan ini tidak dapat dibatalkan. Ini akan menghapus peran tersebut secara permanen."
                    onSubmit={() => deleteRole(roleValue?.uuid)}
                    submitText="Hapus Peran"
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
                                    <p className="text-sm font-semibold text-foreground">
                                        Confirm Deletion
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        You are about to delete the role:{" "}
                                        <span className="font-semibold text-foreground">
                                            {roleValue?.name}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Pengguna yang ditugaskan ke peran ini mungkin kehilangan izin mereka. Pastikan untuk
                            menugaskan ulang mereka sebelum penghapusan.
                        </p>
                    </div>
                </Modal>
            </div>
        </Layout>
    );
}

export default RolePage;