import {useState} from "react";
import {toast} from "sonner";
import {useUserStore} from "@/store/useUserStore.js";

export const useUserCrud = () => {
    const {createUser, updateUser, deleteUser, fetchUsers} = useUserStore();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedRole] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
    });

    const handleOpenCreateModal = () => {
        setFormData({name: ""});
        setIsCreateModalOpen(true);
    };

    const handleCreate = async () => {
        if (!formData.name.trim()) {
            toast.error("role name is required");
            return;
        }

        const result = await createUser(formData);
        if (result.success) {
            toast.success("role created successfully");
            setIsCreateModalOpen(false);
            fetchUsers(1);
            return true;
        } else {
            toast.error(result.message || "Failed to create role");
            return false;
        }
    };
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

        const result = await updateUser(selectedUser.id, formData);
        if (result.success) {
            toast.success("role updated successfully");
            setIsEditModalOpen(false);
            fetchUsers(currentPage);
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
        const result = await deleteUser(selectedUser.id);
        if (result.success) {
            toast.success("role deleted successfully");
            setIsDeleteModalOpen(false);
            fetchUsers(currentPage);
            return true;
        } else {
            toast.error(result.message || "Failed to delete role");
            return false;
        }
    };

    return {
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
    };
};