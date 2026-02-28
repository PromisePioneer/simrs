import {Plus, Trash2, CreditCard, X} from 'lucide-react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Controller, useFieldArray} from 'react-hook-form';

function PatientPaymentMethod({register, control, errors, watch, paymentMethodTypes}) {
    const {fields, append, remove} = useFieldArray({
        control,
        name: "payment_methods"
    });

    // Watch semua cashier methods untuk conditional rendering
    const paymentMethods = watch("payment_methods");

    // Function untuk menambah cashier method baru
    const addPaymentMethod = () => {
        append({
            payment_method: "",
            bpjs_number: ""
        });
    };

    return (
        <div className="space-y-4">
            {fields.map((field, index) => (
                <Card key={field.id}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5"/>
                                <div>
                                    <CardTitle>
                                        Metode Pembayaran {fields.length > 1 ? `#${index + 1}` : ''}
                                    </CardTitle>
                                    <CardDescription>
                                        Pilih metode pembayaran yang tersedia
                                    </CardDescription>
                                </div>
                            </div>

                            {/* Tombol hapus (muncul jika ada lebih dari 1 cashier method) */}
                            {fields.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => remove(index)}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="w-5 h-5"/>
                                </Button>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Payment Method */}
                            <div className="space-y-2">
                                <Label htmlFor={`payment_methods.${index}.payment_method_type_id`}>
                                    Metode Pembayaran <span className="text-destructive">*</span>
                                </Label>
                                <Controller
                                    name={`payment_methods.${index}.payment_method_type_id`}
                                    control={control}
                                    rules={{required: "Metode pembayaran wajib dipilih"}}
                                    render={({field}) => (
                                        <div className="relative">
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <SelectTrigger className={field.value ? "w-full pr-9" : "w-full"}>
                                                    <SelectValue placeholder="Pilih metode pembayaran"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {paymentMethodTypes && paymentMethodTypes.length > 0 ? (
                                                        paymentMethodTypes.map((method) => (
                                                            <SelectItem
                                                                key={method.id}
                                                                value={method.id.toString()}
                                                            >
                                                                {method.name}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                                            Tidak ada metode pembayaran
                                                        </div>
                                                    )}
                                                </SelectContent>
                                            </Select>

                                            {/* CLEAR BUTTON */}
                                            {field.value && (
                                                <button
                                                    type="button"
                                                    className="absolute right-9 top-2.5 text-muted-foreground hover:text-destructive z-10"
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
                                {errors.payment_methods?.[index]?.payment_method_type_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.payment_methods[index].payment_method_type_id.message}
                                    </p>
                                )}
                            </div>

                            {/* BPJS Number - conditional */}
                            {(() => {
                                // Cari cashier method yang dipilih
                                const selectedMethod = paymentMethodTypes?.find(
                                    m => m.id.toString() === paymentMethods?.[index]?.payment_method_type_id
                                );

                                // Tampilkan field BPJS jika nama method mengandung 'bpjs' (case insensitive)
                                const showBPJS = selectedMethod?.name?.toLowerCase().includes('bpjs');

                                if (!showBPJS) return null;

                                return (
                                    <div className="space-y-2">
                                        <Label htmlFor={`payment_methods.${index}.bpjs_number`}>
                                            Nomor BPJS <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id={`payment_methods.${index}.bpjs_number`}
                                            placeholder="Masukkan nomor BPJS"
                                            {...register(`payment_methods.${index}.bpjs_number`, {
                                                required: showBPJS ? "Nomor BPJS wajib diisi" : false
                                            })}
                                        />
                                        {errors.payment_methods?.[index]?.bpjs_number && (
                                            <p className="text-sm text-destructive">
                                                {errors.payment_methods[index].bpjs_number.message}
                                            </p>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    </CardContent>
                </Card>
            ))}

            {/* Tombol Tambah Payment Method */}
            <Button
                type="button"
                variant="outline"
                onClick={addPaymentMethod}
                className="w-full border-dashed"
            >
                <Plus className="w-4 h-4 mr-2"/>
                Tambah Metode Pembayaran
            </Button>
        </div>
    );
}

export default PatientPaymentMethod;