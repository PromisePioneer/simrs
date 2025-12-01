import Layout from "@/pages/dashboard/layout.jsx";
import ContentHeader from "@/components/ui/content-header.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Pencil, Plus, Shield, Trash2, Mail, Phone, MapPin, UserCircle, Verified, MailCheck} from "lucide-react";
import DataTable from "@/components/common/data-table.jsx";
import {TableCell, TableRow} from "@/components/ui/table.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {useUserStore} from "@/store/useUserStore.js";
import {useEffect} from "react";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar.jsx";
import {Link} from "@tanstack/react-router";
import {getInitials} from "@/hooks/use-helpers.js";
import Modal from "@/components/common/modal.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {useUserCrud} from "@/hooks/useUserCrud.js";

function UserPage() {
    const {fetchUsers, isLoading, userData, search} = useUserStore();
    const {
        currentPage,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        selectedUser,
        formData,
        setFormData,
        handleOpenCreateModal,
        handleCreate,
        handleOpenEditModal,
        handleEdit,
        handleOpenDeleteModal,
        handleDelete,
        handleSearch,
        handlePageChange,
    } = useUserCrud();


    useEffect(() => {
        fetchUsers({page: currentPage, search});
    }, [currentPage, search]);
    const getRoleBadgeVariant = (roleName) => {
        const role = roleName?.toLowerCase();
        if (role?.includes('super admin')) return 'destructive';
        if (role?.includes('owner')) return 'de+fault';
        return 'outline';
    };

    const columns = () => [
        {header: "No", className: "w-[60px]"},
        {header: "User", className: "min-w-[280px]"},
        {header: "Role", className: "w-[140px]"},
        {header: "Telepon", className: "min-w-[200px]"},
        {header: "Alamat", className: "min-w-[200px]"},
        {header: "Actions", className: "text-right w-[120px]"},
    ];

    const renderRow = (user, index) => (
        <TableRow key={user.id} className="group hover:bg-muted/50 transition-colors">
            <TableCell className="font-medium text-muted-foreground">
                {Number(userData.from) + Number(index)}
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 ring-2 ring-background shadow-md">
                        {user.profile_picture ? (
                            <AvatarImage
                                src={user.profile_picture}
                                alt={user.name}
                                className="object-cover"
                            />
                        ) : (
                            <AvatarFallback className="bg-teal-600 text-white font-semibold">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <Link
                            to={`${user.id}`}
                            className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1.5"
                        >
                            {user.name}
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            {user.email_verified_at ? <MailCheck className="w-4 h-4 text-teal-600"/> :
                                <MailWarning className="w-4 h-4 text-amber-400"/>}
                            <span className="font-mono">{user.email}</span>
                        </div>
                    </div>
                </div>
            </TableCell>

            <TableCell>
                <Badge
                    variant={getRoleBadgeVariant(user.roles[0]?.name)}
                    className="font-medium"
                >
                    {user.roles[0]?.name || 'No Role'}
                </Badge>
            </TableCell>

            <TableCell>
                {user.phone ? (
                    <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground"/>
                        <span className="font-medium">{user.phone}</span>
                    </div>
                ) : (
                    <Badge variant="outline" className="text-xs gap-1">
                        <Phone className="h-3 w-3"/>
                        Not set
                    </Badge>
                )}
            </TableCell>

            <TableCell>
                {user.address ? (
                    <div className="flex items-start gap-2 text-sm max-w-[250px]">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0"/>
                        <span className="line-clamp-2 text-muted-foreground">{user.address}</span>
                    </div>
                ) : (
                    <Badge variant="outline" className="text-xs gap-1">
                        <MapPin className="h-3 w-3"/>
                        Not set
                    </Badge>
                )}
            </TableCell>

            <TableCell className="text-right">
                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                        onClick={() => handleOpenEditModal(user)}
                    >
                        <Pencil className="h-4 w-4"/>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleOpenDeleteModal(user)}
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
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <ContentHeader
                        title="User Management"
                        description="Manajemen Pengguna Kelola dan atur anggota tim Anda"
                    />
                    <Button
                        className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                        onClick={handleOpenCreateModal}
                    >
                        <Plus className="w-4 h-4"/>
                        Add New User
                    </Button>
                </div>
                {/* Data Table */}
                <DataTable
                    title="User"
                    description="Daftar lengkap semua pengguna"
                    columns={columns()}
                    data={userData?.data}
                    isLoading={isLoading}
                    currentPage={currentPage}
                    pagination={userData ? {
                        from: userData.from,
                        to: userData.to,
                        total: userData.total,
                        current_page: userData.current_page,
                        last_page: userData.last_page
                    } : null}
                    onPageChange={handlePageChange}
                    onSearch={handleSearch}
                    searchPlaceholder="Search users by name or email..."
                    emptyStateIcon={Shield}
                    emptyStateText="No users found"
                    renderRow={renderRow}
                    showSearch={true}
                />

                {/* Create Modal */}
                <Modal
                    open={isCreateModalOpen}
                    onOpenChange={setIsCreateModalOpen}
                    title="Create New User"
                    description="Add a new user to your team"
                    onSubmit={handleCreate}
                    submitText="Create User"
                    isLoading={isLoading}
                >
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center gap-2">
                                <UserCircle className="h-4 w-4"/>
                                User Name *
                            </Label>
                            <Input
                                id="name"
                                placeholder="Enter user name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                                className="focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                </Modal>

                {/* Edit Modal */}
                <Modal
                    open={isEditModalOpen}
                    onOpenChange={setIsEditModalOpen}
                    title="Edit User"
                    description={`Update information for ${selectedUser?.name}`}
                    onSubmit={() => handleEdit()}
                    submitText="Update User"
                    isLoading={isLoading}
                >
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name" className="flex items-center gap-2">
                                <UserCircle className="h-4 w-4"/>
                                User Name *
                            </Label>
                            <Input
                                id="edit-name"
                                placeholder="Enter user name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                                className="focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                </Modal>

                {/* Delete Modal */}
                <Modal
                    open={isDeleteModalOpen}
                    onOpenChange={setIsDeleteModalOpen}
                    title="Delete User"
                    description="This action cannot be undone. This will permanently delete the user account."
                    onSubmit={() => handleDelete()}
                    submitText="Delete"
                    type="danger"
                    isLoading={isLoading}
                >
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-destructive/20 rounded-full">
                                <Trash2 className="h-5 w-5 text-destructive"/>
                            </div>
                            <div>
                                <p className="text-sm font-medium mb-1">
                                    You are about to delete:
                                </p>
                                <p className="text-sm font-semibold text-destructive">
                                    {selectedUser?.name}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {selectedUser?.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </Layout>
    );
}

export default UserPage;