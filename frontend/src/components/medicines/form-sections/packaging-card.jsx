import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {AlertCircle, Plus} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {cn} from "@/lib/utils.js";
import {getAvailableUnitsForRow} from "@/constants/medicines.js";
import {Trash} from "lucide-react";


function MedicineUnitPackaging({baseUnit, units, unitErrors, setUnitErrors, setValue, validateUnitMultiplier}) {
    return <Card>
        <CardHeader>
            <CardTitle>Satuan / Kemasan</CardTitle>
            <CardDescription>
                Atur satuan jual berdasarkan satuan dasar {baseUnit && `(${baseUnit})`}
            </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
            {!baseUnit && (
                <div
                    className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                    ⚠️ Pilih satuan dasar terlebih dahulu untuk menambahkan satuan kemasan
                </div>
            )}

            {baseUnit && (
                <div
                    className="text-sm text-blue-600 bg-blue-50 p-3 rounded-md border border-blue-200 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0"/>
                    <div>
                        <p className="font-medium">Aturan Pengisian Satuan:</p>
                        <ul className="mt-1 space-y-1 text-xs">
                            <li>• Satuan dasar = 1 {baseUnit} (tidak bisa diubah)</li>
                            <li>• Satuan turunan harus <strong>lebih dari 1 {baseUnit}</strong></li>
                            <li>• Contoh: 1 Box = 10 {baseUnit}, 1 Botol = 100 {baseUnit}</li>
                        </ul>
                    </div>
                </div>
            )}

            {baseUnit && units?.map((unit, index) => {
                const availableUnits = getAvailableUnitsForRow(units, index);
                const hasError = unitErrors[index];

                return (
                    <div
                        key={index}
                        className={cn(
                            "grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 rounded-lg",
                            hasError ? "bg-red-50 border-2 border-red-200" : "bg-gray-50"
                        )}
                    >
                        {/* Unit Name */}
                        <div className="md:col-span-5 space-y-2">
                            <Label className="mb-4">
                                Nama Satuan
                                {index === 0 &&
                                    <span className="text-xs text-gray-500 ml-1">(Dasar)</span>}
                            </Label>
                            {index === 0 ? (
                                <Input
                                    placeholder="Satuan dasar"
                                    value={baseUnit}
                                    disabled
                                    className="bg-gray-100"
                                />
                            ) : (
                                <Select
                                    value={unit.unit_name || ""}
                                    onValueChange={(value) => {
                                        const updatedUnits = [...units];
                                        updatedUnits[index].unit_name = value;
                                        setValue("units", updatedUnits);

                                        if (updatedUnits[index].multiplier > 1) {
                                            const newErrors = {...unitErrors};
                                            delete newErrors[index];
                                            setUnitErrors(newErrors);
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih satuan"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableUnits.length > 0 ? (
                                            availableUnits.map(({value, label}) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="px-2 py-1.5 text-sm text-gray-500">
                                                Semua satuan sudah digunakan
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>

                        {/* Multiplier */}
                        <div className="md:col-span-5 space-y-2">
                            <Label className="mb-4">
                                Isi ({baseUnit})
                                {index > 0 &&
                                    <span className="text-xs text-gray-500 ml-1">(min: 2)</span>}
                            </Label>
                            <Input
                                type="number"
                                disabled={index === 0}
                                value={unit.multiplier || 1}
                                min={index === 0 ? 1 : 2}
                                className={cn(
                                    index === 0 ? "bg-gray-100" : "",
                                    hasError ? "border-red-500" : ""
                                )}
                                onChange={(e) => {
                                    const value = Number(e.target.value) || 1;
                                    const updatedUnits = [...units];
                                    updatedUnits[index].multiplier = value;
                                    setValue("units", updatedUnits);

                                    // Validate
                                    validateUnitMultiplier(index, value);
                                }}
                                onBlur={(e) => {
                                    const value = Number(e.target.value) || 1;
                                    validateUnitMultiplier(index, value);
                                }}
                            />
                            {hasError && (
                                <p className="text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3"/>
                                    {hasError}
                                </p>
                            )}

                        </div>


                        {/* Actions */}
                        <div className="md:col-span-2 flex gap-2 items-start">
                            {index > 0 && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => {
                                        const updatedUnits = units.filter((_, i) => i !== index);
                                        setValue("units", updatedUnits);

                                        // Remove error untuk index ini
                                        const newErrors = {...unitErrors};
                                        delete newErrors[index];
                                        const reindexedErrors = {};
                                        Object.keys(newErrors).forEach(key => {
                                            const keyNum = Number(key);
                                            if (keyNum > index) {
                                                reindexedErrors[keyNum - 1] = newErrors[key];
                                            } else {
                                                reindexedErrors[key] = newErrors[key];
                                            }
                                        });
                                        setUnitErrors(reindexedErrors);
                                    }}
                                >
                                    <Trash size={16}/>
                                </Button>
                            )}
                        </div>
                    </div>
                );
            })}


            {baseUnit && (
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={getAvailableUnitsForRow(units).length === 0}
                    onClick={() => {
                        setValue("units", [
                            ...units,
                            {unit_name: "", multiplier: 2}
                        ]);
                    }}
                >
                    <Plus className="mr-2" size={16}/>
                    {getAvailableUnitsForRow(units).length > 0
                        ? "Tambahkan Satuan"
                        : "Semua satuan sudah digunakan"
                    }
                </Button>
            )}
        </CardContent>
    </Card>
}


export default MedicineUnitPackaging;