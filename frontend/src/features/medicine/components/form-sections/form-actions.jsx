import {Button} from "@shared/components/ui/button.jsx";
import {Save} from "lucide-react";

function MedicineFormActions({isSubmitting, onCancel}) {
    return (
        <>
            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" className="gap-2" disabled={isSubmitting}>
                    <Save className="w-4 h-4"/>
                    {isSubmitting ? "Menyimpan..." : "Simpan"}
                </Button>
            </div>
        </>
    )
}


export default MedicineFormActions;