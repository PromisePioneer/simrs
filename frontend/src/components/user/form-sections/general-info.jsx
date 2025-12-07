import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {User, Mail, Lock, Phone, MapPin} from "lucide-react";
import {Controller} from "react-hook-form";
import {
    MultiSelect,
    MultiSelectContent,
    MultiSelectGroup,
    MultiSelectItem,
    MultiSelectTrigger,
    MultiSelectValue
} from "@/components/ui/multi-select.jsx";

export default function UserGeneralInfoSection({register, control, errors, isEditMode, roleData}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5"/>
                    Informasi Umum
                </CardTitle>
                <CardDescription>Informasi dasar pengguna</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Nama Lengkap <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Masukkan nama lengkap"
                            {...register("name", {required: "Nama lengkap tidak boleh kosong"})}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email">
                            Email <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                            <Input
                                id="email"
                                type="email"
                                placeholder="user@example.com"
                                className="pl-9"
                                {...register("email", {
                                    required: "Email tidak boleh kosong",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Format email salah!"
                                    }
                                })}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password">
                            Password <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="pl-9"
                                {...register("password", {
                                    required: !isEditMode ? "Password tidak boleh kosong" : false,
                                    minLength: {
                                        value: 8,
                                        message: "Password minimal 8 karakter"
                                    }
                                })}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">
                            Phone Number <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+62 812 3456 7890"
                                className="pl-9"
                                {...register("phone", {
                                    required: "Telepon wajib diisi",
                                    pattern: {
                                        value: /^(^\+62|62|0)(\d{9,13})$/,
                                        message: "Format nomor HP tidak valid. Gunakan 08xxx atau +62xxx"
                                    }
                                })}
                            />
                        </div>
                        {errors.phone && (
                            <p className="text-sm text-destructive">{errors.phone.message}</p>
                        )}
                    </div>

                    {/* Role Field */}
                    <div className="space-y-2">
                        <Label htmlFor="role">
                            Role <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                            name="roles"
                            control={control}
                            rules={{required: "Role tidak boleh kosong"}}
                            render={({field}) => (
                                <MultiSelect
                                    values={field.value ?? []}
                                    onValuesChange={field.onChange}
                                >
                                    <MultiSelectTrigger className="w-full">
                                        <MultiSelectValue placeholder="Pilih Role" overflowBehavior="wrap-when-open"/>
                                    </MultiSelectTrigger>
                                    <MultiSelectContent>
                                        <MultiSelectGroup>
                                            {roleData && roleData?.map((role) => (
                                                <MultiSelectItem key={role.uuid} value={role.name}>
                                                    {role.name}
                                                </MultiSelectItem>
                                            ))}
                                        </MultiSelectGroup>
                                    </MultiSelectContent>
                                </MultiSelect>
                            )}
                        />
                        {errors.roles && (
                            <p className="text-sm text-destructive">{errors.roles.message}</p>
                        )}
                    </div>
                </div>

                {/* Address Field */}
                <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                        <Textarea
                            id="address"
                            placeholder="Enter full address"
                            className="pl-9 min-h-[100px]"
                            {...register("address", {required: "Alamat tidak boleh kosong"})}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}