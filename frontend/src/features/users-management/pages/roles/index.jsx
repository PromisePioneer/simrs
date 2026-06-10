import {ROLE_COLUMNS} from "@features/users-management";
import {Plus, Shield, Trash2} from "lucide-react";
import {Button} from "@shared/components/ui/button.jsx";
import DataTable from "@shared/components/common/data-table.jsx";
import Modal from "@shared/components/common/modal.jsx";
import {Label} from "@shared/components/ui/label.jsx";
import {Input} from "@shared/components/ui/input.jsx";
import {ScrollArea} from "@shared/components/ui/scroll-area.jsx";
import {Checkbox} from "@shared/components/ui/checkbox.jsx";
import ContentHeader from "@shared/components/ui/content-header.jsx";
import {useRole} from "@features/users-management/hooks/useRole.js";
import {RoleRow} from "@features/users-management/components/roles/role-row.jsx";
import {RoleModalFormContent} from "@features/users-management/components/roles/modal-content.jsx";

function RolePage() {
    const role = useRole();

    return (
        <div className="space-y-6 p-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <ContentHeader
                    title="Peran Pengguna"
                    description="Manajemen Peran Pengguna Kelola dan atur anggota tim Anda"
                />
                <Button onClick={() => role.setOpenModal()}
                        className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow">
                    <Plus className="w-4 h-4"/>
                    Tambah
                </Button>
            </div>


            <div>
                {role.canDelete && role.selectedIds.length > 0 && (
                    <div
                        className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 animate-in transition-all">
                            <span className="text-sm font-medium text-destructive">
                                {role.selectedIds.length} Gelar dipilih
                            </span>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="ml-auto gap-2"
                            onClick={() => role.setOpenDeleteModal()}
                        >
                            <Trash2 className="h-4 w-4"/>
                            Hapus yang Dipilih
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => role.setSelectedIds([])}
                        >
                            Batal
                        </Button>
                    </div>
                )}


                {/* Data Table */}
                <DataTable
                    title="Data Peran Pengguna"
                    description="Kelola dan atur peran pengguna di seluruh sistem"
                    columns={ROLE_COLUMNS}
                    data={role.roleData.data}
                    isLoading={role.isLoading}
                    pagination={role.roleData ? {
                        from: role.roleData.meta?.from,
                        to: role.roleData.meta?.to,
                        total: role.roleData.meta?.total,
                        current_page: role.roleData.meta?.current_page,
                        last_page: role.roleData.meta?.last_page
                    } : null}
                    getRowId={(row) => row.uuid}
                    onPageChange={role.setCurrentPage}
                    currentPage={role.currentPage}
                    onSearch={role.setSearch}
                    searchPlaceholder="Cari peran pengguna..."
                    emptyStateIcon={Shield}
                    emptyStateText="Data tidak ditemukan"
                    renderRow={(item, index, checkboxCell) => (
                        <RoleRow
                            item={item}
                            canEdit={role.canEdit}
                            setOpenModal={role.setOpenModal}
                            setOpenPermissionModal={role.setOpenPermissionModal}
                            checkboxCell={checkboxCell}
                        />
                    )}
                    showSearch={true}
                    selectable={role.canDelete}
                    selectedIds={role.safeSelectedIds}
                    isRowSelectable={(item) => item.tenant_id !== null}
                    onToggleOne={(id) => {
                        const item = (role.roleData.data ?? []).find(r => r.uuid === id);
                        if (!item || item.tenant_id === null) return; // ← block global role
                        role.toggleOne(id);
                    }}
                    onToggleAll={() => {
                        const selectableIds = (role.roleData.data ?? [])
                            .filter(r => r.tenant_id !== null)
                            .map(r => r.uuid);
                        role.toggleAll(selectableIds);
                    }}
                    allSelected={
                        (role.roleData.data ?? []).filter(r => r.tenant_id !== null).length > 0 &&
                        (role.roleData.data ?? [])
                            .filter(r => r.tenant_id !== null)
                            .every(r => role.safeSelectedIds.includes(r.uuid))
                    }
                />
            </div>

            {/* Assign Permissions Modal */}
            <Modal
                open={role.openPermissionModal}
                onOpenChange={role.setOpenPermissionModal}
                title="Assign Permissions"
                description={`Manage permissions for: ${role.roleValue?.name || ''}`}
                onSubmit={role.assignPermissions}
                submitText="Save Permissions"
                isLoading={role.isLoading}
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
                            value={role.permissionSearch}
                            onChange={(e) => role.setPermissionSearch(e.target.value)}
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
                                    {role.selectedPermissions.length} selected
                                </span>
                        </div>

                        <ScrollArea className="h-[400px] w-full rounded-lg border bg-muted/30 p-4">
                            {role.filteredPermissions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-32 text-center">
                                    <Shield className="w-8 h-8 text-muted-foreground mb-2"/>
                                    <p className="text-sm text-muted-foreground">
                                        Hak akses tidak ditemukan
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {role.filteredPermissions.map((permission) => (
                                        <div
                                            key={permission.uuid}
                                            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-background/80 transition-colors border border-transparent hover:border-border"
                                        >
                                            <Checkbox
                                                id={permission.uuid}
                                                checked={role.selectedPermissions.includes(permission.uuid)}
                                                onCheckedChange={() => role.setSelectedPermissions(permission.uuid)}
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
                                    {role.selectedPermissions.length}
                                </span>
                            permissions will be assigned to this role
                        </p>
                    </div>
                </div>
            </Modal>

            {/* Create/Edit Modal */}
            <Modal
                open={role.openModal}
                onOpenChange={role.setOpenModal}
                title={role.roleValue ? "Edit Role" : "Tambah Role Baru"}
                description={role.roleValue ? "Edit informasi peran yang ada." : "Tambahkan peran baru dengan hak akses khusus ke sistem Anda."}
                onSubmit={role.handleSubmit(role.onSubmit)}
                submitText={role.roleValue ? "Update Role" : "Tambah Role"}
                isLoading={role.formState.isSubmitting}
            >
                <RoleModalFormContent register={role.register} errors={role.formState.errors}/>
            </Modal>

            {/* Delete Modal */}
            <Modal
                open={role.openDeleteModal}
                onOpenChange={role.setOpenDeleteModal}
                title="Hapus Peran"
                description="Tindakan ini tidak dapat dibatalkan. Ini akan menghapus peran tersebut secara permanen."
                onSubmit={() => role.deleteRole(role.roleValue?.uuid)}
                submitText="Hapus Peran"
                type="danger"
                isLoading={role.isLoading}
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
                                            {role.roleValue?.name}
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
    );
}


export default RolePage;