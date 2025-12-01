import {useState} from "react";
import {useRoleStore} from "@/store/useRoleStore.js";
import {toast} from "sonner";

export const useRoleCrud = () => {
    const {createRole, updateRole, deleteRole, fetchRoles} = useRoleStore();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
    });

    // Create handlers
    const handleOpenCreateModal = () => {
        setFormData({name: ""});
        setIsCreateModalOpen(true);
    };

    const handleCreate = async () => {
        if (!formData.name.trim()) {
            toast.error("role name is required");
            return;
        }

        const result = await createRole(formData);
        if (result.success) {
            toast.success("role created successfully");
            setIsCreateModalOpen(false);
            await fetchRoles(1);
            return true;
        } else {
            toast.error(result.message || "Failed to create role");
            return false;
        }
    };

    // Edit handlers
    const handleOpenEditModal = (role) => {
        setSelectedRole(role);
        setFormData({
            name: role.name,
        });
        setIsEditModalOpen(true);
    };

    const handleEdit = async (currentPage) => {
        if (!formData.name.trim()) {
            toast.error("role name is required");
            return;
        }

        console.log(selectedRole.uuid);

        const result = await updateRole(selectedRole.uuid, formData);
        if (result.success) {
            toast.success("role updated successfully");
            setIsEditModalOpen(false);
            await fetchRoles(currentPage);
            return true;
        } else {
            toast.error(result.message || "Failed to update role");
            return false;
        }
    };

    // Delete handlers
    const handleOpenDeleteModal = (role) => {
        setSelectedRole(role);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async (currentPage) => {
        const result = await deleteRole(selectedRole.uuid);
        if (result.success) {
            toast.success("role deleted successfully");
            setIsDeleteModalOpen(false);
            await fetchRoles(currentPage);
            return true;
        } else {
            toast.error(result.message || "Failed to delete role");
            return false;
        }
    };


    const columns = () => {
        return [
            {header: "No", className: "w-[80px]"},
            {header: "Nama", className: ""},
            {header: "role", className: ""},
            {header: "Telepon", className: ""},
            {header: "Alamat", className: ""},
            {header: "Actions", className: "text-right"},
        ];

    }

    return {
        isCreateModalOpen,
        setIsCreateModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        setSelectedRole,
        selectedRole,
        formData,
        setFormData,
        columns,

        handleOpenCreateModal,
        handleCreate,
        handleOpenEditModal,
        handleEdit,
        handleOpenDeleteModal,
        handleDelete,
    };
};