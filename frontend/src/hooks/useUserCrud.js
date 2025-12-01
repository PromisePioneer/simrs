import {useState} from "react";
import {toast} from "sonner";
import {useUserStore} from "@/store/useUserStore.js";

export const useUserCrud = () => {
    const {createUser, updateUser, deleteUser, fetchUsers, setSearch} = useUserStore();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
    });
    const [currentPage, setCurrentPage] = useState(1);

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

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = (searchValue) => {
        setSearch(searchValue);
        setCurrentPage(1);
    };


    const handleOpenCreateModal = () => {
        setFormData({name: ""});
        setIsCreateModalOpen(true);
    };

    const handleCreate = async () => {
        if (!formData.name.trim()) {
            toast.error("User name is required");
            return;
        }

        const result = await createUser(formData);
        if (result.success) {
            toast.success("User created successfully");
            setIsCreateModalOpen(false);
            fetchUsers(currentPage);
            return true;
        } else {
            toast.error(result.message || "Failed to create user");
            return false;
        }
    };

    const handleOpenEditModal = (user) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
        });
        setIsEditModalOpen(true);
    };

    const handleEdit = async () => {
        if (!formData.name.trim()) {
            toast.error("User name is required");
            return;
        }

        const result = await updateUser(selectedUser.id, formData);
        if (result.success) {
            toast.success("User updated successfully");
            setIsEditModalOpen(false);
            fetchUsers(currentPage);
            return true;
        } else {
            toast.error(result.message || "Failed to update user");
            return false;
        }
    };

    const handleOpenDeleteModal = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        const result = await deleteUser(selectedUser.id);
        if (result.success) {
            toast.success("User deleted successfully");
            setIsDeleteModalOpen(false);
            fetchUsers(currentPage);
            return true;
        } else {
            toast.error(result.message || "Failed to delete user");
            return false;
        }
    };

    return {
        currentPage,
        setCurrentPage,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        selectedUser,
        formData,
        setFormData,
        columns,
        handleOpenCreateModal,
        handleCreate,
        handleOpenEditModal,
        handleEdit,
        handleOpenDeleteModal,
        handleDelete,
        handlePageChange,
        handleSearch
    };
};