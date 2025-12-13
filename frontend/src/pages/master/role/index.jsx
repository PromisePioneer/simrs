import Layout from "@/pages/dashboard/layout.jsx";
import {useEffect, useMemo} from "react";
import {useRoleStore} from "@/store/useRoleStore.js";
import {useRole} from "@/hooks/use-role.js";
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
    } = useRoleStore();

    const {
        isModalLoading,
        permissionSearch,
        selectedPermissions,
        isModalFormOpen,
        setIsModalFormOpen,
        setSelectedPermissions,
        isPermissionModalOpen,
        setIsPermissionModalOpen,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        selectedRole,
        currentPage,

        handlePermissionSearch,
        handleAssignPermissions,
        handleSearch,
        handlePageChange,
        handleOpenModalForm,
        handleCreate,
        handleEdit,
        handleOpenDeleteModal,
        handleDelete,
        handleOpenPermissionModal,
        handlePermissionToggle
    } = useRole();

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
        if (isPermissionModalOpen && roleValue?.permissions) {
            const currentPermissions = roleValue.permissions.map(p => p.uuid);
            setSelectedPermissions(currentPermissions);
        }
    }, [roleValue, isPermissionModalOpen]);

    useEffect(() => {
        fetchRoles({page: currentPage, perPage: 20});
        fetchPermissions();
    }, [currentPage, search]);


    const filteredPermissions = useMemo(() => {
        if (!permissionsData) return [];
        return permissionsData.filter(permission =>
            permission.name.toLowerCase().includes(permissionSearch.toLowerCase())
        );
    }, [permissionsData, permissionSearch]);

    const columns = [
        {header: "No", className: "w-[80px]"},
        {header: "Nama", className: "min-w-[200px]"},
        {header: "Type", className: "w-[120px]"},
        {header: "Guard", className: "w-[120px]"},
        {header: "Created At", className: "w-[150px]"},
        {header: "Actions", className: "w-[180px] text-right"},
    ];

    const onSubmit = async (data) => {
        if (!roleValue) {
            await handleCreate(data);
        } else {
            await handleEdit(data);
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
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                                            onClick={() => handleOpenPermissionModal(role)}
                                            disabled={isModalLoading}
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

                            {/*{canModify && (*/}
                            <>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary"
                                            onClick={() => handleOpenModalForm(role)}
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
                                            onClick={() => handleOpenDeleteModal(role)}
                                        >
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Delete Role</p>
                                    </TooltipContent>
                                </Tooltip>
                            </>
                            {/*)}*/}

                            {/*{!canModify && (*/}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex items-center justify-center h-9 px-3">
                                        <Lock className="h-4 w-4 text-muted-foreground"/>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>System roles cannot be modified</p>
                                </TooltipContent>
                            </Tooltip>
                            {/*)}*/}
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
                                className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
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
                        onClick={() => handleOpenModalForm()}
                        size="lg"
                    >
                        <Plus className="w-4 h-4"/>
                        Add New Role
                    </Button>
                </div>

                {/* Data Table */}
                <DataTable
                    title="Role Data"
                    description="Kelola dan atur peran pengguna di seluruh sistem"
                    columns={columns}
                    data={roleData?.data}
                    isLoading={isLoading}
                    pagination={roleData ? {
                        from: roleData.from,
                        to: roleData.to,
                        total: roleData.total,
                        current_page: roleData.current_page,
                        last_page: roleData.last_page
                    } : null}
                    onPageChange={handlePageChange}
                    onSearch={handleSearch}
                    searchPlaceholder="Search roles..."
                    emptyStateIcon={Shield}
                    emptyStateText="No roles found"
                    renderRow={renderRow}
                    showSearch={true}
                />

                {/* Assign Permissions Modal */}
                <Modal
                    open={isPermissionModalOpen}
                    onOpenChange={setIsPermissionModalOpen}
                    title="Assign Permissions"
                    description={`Manage permissions for: ${selectedRole?.name}`}
                    onSubmit={handleAssignPermissions}
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
                                onChange={(e) => handlePermissionSearch(e.target.value)}
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
                                            No permissions found
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
                                                    onCheckedChange={() => handlePermissionToggle(permission.uuid)}
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
                    open={isModalFormOpen}
                    onOpenChange={setIsModalFormOpen}
                    title="Create New Role"
                    description="Add a new role with specific permissions to your system"
                    onSubmit={handleSubmit(onSubmit)}
                    submitText="Create Role"
                    isLoading={isLoading}
                >
                    <div className="space-y-2.5">
                        <Label htmlFor="name" className="text-sm font-semibold">
                            Role Name <span className="text-destructive">*</span>
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
                            Choose a descriptive name for this role
                        </p>
                    </div>
                </Modal>
                {/* Delete Modal */}
                <Modal
                    open={isDeleteModalOpen}
                    onOpenChange={setIsDeleteModalOpen}
                    title="Delete Role"
                    description="This action cannot be undone. This will permanently delete the role."
                    onSubmit={() => handleDelete(currentPage)}
                    submitText="Delete Role"
                    type="danger"
                    isLoading={isLoading}
                >
                    <div className="space-y-4 py-2">
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0">
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
                                            {selectedRole?.name}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Users assigned to this role may lose their permissions. Make sure to reassign them before
                            deletion.
                        </p>
                    </div>
                </Modal>
            </div>
        </Layout>
    );
}

export default RolePage;