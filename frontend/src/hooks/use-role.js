import {useCallback, useState} from "react";
import {useRoleStore} from "@/store/useRoleStore.js";
import {toast} from "sonner";

export const useRole = () => {
    const {setSearch, createRole, updateRole, deleteRole, fetchRoles, assignPermissions, showRole} = useRoleStore();

    const [isModalFormOpen, setIsModalFormOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [permissionSearch, setPermissionSearch] = useState("");
    const [isModalLoading, setIsModalLoading] = useState(false);

    const handleOpenModalForm = async (role = null) => {
        if (role) {
            await showRole(role.uuid);
        }
        setIsModalFormOpen(true);
    };

    const handleCreate = async (data) => {
        const result = await createRole(data);
        if (result.success) {
            toast.success("role created successfully");
            setIsModalFormOpen(false);
            await fetchRoles({page: 1, perPage: 20});
            return true;
        } else {
            toast.error(result.message || "Failed to create role");
            return false;
        }
    };

    const handleEdit = async (data) => {
        const result = await updateRole(data);
        if (result.success) {
            toast.success("role updated successfully");
            setIsModalFormOpen(false);
            await fetchRoles({page: 1, perPage: 20});
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


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = (searchValue) => {
        setSearch(searchValue);
        setCurrentPage(1);
    };

    const handlePermissionToggle = useCallback((permissionUuid) => {
        setSelectedPermissions(prev => {
            if (prev.includes(permissionUuid)) {
                return prev.filter(id => id !== permissionUuid);
            } else {
                return [...prev, permissionUuid];
            }
        });
    }, []);

    const handleAssignPermissions = async () => {
        try {
            await assignPermissions(selectedRole, selectedPermissions);
            setIsPermissionModalOpen(false);
            await fetchRoles(currentPage);
        } catch (error) {
            console.error("Failed to assign permissions:", error);
        }
    };

    const handleOpenPermissionModal = async (role) => {
        setIsModalLoading(true);
        setSelectedRole(role);

        try {
            await showRole(role.uuid);
            setIsPermissionModalOpen(true);
        } catch (error) {
            console.error("Failed to fetch role details:", error);
        } finally {
            setIsModalLoading(false);
        }
    };

    const handlePermissionSearch = useCallback((value) => {
        setPermissionSearch(value);
    }, []);

    return {
        isModalLoading,
        permissionSearch,
        selectedPermissions,
        setSelectedPermissions,
        isPermissionModalOpen,
        setIsPermissionModalOpen,
        isModalFormOpen,
        setIsModalFormOpen,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        setSelectedRole,
        selectedRole,
        formData,
        setFormData,
        columns,
        currentPage,

        handlePermissionSearch,
        handleAssignPermissions,
        handleSearch,
        handlePageChange,
        handleOpenModalForm,
        handleCreate,
        handleEdit,
        handleOpenDeleteModal,
        handleDelete,
        handleOpenPermissionModal,
        handlePermissionToggle
    };
};