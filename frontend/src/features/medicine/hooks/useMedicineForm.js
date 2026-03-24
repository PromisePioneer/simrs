import { useEffect } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useMedicineStore } from "@/features/medicine/store/medicineStore.js";
import { useMedicineCategoriesStore } from "@/features/medicine/store/medicineCategoriesStore.js";

const buildFormData = (medicineData = {}) => ({
    sku: medicineData.sku || "",
    code: medicineData.code || "",
    name: medicineData.name || "",
    type: medicineData.type || "",
    category_id: medicineData.category_id || "",
    base_unit: medicineData.base_unit || "",
    minimum_stock_amount: medicineData.stock_amount || 0,
    reference_purchase_price: medicineData.reference_purchase_price || 0,
    expired_notification_days: medicineData.expired_notification_days || 30,
    is_for_sell: medicineData.is_for_sell ?? true,
    must_has_receipt: medicineData.must_has_receipt || false,
    units: medicineData.units || [],
});

export function useMedicineForm(opts) {
    const { id } = useParams(opts);
    const isEditMode = !!id;
    const navigate = useNavigate();

    const { createMedicine, updateMedicine, showMedicine, medicineValue } = useMedicineStore();
    const { medicineCategories, fetchMedicineCategories } = useMedicineCategoriesStore();

    const form = useForm({ defaultValues: buildFormData({}) });
    const { reset, handleSubmit, formState: { isSubmitting } } = form;

    useEffect(() => {
        fetchMedicineCategories();
        if (isEditMode) showMedicine(id);
    }, [id]);

    useEffect(() => {
        if (isEditMode && medicineValue?.id) {
            reset(buildFormData(medicineValue));
        }
    }, [medicineValue]);

    const onSubmit = async (data) => {
        // Format expired dates if present
        if (data.batches) {
            data.batches = data.batches.map((b) => ({
                ...b,
                expired_date: b.expired_date ? format(new Date(b.expired_date), "yyyy-MM-dd") : null,
            }));
        }

        if (isEditMode) {
            await updateMedicine(data, id);
        } else {
            await createMedicine(data);
        }
        navigate({ to: "/pharmacy/medicine" });
    };

    return {
        form,
        isEditMode,
        isSubmitting,
        medicineCategories,
        onSubmit: handleSubmit(onSubmit),
    };
}
