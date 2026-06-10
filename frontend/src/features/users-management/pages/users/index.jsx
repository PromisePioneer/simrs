import ContentHeader from "@shared/components/ui/content-header.jsx";
import {Button} from "@shared/components/ui/button.jsx";
import {Plus, Shield, Trash2} from "lucide-react";
import DataTable from "@shared/components/common/data-table.jsx";
import {USER_COLUMNS} from "@features/users-management";
import {Link} from "@tanstack/react-router";
import Modal from "@shared/components/common/modal.jsx";
import {useUserIndex} from "@features/users-management/hooks/user/useUserIndex.js";
import {UserRow} from "@features/users-management/components/users/user-row.jsx";
import {UserDeleteModalContent} from "@features/users-management/components/users/modal-content.jsx";

function UserPage() {
    const user = useUserIndex();
    return (
        <div className="space-y-6 p-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <ContentHeader
                    title="Manajemen Pengguna"
                    description="Manajemen Pengguna Kelola dan atur anggota tim Anda"
                />
                <Link to="/settings/users-management/users/create">
                    <Button className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow">
                        <Plus className="w-4 h-4"/>
                        Tambah
                    </Button>
                </Link>
            </div>


            <div>
                {user.canDelete && user.selectedIds.length > 0 && (
                    <div
                        className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 animate-in transition-all">
                            <span className="text-sm font-medium text-destructive">
                                {user.selectedIds.length} Gelar dipilih
                            </span>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="ml-auto gap-2"
                            onClick={() => user.setOpenDeleteModal()}
                        >
                            <Trash2 className="h-4 w-4"/>
                            Hapus yang Dipilih
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => user.setSelectedIds([])}
                        >
                            Batal
                        </Button>
                    </div>
                )}
                <DataTable
                    title="User"
                    description="Daftar lengkap semua pengguna"
                    columns={USER_COLUMNS}
                    data={user.userData.data}
                    isLoading={user.isLoading}
                    pagination={user.userData ? {
                        from: user.userData.meta?.from,
                        to: user.userData.meta?.to,
                        total: user.userData.meta?.total,
                        current_page: user.userData.meta?.current_page,
                        last_page: user.userData.meta?.last_page
                    } : null}
                    onPageChange={user.setCurrentPage}
                    currentPage={user.currentPage}
                    onSearch={user.setSearch}
                    searchPlaceholder="Search users by name or email..."
                    emptyStateIcon={Shield}
                    emptyStateText="No users found"
                    renderRow={(item, index, checkboxCell) =>
                        <UserRow item={item}
                                 canEdit={user.canEdit}
                                 getRoleBadgeVariant={user.getRoleBadgeVariant}
                                 checkboxCell={checkboxCell}
                        />
                    }
                    showSearch={true}
                    selectable={user.canDelete}
                    selectedIds={user.safeSelectedIds}
                    onToggleOne={user.toggleOne}
                    onToggleAll={user.toggleAll}
                    allSelected={user.allSelected}
                />
            </div>

            {/* Delete Modal */}
            <Modal
                open={user.openDeleteModal}
                onOpenChange={user.setOpenDeleteModal}
                title="Hapus User"
                description="Tindakan ini tidak dapat dibatalkan. User akan dihapus permanen."
                onSubmit={() => user.bulkDeleteUser(user.selectedIds)}
                submitText="Hapus User"
                type="danger"
                isLoading={user.isLoading}
            >
                <UserDeleteModalContent userValue={user.userValue}
                                        selectedIds={user.selectedIds}
                                        userData={user.userData}
                />
            </Modal>
        </div>
    );
}

export default UserPage;