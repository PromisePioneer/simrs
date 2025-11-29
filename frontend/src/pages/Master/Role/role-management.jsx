import Layout from "@/pages/Dashboard/Layout.jsx";
import {useEffect, useState} from "react";
import {useRoleStore} from "@/store/useRoleStore.js";
import {useRoleCrud} from "@/hooks/useRoleCrud.js";
import ContentHeader from "@/components/ui/content-header.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Plus, Pencil, Trash2, Shield} from "lucide-react";
import {Badge} from "@/components/ui/badge.jsx";
import {TableRow, TableCell} from "@/components/ui/table.jsx";
import DataTable from "@/components/common/data-table.jsx";
import Modal from "@/components/common/modal.jsx";

function RoleManagement() {
    const {fetchRoles, roleData, isLoading, search, setSearch} = useRoleStore();
    const {
        isCreateModalOpen,
        setIsCreateModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        selectedRole,
        formData,
        setFormData,
        handleOpenCreateModal,
        handleCreate,
        handleOpenEditModal,
        handleEdit,
        handleOpenDeleteModal,
        handleDelete,
    } = useRoleCrud();

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchRoles(currentPage);
    }, [currentPage, search]);

    const columns = [
        {header: "No", className: "w-[80px]"},
        {header: "Role Name", className: ""},
        {header: "Guard", className: ""},
        {header: "Created At", className: ""},
        {header: "Actions", className: "text-right"},
    ];

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = (searchValue) => {
        setSearch(searchValue);
        setCurrentPage(1);
    };

    const renderRow = (role, index) => (
        <TableRow key={role.uuid} className="hover:bg-muted/50">
            <TableCell className="font-medium">
                {roleData.from + index}
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <Badge variant={
                        role.name.toLowerCase().includes('admin') ? 'destructive' :
                            role.name.toLowerCase().includes('owner') ? 'default' :
                                'secondary'
                    }>
                        {role.name}
                    </Badge>
                </div>
            </TableCell>
            <TableCell>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                    {role.guard_name}
                </code>
            </TableCell>
            <TableCell className="text-muted-foreground">
                {new Date(role.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })}
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleOpenEditModal(role)}
                    >
                        <Pencil className="h-4 w-4"/>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleOpenDeleteModal(role)}
                    >
                        <Trash2 className="h-4 w-4"/>
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <ContentHeader
                        title="Role Management"
                        description="Daftar lengkap semua peran dalam sistem"
                    />
                    <Button className="flex items-center gap-2" onClick={handleOpenCreateModal}>
                        <Plus className="w-4 h-4"/>
                        Add New Role
                    </Button>
                </div>

                <DataTable
                    title="All Roles"
                    description="Daftar lengkap semua peran dalam sistem"
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

                <Modal
                    open={isCreateModalOpen}
                    onOpenChange={setIsCreateModalOpen}
                    title="Create New Role"
                    description="Add a new role to the system"
                    onSubmit={handleCreate}
                    submitText="Create Role"
                    isLoading={isLoading}
                >
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Role Name *</Label>
                            <Input
                                id="name"
                                placeholder="Enter role name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="guard_name">Guard Name</Label>
                            <Input
                                id="guard_name"
                                placeholder="sanctum"
                                value={formData.guard_name}
                                onChange={(e) => setFormData({...formData, guard_name: e.target.value})}
                            />
                        </div>
                    </div>
                </Modal>

                <Modal
                    open={isEditModalOpen}
                    onOpenChange={setIsEditModalOpen}
                    title="Edit Role"
                    description={`Update role: ${selectedRole?.name}`}
                    onSubmit={() => handleEdit(currentPage)}
                    submitText="Update Role"
                    isLoading={isLoading}
                >
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Role Name *</Label>
                            <Input
                                id="edit-name"
                                placeholder="Enter role name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-guard_name">Guard Name</Label>
                            <Input
                                id="edit-guard_name"
                                placeholder="sanctum"
                                value={formData.guard_name}
                                onChange={(e) => setFormData({...formData, guard_name: e.target.value})}
                            />
                        </div>
                    </div>
                </Modal>

                <Modal
                    open={isDeleteModalOpen}
                    onOpenChange={setIsDeleteModalOpen}
                    title="Delete Role"
                    description="Are you sure you want to delete this role? This action cannot be undone."
                    onSubmit={() => handleDelete(currentPage)}
                    submitText="Delete"
                    type="danger"
                    isLoading={isLoading}
                >
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                        <p className="text-sm">
                            You are about to delete the role: <strong>{selectedRole?.name}</strong>
                        </p>
                    </div>
                </Modal>
            </div>
        </Layout>
    );
}

export default RoleManagement;