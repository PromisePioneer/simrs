import {Link} from "@tanstack/react-router";
import {Button} from "@/components/ui/button.jsx";
import {Save} from "lucide-react";

function MedicineFormActions({isSubmitting}) {
    return (
        <>
            <div className="flex justify-end gap-4">
                <Link to="/settings/medicine-management">
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                </Link>
                <Button type="submit" className="gap-2" disabled={isSubmitting}>
                    <Save className="w-4 h-4"/>
                    {isSubmitting ? "Menyimpan..." : "Simpan"}
                </Button>
            </div>
        </>
    )
}


export default MedicineFormActions;