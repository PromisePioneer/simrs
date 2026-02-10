import {useEffect, useState} from "react";
import {useNavigate, useParams} from "@tanstack/react-router";
import {useForm} from "react-hook-form";
import {useMedicineStore} from "@/store/medicineStore.js";
import {useMedicineCategoriesStore} from "@/store/medicineCategoriesStore.js";
import {format} from "date-fns";

export function useMedicineForm(opts) {
    const {id} = useParams(opts);
    const isEditMode = !!id;
    const navigate = useNavigate();

    // Store hooks
    const {createMedicine, updateMedicine, showMedicine, medicineValue} = useMedicineStore();
    const {medicineCategories, fetchMedicineCategories} = useMedicineCategoriesStore();


    const formData = (medicineData) => ({
        sku: medicineData.sku || "",
        code: medicineData.code || "",
        name: medicineData.name || "",
        type: medicineData.type || "",
        category_id: medicineData.category_id || "",
        base_unit: medicineData.base_unit || "",
        minimum_stock_amount: medicineData.stock_amount || 0,
        reference_purchase_price: medicineData.reference_purchase_price || 0,
        expired_notification_days: medicineData.expired_notification_days || 30,
        is_for_sell: medicineData.is_for_sell || true,
        must_has_receipt: medicineData.must_has_receipt || false,
        units: medicineData.units || []
    });

    // Form state
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        reset,
        formState: {errors, isSubmitting}
    } = useForm({
        defaultValues: formData({}),
    });


    useEffect(() => {
        if (isEditMode) {
            showMedicine(id);
        }
    }, [showMedicine, isEditMode]);


    useEffect(() => {
        if (isEditMode) {
            reset(formData(medicineValue));
        }
    }, [medicineValue, isEditMode, reset]);


    const baseUnit = watch("base_unit");
    const units = watch("units");
    const isForSell = watch("is_for_sell");
    const mustHasReceipt = watch("must_has_receipt");

    const [unitErrors, setUnitErrors] = useState({});

    useEffect(() => {
        fetchMedicineCategories();
    }, [fetchMedicineCategories]);

    useEffect(() => {
        if (isEditMode && id) {
            loadMedicineData(id);
        }
    }, [isEditMode, id]);

    useEffect(() => {
        if (baseUnit && (!units || units.length === 0)) {
            setValue("units", [
                {unit_name: baseUnit, multiplier: 1}
            ]);
        }
    }, [baseUnit, units, setValue]);

    const loadMedicineData = async (medicineId) => {
        try {
            const medicine = await showMedicine(medicineId);
            if (medicine) {
                Object.keys(medicine).forEach(key => {
                    if (key === 'expired_date' && medicine[key]) {
                        setValue(key, new Date(medicine[key]));
                    } else if (key === 'is_for_sell' || key === 'must_has_receipt') {
                        setValue(key, Boolean(medicine[key]));
                    } else {
                        setValue(key, medicine[key]);
                    }
                });
            }
        } catch (error) {
            console.error("Error loading medicine:", error);
        }
    };

    const onSubmit = async (data) => {
        if (!validateAllUnits()) {
            console.error("Unit validation failed");
            return;
        }

        try {
            const formData = buildFormData(data);

            let result;
            if (isEditMode) {
                result = await updateMedicine(formData, medicineValue.id);
            } else {
                result = await createMedicine(formData);
            }

            if (result.success) {
                await navigate({
                    to: '/settings/medicine-management',
                    search: {tab: 'medicine-management'}
                });
            }
        } catch (error) {
            console.error("Error saving medicine:", error);
        }
    };

    const buildFormData = (data) => {
        const formData = new FormData();

        const specialFields = [
            'expired_date',
            'is_for_sell',
            'must_has_receipt',
            'units'
        ];

        // Add regular fields
        Object.keys(data).forEach(key => {
            if (!specialFields.includes(key) &&
                data[key] !== null &&
                data[key] !== undefined &&
                data[key] !== "") {
                formData.append(key, data[key]);
            }
        });

        // Add special fields
        if (data.expired_date) {
            formData.append('expired_date', format(data.expired_date, "yyyy-MM-dd"));
        }

        formData.append('is_for_sell', data.is_for_sell ? 1 : 0);
        formData.append('must_has_receipt', data.must_has_receipt ? 1 : 0);

        // Add units
        if (data.units && data.units.length > 0) {
            const validUnits = data.units.filter(unit =>
                unit.unit_name &&
                unit.multiplier > 0 &&
                (data.units.indexOf(unit) === 0 || unit.multiplier > 1)
            );
            formData.append('units', JSON.stringify(validUnits));
        }

        return formData;
    };

    const validateAllUnits = () => {
        if (!units || units.length === 0) return true;

        let hasError = false;
        const errors = {};

        units.forEach((unit, index) => {
            if (index > 0) {
                if (!unit.unit_name) {
                    errors[index] = "Nama satuan harus diisi";
                    hasError = true;
                } else if (unit.multiplier <= 1) {
                    errors[index] = `Isi harus lebih dari 1 ${baseUnit}`;
                    hasError = true;
                }
            }
        });

        setUnitErrors(errors);
        return !hasError;
    };

    const validateUnitMultiplier = (index, value) => {
        if (index === 0) return;

        const newErrors = {...unitErrors};

        if (value <= 1) {
            newErrors[index] = `Isi harus lebih dari 1 ${baseUnit}`;
        } else {
            delete newErrors[index];
        }

        setUnitErrors(newErrors);
    };

    const handleCancel = () => {
        navigate({to: "/settings/medicine-management"});
    };

    return {
        register,
        handleSubmit,
        control,
        setValue,
        errors,
        isSubmitting,

        baseUnit,
        units,
        isForSell,
        mustHasReceipt,

        medicineCategories,

        isEditMode,
        unitErrors,
        setUnitErrors,

        onSubmit,
        validateUnitMultiplier,
        validateAllUnits,
        handleCancel
    };
}