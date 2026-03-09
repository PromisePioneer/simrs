import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Checkbox} from "@/components/ui/checkbox.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";

function MedicineExpiryInfo({register, errors}) {
    return <Card>
        <CardHeader>
            <CardTitle>Informasi Kedaluwarsa</CardTitle>
            <CardDescription>
                Informasi tanggal kedaluwarsa dan notifikasi
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Expired Notification Days */}
                <div className="space-y-2">
                    <Label htmlFor="expired_notification_days">Notifikasi Kedaluwarsa (Hari)</Label>
                    <Input
                        id="expired_notification_days"
                        type="number"
                        {...register("expired_notification_days", {
                            valueAsNumber: true,
                            min: {value: 1, message: "Minimal 1 hari"}
                        })}
                        placeholder="30"
                    />
                    <p className="text-sm text-muted-foreground">
                        Notifikasi akan muncul X hari sebelum tanggal kedaluwarsa
                    </p>
                    {errors.expired_notification_days && (
                        <p className="text-sm text-destructive">{errors.expired_notification_days.message}</p>
                    )}
                </div>
            </div>
        </CardContent>
    </Card>
}


export default MedicineExpiryInfo;