import Layout from "@/pages/dashboard/layout.jsx";
import ContentHeader from "@/components/ui/content-header.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Pencil, Plus, Shield, Trash2} from "lucide-react";
import DataTable from "@/components/common/data-table.jsx";
import {TableCell, TableRow} from "@/components/ui/table.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {useUserStore} from "@/store/useUserStore.js";
import {useEffect, useState} from "react";
import {Avatar, AvatarImage} from "@/components/ui/avatar.jsx";
import {AvatarFallback} from "@radix-ui/react-avatar";
import {Link} from "@tanstack/react-router";
import {useRoleCrud} from "@/hooks/useRoleCrud.js";
import {getInitials} from "@/hooks/use-helpers.js";
import Modal from "@/components/common/modal.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";

function Users() {

    const {fetchUsers, isLoading, userData, search, setSearch} = useUserStore()
    const {
        isCreateModalOpen,
        setIsCreateModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        columns,
        selectedRole,
        formData,
        setFormData,
        handleOpenCreateModal,
        handleCreate,
        handleOpenEditModal,
        handleEdit,
        handleOpenDeleteModal,
        handleDelete,
    } = useRoleCrud()


    const [currentPage, setCurrentPage] = useState(1);


    useEffect(() => {
        fetchUsers(currentPage)
    }, [currentPage, fetchUsers, search]);


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = (searchValue) => {
        setSearch(searchValue);
        setCurrentPage(1);
    };

    const renderRow = (user, index) => (
        <TableRow key={user.id} className="hover:bg-muted/50">
            <TableCell className="font-medium">
                {Number(userData.from) + Number(index)}
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2 w-20">
                    <Avatar className="relative inline-flex w-10 h-10 ring-4 ring-white bg-teal-500">
                        {user.profile_picture ? (
                            <AvatarImage className="w-full h-full object-cover rounded-full" src={user.profile_picture}
                                         alt={user.name}/>
                        ) : (
                            <AvatarFallback
                                className="w-full h-full flex items-center justify-center bg-teal-600 text-white text-sm font-semibold rounded-full">{getInitials(user.name)}</AvatarFallback>
                        )}
                    </Avatar>
                    <div className="flex flex-col items-start">
                        <Link className="text-sm font-medium hover:text-blue-500"
                              to={`${user.id}`}>{user.name}</Link>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                            {user.email}
                        </code>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <Badge variant={
                    user.roles[0]?.name.toLowerCase().includes('admin') ? 'destructive' :
                        user.roles[0]?.name.toLowerCase().includes('owner') ? 'default' :
                            'secondary'
                }>
                    {user.roles[0]?.name}
                </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
                test
            </TableCell>
            <TableCell className="text-muted-foreground">
                test
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleOpenEditModal(user)}
                    >
                        <Pencil className="h-4 w-4"/>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleOpenDeleteModal(user)}
                    >
                        <Trash2 className="h-4 w-4"/>
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );


    return (
        <>
            <Layout>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <ContentHeader
                        title="Users Management"
                        description="Daftar Users"
                    />
                    <Button className="flex items-center gap-2" onClick={handleOpenCreateModal}>
                        <Plus className="w-4 h-4"/>
                        Add New Role
                    </Button>
                </div>


                <DataTable
                    title="Semua Users"
                    description="Daftar lengkap semua user dalam sistem"
                    columns={columns()}
                    data={userData?.data}
                    isLoading={isLoading}
                    pagination={userData ? {
                        from: userData.from,
                        to: userData.to,
                        total: userData.total,
                        current_page: userData.current_page,
                        last_page: userData.last_page
                    } : null}
                    onPageChange={handlePageChange}
                    onSearch={handleSearch}
                    searchPlaceholder="Search User..."
                    emptyStateIcon={Shield}
                    emptyStateText="User tidak ditemukan."
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
            </Layout>
        </>
    )

}


export default Users;