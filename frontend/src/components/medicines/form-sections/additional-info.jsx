import {Button} from "@/components/ui/button.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Checkbox} from "@/components/ui/checkbox.jsx";
import {Label} from "@/components/ui/label.jsx";

function MedicineAdditionalInfo({mustHasReceipt, isForSell, setValue}) {
    return <Card>
        <CardHeader>
            <CardTitle>Opsi Tambahan</CardTitle>
            <CardDescription>
                Pengaturan tambahan untuk obat
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {/* Must Has Receipt */}
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="must_has_receipt"
                    checked={mustHasReceipt}
                    onCheckedChange={(checked) => setValue("must_has_receipt", checked)}
                />
                <Label htmlFor="must_has_receipt" className="font-normal cursor-pointer">
                    Harus dengan Resep Dokter
                </Label>
            </div>

            {/* Is For Sell */}
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="is_for_sell"
                    checked={isForSell}
                    onCheckedChange={(checked) => setValue("is_for_sell", checked)}
                />
                <Label htmlFor="is_for_sell" className="font-normal cursor-pointer">
                    Dijual / Untuk Penjualan
                </Label>
            </div>
        </CardContent>
    </Card>
}


export default MedicineAdditionalInfo;