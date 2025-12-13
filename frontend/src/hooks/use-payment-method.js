import {useState} from "react";
import {toast} from "sonner";
import {usePaymentMethodStore} from "@/store/usePaymentMethodStore.js";

export const usePaymentMethod = () => {
    const {setSearch, fetchPaymentMethods, fetchPaymentMethodType, createPaymentMethod} = usePaymentMethodStore();
    const [isModalFormOpen, setIsModalFormOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalLoading, setModalLoading] = useState(false)


    const handleOpenModalForm = async () => {
        await fetchPaymentMethodType();
        setIsModalFormOpen(true);
    };

    const handleCreate = async (data) => {
        const result = await createPaymentMethod(data);
        if (result.success) {
            toast.success("role created successfully");
            setIsModalFormOpen(false);
            await fetchPaymentMethods({page: 1, perPage: 20});
            return true;
        } else {
            toast.error(result.message || "Failed to create role");
            return false;
        }
    };


    const handleSearch = (searchValue) => {
        setSearch(searchValue);
        setCurrentPage(1);
    };

    const handleEdit = async (currentPage) => {
        if (!formData.name.trim()) {
            toast.error("role name is required");
            return;
        }

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
            {header: "Tipe", className: ""},
            {header: "Actions", className: "text-right"},
        ];
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return {
        isModalLoading,
        isModalFormOpen,
        setIsModalFormOpen,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        setSelectedRole,
        selectedRole,
        columns,
        currentPage,

        handleSearch,
        handlePageChange,
        handleOpenModalForm,
        handleCreate,
        handleEdit,
        handleOpenDeleteModal,
        handleDelete,
    };
}