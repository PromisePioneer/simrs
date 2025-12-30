import {Plus, Trash2, MapPin} from 'lucide-react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';

// Import yang dibutuhkan dari react-hook-form
import {useFieldArray} from 'react-hook-form';

function PatientAddressInfo({register, errors, control, isEditMode}) {
    // Gunakan useFieldArray untuk mengelola array addresses
    const {fields, append, remove} = useFieldArray({
        control,
        name: "addresses"
    });

    // Function untuk menambah alamat baru
    const addAddress = () => {
        append({
            address: "",
            province: "",
            city: "",
            subdistrict: "",
            ward: "",
            postal_code: ""
        });
    };

    return (
        <div className="space-y-4">
            {fields.map((field, index) => (
                <Card key={field.id}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5"/>
                                <div>
                                    <CardTitle>
                                        Informasi Alamat {fields.length > 1 ? `#${index + 1}` : ''}
                                    </CardTitle>
                                    <CardDescription>
                                        Alamat lengkap dan domisili pasien
                                    </CardDescription>
                                </div>
                            </div>

                            {/* Tombol hapus (muncul jika ada lebih dari 1 alamat) */}
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
                        {/* Address */}
                        <div className="space-y-2">
                            <Label htmlFor={`addresses.${index}.address`}>
                                Alamat Lengkap <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id={`addresses.${index}.address`}
                                placeholder="Masukkan alamat lengkap"
                                rows={3}
                                {...register(`addresses.${index}.address`, {
                                    required: "Alamat wajib diisi"
                                })}
                            />
                            {errors.addresses?.[index]?.address && (
                                <p className="text-sm text-destructive">
                                    {errors.addresses[index].address.message}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {/* Province */}
                            <div className="space-y-2">
                                <Label htmlFor={`addresses.${index}.province`}>
                                    Provinsi <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id={`addresses.${index}.province`}
                                    placeholder="Provinsi"
                                    {...register(`addresses.${index}.province`, {
                                        required: "Provinsi wajib diisi"
                                    })}
                                />
                                {errors.addresses?.[index]?.province && (
                                    <p className="text-sm text-destructive">
                                        {errors.addresses[index].province.message}
                                    </p>
                                )}
                            </div>

                            {/* City */}
                            <div className="space-y-2">
                                <Label htmlFor={`addresses.${index}.city`}>
                                    Kota/Kabupaten <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id={`addresses.${index}.city`}
                                    placeholder="Kota/Kabupaten"
                                    {...register(`addresses.${index}.city`, {
                                        required: "Kota wajib diisi"
                                    })}
                                />
                                {errors.addresses?.[index]?.city && (
                                    <p className="text-sm text-destructive">
                                        {errors.addresses[index].city.message}
                                    </p>
                                )}
                            </div>

                            {/* Subdistrict */}
                            <div className="space-y-2">
                                <Label htmlFor={`addresses.${index}.subdistrict`}>
                                    Kecamatan <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id={`addresses.${index}.subdistrict`}
                                    placeholder="Kecamatan"
                                    {...register(`addresses.${index}.subdistrict`, {
                                        required: "Kecamatan wajib diisi"
                                    })}
                                />
                                {errors.addresses?.[index]?.subdistrict && (
                                    <p className="text-sm text-destructive">
                                        {errors.addresses[index].subdistrict.message}
                                    </p>
                                )}
                            </div>

                            {/* Ward */}
                            <div className="space-y-2">
                                <Label htmlFor={`addresses.${index}.ward`}>
                                    Kelurahan <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id={`addresses.${index}.ward`}
                                    placeholder="Kelurahan"
                                    {...register(`addresses.${index}.ward`, {
                                        required: "Kelurahan wajib diisi"
                                    })}
                                />
                                {errors.addresses?.[index]?.ward && (
                                    <p className="text-sm text-destructive">
                                        {errors.addresses[index].ward.message}
                                    </p>
                                )}
                            </div>

                            {/* Postal Code */}
                            <div className="space-y-2">
                                <Label htmlFor={`addresses.${index}.postal_code`}>
                                    Kode Pos <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id={`addresses.${index}.postal_code`}
                                    placeholder="12345"
                                    maxLength={5}
                                    {...register(`addresses.${index}.postal_code`, {
                                        required: "Kode pos wajib diisi"
                                    })}
                                />
                                {errors.addresses?.[index]?.postal_code && (
                                    <p className="text-sm text-destructive">
                                        {errors.addresses[index].postal_code.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {/* Tombol Tambah Alamat */}
            <Button
                type="button"
                variant="outline"
                onClick={addAddress}
                className="w-full border-dashed"
            >
                <Plus className="w-4 h-4 mr-2"/>
                Tambah Alamat
            </Button>
        </div>
    );
}

export default PatientAddressInfo;