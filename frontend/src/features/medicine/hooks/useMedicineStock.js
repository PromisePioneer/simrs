import {format} from "date-fns";
import {useNavigate, useParams} from "@tanstack/react-router";
import {
    useMedicineBatchesStore,
    useMedicineRackStore,
    useMedicineStore,
    useMedicineWarehouseStore
} from "@features/medicine/index.js";
import {useEffect} from "react";
import {usePermission} from "@shared/hooks/index.js";
import {useForm} from "react-hook-form";
import {PERMISSIONS} from "@shared/constants/index.js";


export const useMedicineStock = (opts) => {
    const {id} = useParams(opts);
    const navigate = useNavigate();

    const medicineBatchesStore = useMedicineBatchesStore();

    const allIds = medicineBatchesStore.medicineBatches?.data?.map((a) => a.id) ?? [];
    const allSelected = allIds.length > 0 && allIds.every((id) => medicineBatchesStore.selectedIds.includes(id));
    const {hasPermission} = usePermission();

    const {medicineValue} = useMedicineStore();

    const {medicineWarehouseValue, fetchMedicineWarehouseOptions} = useMedicineWarehouseStore();
    const {
        racksByMedicineWarehouse,
        fetchByMedicineWarehouse,
        fetchByMedicineWarehouseOptions
    } = useMedicineRackStore();

    useEffect(() => {
        medicineBatchesStore.fetchMedicineBatches({perPage: 20, medicineId: id});
    }, []);

    const {
        handleSubmit,
        formState,
        register,
        control,
        watch,
        reset,
        setValue,
    } = useForm({
        defaultValues: {
            medicine_id: id,
            warehouse_id: "",
            rack_id: "",
            batch_number: "",
            is_auto_batch: false,
            expired_date: undefined,
            stock_amount: "",
            selling_price: "",
        }
    });

    const warehouseId = watch("warehouse_id");
    const isAutoBatch = watch("is_auto_batch");

    const todayDate = new Date();
    const currentYear = todayDate.getFullYear();

    // Clear batch_number ketika auto batch diaktifkan
    useEffect(() => {
        if (isAutoBatch) {
            setValue("batch_number", "");
        }
    }, [isAutoBatch, setValue]);

    useEffect(() => {
        if (warehouseId) {
            fetchByMedicineWarehouse(warehouseId);
            // Hanya reset rack_id, bukan seluruh form
            setValue("rack_id", "");
        } else {
            // Kalau warehouse di-clear, kosongkan juga rack
            setValue("rack_id", "");
        }
    }, [warehouseId]);

    // Populate form saat edit (medicineBatchValue berubah)
    useEffect(() => {
        if (!medicineBatchesStore.medicineBatchValue) {
            reset({
                medicine_id: id,
                warehouse_id: "",
                rack_id: "",
                batch_number: "",
                is_auto_batch: false,
                expired_date: undefined,
                stock_amount: "",
                selling_price: "",
            });
            return;
        }

        let expiredDate = undefined;
        if (medicineBatchesStore.medicineBatchValue?.expired_date) {
            const parsed = new Date(medicineBatchesStore.medicineBatchValue.expired_date);
            expiredDate = isNaN(parsed.getTime()) ? undefined : parsed;
        }

        const warehouseIdEdit = medicineBatchesStore.medicineBatchValue?.stock?.warehouse_id || "";

        // Fetch racks untuk warehouse yang ada di data edit
        if (warehouseIdEdit) {
            fetchByMedicineWarehouse(warehouseIdEdit);
        }

        reset({
            medicine_id: id,
            warehouse_id: warehouseIdEdit,
            rack_id: medicineBatchesStore.medicineBatchValue?.stock?.rack_id || "",
            batch_number: medicineBatchesStore.medicineBatchValue?.batch_number || "",
            is_auto_batch: medicineBatchesStore.medicineBatchValue.is_auto_batch || false,
            expired_date: expiredDate,
            stock_amount: medicineBatchesStore.medicineBatchValue?.stock?.stock_amount || "",
            selling_price: medicineBatchesStore.medicineBatchValue?.selling_price || "",
        });
    }, [medicineBatchesStore.medicineBatchValue]);

    const handleBack = () => {
        navigate({
            to: '/pharmacy',
            search: {tab: 'medicine-management'}
        });
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        const specialFields = ['expired_date'];

        Object.keys(data).forEach(key => {
            if (key === 'batch_number' && data.is_auto_batch) return;
            if (!specialFields.includes(key) && data[key]) {
                formData.append(key, data[key]);
            }
        });

        if (data.expired_date) {
            formData.append('expired_date', format(data.expired_date, "yyyy-MM-dd"));
        }
        formData.append('is_auto_batch', Boolean(data.is_auto_batch));

        if (medicineBatchesStore.medicineBatchValue) {
            await medicineBatchesStore.updateMedicineBatch(medicineBatchesStore.medicineBatchValue.id, formData);
        } else {
            await medicineBatchesStore.createMedicineBatch(formData);
        }
    };

    return {
        ...medicineBatchesStore,
        handleBack,
        allSelected,
        safeSelectedIds: Array.isArray(medicineBatchesStore.selectedIds) ? medicineBatchesStore.selectedIds : [],
        canCreate: hasPermission(PERMISSIONS.MEDICINE_BATCH.CREATE),
        canEdit: hasPermission(PERMISSIONS.MEDICINE_BATCH.EDIT),
        canDelete: hasPermission(PERMISSIONS.MEDICINE_BATCH.DELETE),
        toggleAll: () => medicineBatchesStore.setSelectedIds(allSelected ? [] : allIds),
        toggleOne: (id) => medicineBatchesStore.setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        ),
        // Form
        handleSubmit,
        onSubmit,
        formState,
        register,
        control,
        watch,
        reset,
        setValue,
        isAutoBatch,
        warehouseId,
        currentYear,
        // Medicine Store
        medicineValue,
        racksByMedicineWarehouse,
        // Warehouse
        fetchByMedicineWarehouse,
        fetchMedicineWarehouseOptions,
        fetchByMedicineWarehouseOptions
    };
};