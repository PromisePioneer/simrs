import {Stethoscope, Plus, Trash2} from "lucide-react";
import {Button} from "@shared/components/ui/button.jsx";
import DataTable from "@shared/components/common/data-table.jsx";
import Modal from "@shared/components/common/modal.jsx";
import {DEPARTMENT_COLUMNS} from "@features/settings/pages/constants/index.js";
import {useDepartment} from "@features/settings/pages/hooks/useDepartment.js";
import {DepartmentRows} from "@features/settings/pages/components/department/department-rows.jsx";
import {
    DepartmentDeleteModalContent,
    DepartmentModalFormContent
} from "@features/settings/pages/components/department/modal-content.jsx";

function DepartmentPage() {

    const department = useDepartment();

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5">
                            <Stethoscope className="w-6 h-6 text-primary"/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-teal-500">
                                Data Departemen
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Kelola Departemen
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => department.setOpenModal()}
                    size="lg"
                >
                    <Plus className="w-4 h-4"/> Tambah Departemen
                </Button>
            </div>


            <div>
                {department.canDelete && department.selectedIds.length > 0 && (
                    <div
                        className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 animate-in transition-all">
                            <span className="text-sm font-medium text-destructive">
                                {department.selectedIds.length} Gelar dipilih
                            </span>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="ml-auto gap-2"
                            onClick={() => department.setOpenDeleteModal()}
                        >
                            <Trash2 className="h-4 w-4"/>
                            Hapus yang Dipilih
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => department.setSelectedIds([])}
                        >
                            Batal
                        </Button>
                    </div>
                )}

                <DataTable
                    title="Tabel Departemen"
                    description="Daftar department yang tersedia"
                    columns={DEPARTMENT_COLUMNS}
                    data={department.departments?.data || []}
                    isLoading={department.isLoading}
                    pagination={department.departments ? {
                        from: department.departments.meta?.from,
                        to: department.departments.meta?.to,
                        total: department.departments.meta?.total,
                        current_page: department.departments.meta?.current_page,
                        last_page: department.departments.meta?.last_page
                    } : null}
                    onPageChange={department.setCurrentPage}
                    currentPage={department.currentPage}
                    onSearch={department.setSearch}
                    search={department.search}
                    searchPlaceholder="Cari department..."
                    emptyStateIcon={Stethoscope}
                    emptyStateText="Tidak ada data department ditemukan"
                    renderRow={(item) =>
                        <DepartmentRows item={item} canEdit={department.canEdit}
                                        setOpenModal={department.setOpenModal}/>
                    }
                    showSearch={true}
                    selectable={department.canDelete}
                    selectedIds={department.safeSelectedIds}
                    onToggleOne={department.toggleOne}
                    onToggleAll={department.toggleAll}
                    allSelected={department.allSelected}
                />
            </div>


            <Modal
                open={department.openModal}
                onOpenChange={department.setOpenModal}
                title={department.departmentValue ? "Edit Departemen" : "Tambah Departemen"}
                description={department.departmentValue ? "Ubah informasi department" : "Tambahkan department baru ke sistem."}
                onSubmit={department.handleSubmit(department.onSubmit)}
                submitText={department.departmentValue ? "Simpan Perubahan" : "Tambah Departemen"}
                isLoading={department.formState.isSubmitting}
            >
                <DepartmentModalFormContent register={department.register}
                                            errors={department.formState.errors}
                />
            </Modal>


            <Modal
                open={department.openDeleteModal}
                onOpenChange={department.setOpenDeleteModal}
                title="Hapus department"
                description="Tindakan ini tidak dapat dibatalkan. department akan dihapus permanen."
                onSubmit={() => department.bulkDeleteDepartment(department.selectedIds)}
                submitText="Hapus department"
                type="danger"
                isLoading={department.formState.isSubmitting}
            >
                <DepartmentDeleteModalContent departmentValue={department.departmentValue}
                                              selectedIds={department.selectedIds}
                                              departments={department.departments}
                />
            </Modal>
        </>
    )


}


export default DepartmentPage;