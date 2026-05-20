import {useNavigate, useParams} from "@tanstack/react-router";
import {useMedicineRackStore, useMedicineWarehouseStore} from "@features/medicine/index.js";
import {useTenantStore} from "@shared/store/index.js";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";

export const useMedicineWarehouseForm = (opts) => {
    const {id} = useParams(opts);
    const isEditMode = !!id;
    const navigate = useNavigate();

    const {
        showMedicineWarehouse,
        createMedicineWarehouse,
        updateMedicineWarehouse,
        medicineWarehouseValue,
    } = useMedicineWarehouseStore();

    const {
        fetchUnassignedRacks,
        createMedicineRack,
        isLoading,
        unassignedRacks
    } = useMedicineRackStore();

    const {
        fetchTenants,
        tenants,
        userData
    } = useTenantStore();

    const isUserHasTenant = userData?.tenant_id;

    const [isRackDialogOpen, setIsRackDialogOpen] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [newRackData, setNewRackData] = useState({
        code: "",
        name: ""
    });

    const {
        register,
        handleSubmit,
        reset,
        formState,
        control,
        setValue,
        watch
    } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: {
            code: "",
            name: "",
            tenant_id: "",
            racks: [] // Ganti dari rack jadi racks
        }
    });

    useEffect(() => {
        const loadData = async () => {
            setIsLoadingData(true);
            await fetchTenants();
            await fetchUnassignedRacks();

            if (isEditMode && id) {
                await showMedicineWarehouse(id);
            }

            setIsLoadingData(false);
        };

        loadData();
    }, [id, isEditMode]);

// Populate form saat medicineWarehouseValue berubah
    useEffect(() => {
        if (medicineWarehouseValue && isEditMode) {
            const rackIds = medicineWarehouseValue.racks?.map(rack => {
                return rack.id;
            });

            reset({
                code: medicineWarehouseValue.code || "",
                name: medicineWarehouseValue.name || "",
                tenant_id: medicineWarehouseValue.tenant_id?.toString() || "",
                racks: rackIds || [],
            });
        }
    }, [medicineWarehouseValue, isEditMode, reset]);

    const safeUnassignedRacks = unassignedRacks ?? [];

    const availableRacks = isEditMode && medicineWarehouseValue?.racks
        ? [
            ...safeUnassignedRacks,
            ...medicineWarehouseValue.racks.filter(
                assignedRack => !safeUnassignedRacks.some(unassigned => unassigned.id === assignedRack.id)
            )
        ]
        : safeUnassignedRacks;


    const onSubmit = async (data) => {
        let result;

        if (isEditMode) {
            result = await updateMedicineWarehouse(id, data);
        } else {
            result = await createMedicineWarehouse(data);
        }

        if (result.success) {
            await navigate({
                to: '/settings/medicines',
                search: {tab: 'medicine_warehouses'}
            });
        }
    };

    const handleCreateRack = async () => {
        try {
            if (!createMedicineRack) {
                return;
            }
            const createdRack = await createMedicineRack(newRackData);
            if (createdRack?.id) {
                const currentRackIds = watch("racks") || [];
                setValue("racks", [...currentRackIds, createdRack.id]);
            }
            setIsRackDialogOpen(false);
            setNewRackData({code: "", name: ""});
            if (fetchUnassignedRacks) {
                await fetchUnassignedRacks();
            }
        } catch (error) {
            console.error("Failed to create rack:", error);
        }
    };

    const hasRacks = safeUnassignedRacks.length > 0;

    return {
        // Form
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState,

        // Mode
        isEditMode,

        // Data
        medicineWarehouseValue,
        tenants,
        availableRacks,
        hasRacks,
        unassignedRacks,

        // Loading
        isLoading,
        isLoadingData,

        // Rack dialog
        isRackDialogOpen,
        setIsRackDialogOpen,
        newRackData,
        setNewRackData,
        handleCreateRack,

        // Auth
        isUserHasTenant,

        // Submit
        onSubmit,
    }
}