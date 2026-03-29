import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@shared/components/ui/button.jsx";
import { Receipt } from "lucide-react";
import { useBillingStore } from "@features/billing";
import { toast } from "sonner";

/**
 * Tombol "Buat Tagihan" yang bisa dipakai di:
 *   - Halaman detail outpatient visit   → type="outpatient", visitId={visit.id}
 *   - Halaman detail inpatient admission → type="inpatient", admissionId={admission.id}
 *
 * Contoh pemakaian:
 *   <BillButton type="outpatient" visitId={visit.id} />
 *   <BillButton type="inpatient" admissionId={admission.id} />
 */
export function BillButton({ type, visitId, admissionId, className = "" }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const {
        createOutpatientBillFromVisit,
        createInpatientBillFromAdmission,
    } = useBillingStore();

    const handleClick = async () => {
        setLoading(true);
        try {
            let bill;
            if (type === "outpatient") {
                bill = await createOutpatientBillFromVisit(visitId);
            } else {
                bill = await createInpatientBillFromAdmission(admissionId);
            }

            if (bill) {
                navigate({
                    to: type === "outpatient"
                        ? "/billing/outpatient"
                        : "/billing/inpatient",
                });
            }
        } catch {
            toast.error("Gagal membuat tagihan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleClick}
            disabled={loading}
            className={`gap-2 ${className}`}
        >
            <Receipt className="w-4 h-4" />
            {loading ? "Membuat tagihan..." : "Buat Tagihan"}
        </Button>
    );
}
