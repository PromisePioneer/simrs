import Layout from "@features/dashboard/pages/layout.jsx";
import MedicineBasicInfoSections from "@features/medicine/components/form-sections/basic-info.jsx";
import MedicineStockInfo from "@features/medicine/components/form-sections/stock-info.jsx";
import MedicineUnitPackaging from "@features/medicine/components/form-sections/packaging-card.jsx";
import MedicineAdditionalInfo from "@features/medicine/components/form-sections/additional-info.jsx";
import { useMedicineForm } from "@features/medicine";
import MedicineExpiryInfo from "@features/medicine/components/form-sections/expired-info.jsx";
import MedicineFormActions from "@features/medicine/components/form-sections/form-actions.jsx";
import { Route } from "@/routes/_protected/pharmacy/index.jsx";
import { Button } from "@shared/components/ui/button.jsx";
import { ArrowLeft } from "lucide-react";

function MedicineForm(opts) {
    const navigate = Route.useNavigate();

    const {
        // Form methods
        register,
        handleSubmit,
        control,
        setValue,
        errors,
        isSubmitting,
        watch,

        // Watch values
        baseUnit,
        units,
        isForSell,
        mustHasReceipt,

        // Data
        medicineCategories,

        // State
        isEditMode,
        unitErrors,
        setUnitErrors,

        // Methods
        onSubmit,
        validateUnitMultiplier,
        handleCancel,
    } = useMedicineForm(opts);

    const handleBack = () => {
        navigate({
            to: "/pharmacy",
            search: { tab: "medicine-management" },
        });
    };

    return (
        <Layout>
            <div className="space-y-6">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Data Obat
                </Button>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Information */}
                    <MedicineBasicInfoSections
                        register={register}
                        control={control}
                        errors={errors}
                        medicineCategories={medicineCategories}
                        watch={watch}
                        setValue={setValue}
                    />

                    {/* Stock Information */}
                    <MedicineStockInfo
                        register={register}
                        control={control}
                        errors={errors}
                        baseUnit={baseUnit}
                    />

                    {/* Units/Packaging */}
                    <MedicineUnitPackaging
                        baseUnit={baseUnit}
                        units={units}
                        unitErrors={unitErrors}
                        setUnitErrors={setUnitErrors}
                        setValue={setValue}
                        validateUnitMultiplier={validateUnitMultiplier}
                    />

                    {/* Expiry Information */}
                    <MedicineExpiryInfo
                        register={register}
                        errors={errors}
                    />

                    {/* Additional Options */}
                    <MedicineAdditionalInfo
                        mustHasReceipt={mustHasReceipt}
                        isForSell={isForSell}
                        setValue={setValue}
                    />

                    {/* Form Actions */}
                    <MedicineFormActions
                        isEditMode={isEditMode}
                        isSubmitting={isSubmitting}
                        hasErrors={Object.keys(unitErrors).length > 0}
                        onCancel={handleCancel}
                    />
                </form>
            </div>
        </Layout>
    );
}

export default MedicineForm;
