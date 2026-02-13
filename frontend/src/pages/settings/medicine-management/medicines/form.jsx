import SettingPage from "@/pages/settings/index.jsx";
import ContentHeader from "@/components/ui/content-header.jsx";
import {MedicineTabs} from "@/components/settings/medicine-management/tabs.jsx";
import MedicineBasicInfoSections from "@/components/medicines/form-sections/basic-info.jsx";
import MedicineStockInfo from "@/components/medicines/form-sections/stock-info.jsx";
import MedicineUnitPackaging from "@/components/medicines/form-sections/packaging-card.jsx";
import MedicineAdditionalInfo from "@/components/medicines/form-sections/additional-info.jsx";
import {useMedicineForm} from "@/hooks/medicine-form.js";
import MedicineExpiryInfo from "@/components/medicines/form-sections/expired-info.jsx";
import MedicineFormActions from "@/components/medicines/form-sections/form-actions.jsx";

function MedicineForm(opts) {
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
        handleCancel
    } = useMedicineForm(opts);


    return (
        <SettingPage>
            <div className="space-y-6">
                <ContentHeader
                    title={isEditMode ? "Edit Obat" : "Tambah Obat Baru"}
                    description={isEditMode ? "Perbarui informasi obat" : "Tambahkan obat baru ke sistem"}
                />

                <MedicineTabs activeTab="medicine-management"/>

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
        </SettingPage>
    );
}

export default MedicineForm;