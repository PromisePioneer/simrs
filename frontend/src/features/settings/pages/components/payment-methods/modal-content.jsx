import {Label} from "@shared/components/ui/label.jsx";
import {Controller} from "react-hook-form";
import {AsyncSelect} from "@shared/components/common/async-select.jsx";
import {Input} from "@shared/components/ui/input.jsx";
import {Trash2} from "lucide-react";

export const PaymentMethodModalFormContent = ({
                                                  register,
                                                  control,
                                                  errors,
                                                  fetchPaymentMethodTypeOptions,
                                                  paymentMethodValue
                                              }) => {
    return (
        <>
            <div className="space-y-5 py-2">
                <div className="space-y-2.5">
                    <Label htmlFor="payment-name" className="text-sm font-semibold">Nama <span
                        className="text-destructive">*</span></Label>
                    <Input id="payment-name" placeholder="Masukkan nama metode pembayaran"
                           {...register("name", {required: "Nama metode pembayaran tidak boleh kosong"})}/>
                    {errors.name &&
                        <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="payment-type">Tipe Metode Pembayaran</Label>
                    <Controller
                        name="payment_method_type_id"
                        control={control}
                        rules={{required: "Tipe Metode Pembayaran wajib dipilih"}}
                        render={({field}) => (
                            <AsyncSelect fetchFn={fetchPaymentMethodTypeOptions}
                                         value={field.value}
                                         onChange={field.onChange}
                                         placeholder="Cari Tipe Pembayaran..."
                                         debounce={300}
                                         defaultLabel={paymentMethodValue?.type?.name}
                            />
                        )}
                    />
                    {errors.payment_method_type_id &&
                        <p className="text-sm text-destructive">{errors.payment_method_type_id.message}</p>}
                </div>
            </div>
        </>
    )
}


export const PaymentMethodDeleteModalContent = ({paymentMethodValue, selectedIds, paymentMethods}) => {
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
                        {paymentMethodValue && selectedIds.length <= 1 ? (
                            <p className="text-sm text-muted-foreground">
                                Anda akan menghapus tipe pembayaran: <span
                                className="font-semibold text-foreground">{paymentMethodValue?.name}</span>
                            </p>
                        ) : (
                            /* Jika hapus banyak item */
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>Anda akan menghapus <span
                                    className="font-semibold text-foreground">{selectedIds.length} tipe pembayaran</span>:
                                </p>
                                <ul className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                                    {paymentMethods?.data
                                        ?.filter(d => selectedIds.includes(d.id))
                                        .map(d => (
                                            <li key={d.id} className="flex items-center gap-2">
                                                        <span
                                                            className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0"/>
                                                <span className="font-semibold text-foreground">{d.name}</span>
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
    )
}