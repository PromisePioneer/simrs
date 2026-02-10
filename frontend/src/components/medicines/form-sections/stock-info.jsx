import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {AlertCircle} from "lucide-react";
import {cn} from "@/lib/utils.js";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Controller} from "react-hook-form";

function MedicineStockInfo({register, control, baseUnit, errors}) {
    return <Card>
        <CardHeader>
            <CardTitle>Informasi Stok</CardTitle>
            <CardDescription>
                Informasi stok dan harga obat
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="base_unit">
                        Satuan Dasar <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                        name="base_unit"
                        control={control}
                        rules={{required: "Satuan wajib dipilih"}}
                        render={({field}) => (
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Satuan"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tablet">Tablet</SelectItem>
                                    <SelectItem value="vial">Vial</SelectItem>
                                    <SelectItem value="ampul">Ampul</SelectItem>
                                    <SelectItem value="botol">Botol</SelectItem>
                                    <SelectItem value="box">Box</SelectItem>
                                    <SelectItem value="pcs">Pcs</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.base_unit && (
                        <p className="text-sm text-destructive">{errors.base_unit.message}</p>
                    )}
                </div>

                {/* Minimum Stock Amount */}
                <div className="space-y-2">
                    <Label>Stok Minimum {baseUnit && `(${baseUnit})`}</Label>
                    <Input
                        id="minimum_stock_amount"
                        type="number"
                        {...register("minimum_stock_amount", {
                            valueAsNumber: true,
                            min: {value: 0, message: "Stok minimum tidak boleh negatif"}
                        })}
                        placeholder="0"
                        disabled={!baseUnit}
                    />
                    {errors.minimum_stock_amount && (
                        <p className="text-sm text-destructive">{errors.minimum_stock_amount.message}</p>
                    )}
                </div>

                {/* Reference Purchase Price */}
                <div className="space-y-2">
                    <Label htmlFor="reference_purchase_price">Harga Beli Referensi</Label>
                    <Input
                        id="reference_purchase_price"
                        type="number"
                        {...register("reference_purchase_price", {
                            valueAsNumber: true,
                            min: {value: 0, message: "Harga tidak boleh negatif"}
                        })}
                        placeholder="0"
                    />
                    {errors.reference_purchase_price && (
                        <p className="text-sm text-destructive">{errors.reference_purchase_price.message}</p>
                    )}
                </div>
            </div>
        </CardContent>
    </Card>
}

export default MedicineStockInfo;