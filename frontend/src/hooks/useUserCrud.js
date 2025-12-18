import {useState} from "react";
import {toast} from "sonner";
import {useUserStore} from "@/store/user/useUserStore.js";
import {useNavigate} from "@tanstack/react-router";

export const useUserCrud = () => {
    const {createUser, updateUser, deleteUser, fetchUsers, setSearch} = useUserStore();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
    });
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();



    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = (searchValue) => {
        setSearch(searchValue);
        setCurrentPage(1);
    };


    const handleOpenCreateModal = () => {
        setFormData({name: ""});
    };

    const handleCreate = async (formData) => {
        const result = await createUser(formData);
        if (result.success) {
            toast.success("User created successfully");
            await navigate({
                to: "/master/user"
            });
        } else {
            toast.error(result.message || "Failed to create user");
            return false;
        }
    };

    const handleEdit = async (id, data) => {
        console.log();
        const result = await updateUser(id, data);
        if (result.success) {
            toast.success("User updated successfully");
            await fetchUsers(currentPage);
            await navigate({
                to: "/master/user"
            });
            return true;
        } else {
            toast.error(result.message || "Failed to update user");
            return false;
        }
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


    const handleOpenDeleteModal = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    return {
        currentPage,
        setCurrentPage,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        selectedUser,
        formData,
        handleOpenDeleteModal,
        setFormData,
        handleCreate,
        handleEdit,
        handleDelete,
        handlePageChange,
        handleSearch
    };
};