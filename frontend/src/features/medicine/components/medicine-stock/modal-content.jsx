import {Label} from "@shared/components/ui/label.jsx";
import {Controller} from "react-hook-form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@shared/components/ui/select.jsx";
import {Popover, PopoverContent, PopoverTrigger} from "@shared/components/ui/popover.jsx";
import {Button} from "@shared/components/ui/button.jsx";
import {CalendarIcon, Trash2, Warehouse, X} from "lucide-react";
import {format} from "date-fns";
import {Checkbox} from "@shared/components/ui/checkbox.jsx";
import {Input} from "@shared/components/ui/input.jsx";
import {cn} from "@shared/lib/utils.js";
import {Calendar} from "@shared/components/ui/calendar.jsx";
import {AsyncSelect} from "@shared/components/common/async-select.jsx";

export const MedicineStockModalFormContent = ({
                                                  register,
                                                  control,
                                                  fetchMedicineWarehouseOptions,
                                                  errors,
                                                  isAutoBatch,
                                                  medicineValue,
                                                  warehouseId,
                                                  racksByMedicineWarehouse,
                                                  currentYear,
                                                  defaultWarehouseLabel
                                              }) => {
    return (
        <div className="space-y-5 py-2">
            {/* Gudang */}
            <div className="space-y-2">
                <Label htmlFor="warehouse_id">
                    Gudang <span className="text-destructive">*</span>
                </Label>
                <Controller
                    name="warehouse_id"
                    control={control}
                    rules={{required: "Gudang tidak boleh kosong"}}
                    render={({field}) => (
                        <div className="relative">
                            <AsyncSelect
                                fetchFn={fetchMedicineWarehouseOptions}
                                value={field.value}
                                onChange={(val) => {
                                    field.onChange(val);
                                }}
                                placeholder="Cari Gudang..."
                                debounce={300}
                                defaultLabel={defaultWarehouseLabel ?? null}
                                emptyAction={{
                                    label: "Tambah Gudang Baru",
                                    to: "/pharmacy?tab=medicine_warehouses"
                                }}
                            />
                        </div>
                    )}
                />
                {errors.warehouse_id && (
                    <p className="text-sm text-destructive">{errors.warehouse_id.message}</p>
                )}
            </div>

            {/* Rak */}
            <div className="space-y-2">
                <Label htmlFor="rack_id">
                    Rak <span className="text-destructive">*</span>
                </Label>
                <Controller
                    name="rack_id"
                    control={control}
                    rules={{required: "Rak tidak boleh kosong"}}
                    render={({field}) => (
                        <div className="relative">
                            <Select
                                disabled={!warehouseId}
                                value={field.value ? field.value.toString() : ""}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger className={field.value ? "w-full pr-9" : "w-full"}>
                                    <SelectValue
                                        placeholder={!warehouseId ? "Pilih gudang terlebih dahulu" : "Pilih Rak"}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {racksByMedicineWarehouse && racksByMedicineWarehouse.map((rack) => (
                                        <SelectItem key={rack.id} value={rack.id.toString()}>
                                            <div className="flex items-center gap-2">
                                                <Warehouse className="w-4 h-4"/>
                                                {rack.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {field.value && (
                                <button
                                    type="button"
                                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-destructive"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        field.onChange("");
                                    }}
                                >
                                    <X className="w-4 h-4"/>
                                </button>
                            )}
                        </div>
                    )}
                />
                {errors.rack_id && (
                    <p className="text-sm text-destructive">{errors.rack_id.message}</p>
                )}
            </div>

            {/* Auto Batch Checkbox */}
            <div>
                <Controller
                    name="is_auto_batch"
                    control={control}
                    render={({field}) => (
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                            <Label htmlFor="is_auto_batch">
                                Generate batch otomatis
                            </Label>
                        </div>
                    )}
                />
            </div>

            {/* Batch Number */}
            {!isAutoBatch && (
                <div>
                    <Label className="block text-sm font-medium mb-1.5">
                        Nomor Batch <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="text"
                        {...register("batch_number", {
                            required: !isAutoBatch ? "Nomor batch harus diisi" : false
                        })}
                        placeholder="Masukkan nomor batch"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.batch_number && (
                        <p className="text-red-500 text-sm mt-1">{errors.batch_number.message}</p>
                    )}
                </div>
            )}

            {/* Tanggal Kadaluarsa */}
            <div className="space-y-2">
                <Label htmlFor="expired_date">
                    Tanggal Kadaluarsa <span className="text-destructive">*</span>
                </Label>
                <Controller
                    name="expired_date"
                    control={control}
                    rules={{required: "Tanggal kadaluarsa harus diisi"}}
                    render={({field}) => (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4"/>
                                    {field.value ? format(field.value, "PPP") : <span>Pilih tanggal</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    toYear={currentYear + 100}
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    captionLayout="dropdown"
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    )}
                />
                {errors.expired_date && (
                    <p className="text-sm text-destructive">{errors.expired_date.message}</p>
                )}
            </div>

            {/* Harga Jual */}
            <div className="space-y-2">
                <Label htmlFor="selling_price">
                    Harga Jual {medicineValue?.is_for_sell && <span className="text-destructive">*</span>}
                </Label>
                <Input
                    type="number"
                    {...register("selling_price", {
                        required: medicineValue?.is_for_sell ? "Harga jual harus diisi" : false,
                        min: {value: 0, message: "Harga jual tidak boleh negatif"}
                    })}
                    placeholder="0"
                    className="w-full"
                />
                {errors.selling_price && (
                    <p className="text-sm text-destructive">{errors.selling_price.message}</p>
                )}
            </div>

            {/* Stok Unit Dasar */}
            <div>
                <Label className="block text-sm font-medium mb-1.5">
                    Stok (Unit Dasar) <span className="text-red-500">*</span>
                </Label>
                <Input
                    name="stock_amount"
                    type="number"
                    {...register("stock_amount", {
                        required: "Stok harus diisi",
                        min: {value: 0, message: "Stok tidak boleh negatif"}
                    })}
                    placeholder="0"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.stock_amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.stock_amount.message}</p>
                )}
            </div>
        </div>
    );
};


export const MedicineStockDeleteModalContent = ({selectedIds, medicineBatches}) => {
    const singleItem = selectedIds.length === 1
        ? medicineBatches?.data?.find(d => d.id === selectedIds[0])
        : null;
    return (
        <div className="space-y-4 py-2">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex gap-3">
                    <div className="shrink-0">
                        <div
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/20">
                            <Trash2 className="w-5 h-5 text-destructive"/>
                        </div>
                    </div>
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-semibold text-foreground">Konfirmasi Penghapusan</p>

                        {/* Jika hapus satu item */}
                        {singleItem ? (
                            <p className="text-sm text-muted-foreground">
                                Anda akan menghapus obat:{" "}
                                <span className="font-semibold text-foreground">{singleItem.batch_number}</span>
                            </p>
                        ) : (
                            /* Jika hapus banyak item */
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>Anda akan menghapus <span
                                    className="font-semibold text-foreground">{selectedIds.length} batch</span>:
                                </p>
                                <ul className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                                    {medicineBatches?.data
                                        ?.filter(d => selectedIds.includes(d.id))
                                        .map(d => (
                                            <li key={d.id} className="flex items-center gap-2">
                                                        <span
                                                            className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0"/>
                                                <span className="font-semibold text-foreground">{d.batch_number}</span>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}