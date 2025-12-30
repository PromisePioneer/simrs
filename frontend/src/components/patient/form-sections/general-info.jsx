import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {CalendarIcon, Upload, X} from "lucide-react";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Controller} from "react-hook-form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Building2, User} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {cn} from "@/lib/utils.js";
import {Calendar} from "@/components/ui/calendar.jsx";
import {format} from "date-fns";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";


function PatientGeneralInfoSection({
                                       register,
                                       control,
                                       errors,
                                       previewImage,
                                       handleFileChange,
                                       userData,
                                       tenants,
                                       removeImage,
                                   }) {

    const isUserHasTenant = userData.tenant_id !== null;

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5"/>
                        Informasi Umum Pasien
                    </CardTitle>
                    <CardDescription>Data identitas dan informasi dasar pasien</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Photo Upload */}
                    <div className="space-y-2">
                        <Label>Profile Picture</Label>
                        <div className="flex items-center gap-4">
                            {previewImage ? (
                                <div className="relative">
                                    <Avatar className="h-32 w-32">
                                        <AvatarImage src={previewImage} alt="Preview"/>
                                        <AvatarFallback>Preview</AvatarFallback>
                                    </Avatar>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                        onClick={() => removeImage('profile_picture')}
                                    >
                                        <X className="h-3 w-3"/>
                                    </Button>
                                </div>
                            ) : (
                                <div
                                    className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/25 bg-muted">
                                    <User className="h-12 w-12 text-muted-foreground/50"/>
                                </div>
                            )}
                            <Label htmlFor="profile_picture" className="cursor-pointer">
                                <div
                                    className="flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                                    <Upload className="h-4 w-4"/>
                                    Choose Image
                                </div>
                                <Input
                                    id="profile_picture"
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={(e) => handleFileChange(e, 'profile_picture')}
                                />
                            </Label>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {
                            !userData?.tenant_id && (
                                <div className="space-y-2">
                                    <Label htmlFor="tenant_id">
                                        Tenant/Klinik <span className="text-destructive">*</span>
                                    </Label>
                                    <Controller
                                        name="tenant_id"
                                        control={control}
                                        rules={{required: isUserHasTenant || "Tenant wajib dipilih"}}
                                        render={({field}) => (
                                            <div className="relative">
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger className={field.value ? "w-full pr-9" : "w-full"}>
                                                        <SelectValue placeholder="Pilih tenant/klinik"/>
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        {tenants?.length ? (
                                                            tenants.map((tenant) => (
                                                                <SelectItem
                                                                    key={tenant.id}
                                                                    value={tenant.id.toString()}
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <Building2 className="w-4 h-4"/>
                                                                        {tenant.name}
                                                                    </div>
                                                                </SelectItem>
                                                            ))
                                                        ) : (
                                                            <SelectItem value="no-tenant" disabled>
                                                                Tidak ada tenant tersedia
                                                            </SelectItem>
                                                        )}
                                                    </SelectContent>
                                                </Select>

                                                {/* CLEAR BUTTON */}
                                                {field.value && (
                                                    <button
                                                        type="button"
                                                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-destructive"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            field.onChange(undefined);
                                                        }}
                                                    >
                                                        <X className="w-4 h-4"/>
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    />
                                    {errors.tenant_id && (
                                        <p className="text-sm text-destructive">{errors.tenant_id.message}</p>
                                    )}
                                </div>
                            )
                        }
                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label htmlFor="full_name">
                                Nama Lengkap <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="full_name"
                                placeholder="Masukkan nama lengkap"
                                {...register("full_name", {required: "Nama lengkap wajib diisi"})}
                            />
                            {errors.full_name && (
                                <p className="text-sm text-destructive">{errors.full_name.message}</p>
                            )}
                        </div>

                        {/* Medical Record Number */}
                        <div className="space-y-2">
                            <Label htmlFor="medical_record_number">
                                No. Rekam Medis <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="medical_record_number"
                                readOnly
                                {...register("medical_record_number")}
                                className="bg-muted"
                            />
                            <p className="text-sm text-muted-foreground">
                                Nomor rekam medis di-generate otomatis
                            </p>
                        </div>

                        {/* ID Card Number (NIK) */}
                        <div className="space-y-2">
                            <Label htmlFor="id_card_number">
                                NIK <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="id_card_number"
                                placeholder="16 digit NIK"
                                maxLength={16}
                                {...register("id_card_number", {
                                    required: "NIK wajib diisi",
                                    pattern: {
                                        value: /^[0-9]{16}$/,
                                        message: "NIK harus 16 digit angka"
                                    }
                                })}
                            />
                            {errors.id_card_number && (
                                <p className="text-sm text-destructive">{errors.id_card_number.message}</p>
                            )}
                        </div>

                        {/* City of Birth */}
                        <div className="space-y-2">
                            <Label htmlFor="city_of_birth">
                                Tempat Lahir <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="city_of_birth"
                                placeholder="Kota kelahiran"
                                {...register("city_of_birth", {required: "Tempat lahir wajib diisi"})}
                            />
                            {errors.city_of_birth && (
                                <p className="text-sm text-destructive">{errors.city_of_birth.message}</p>
                            )}
                        </div>
                        {/* Date of Birth */}
                        <div className="space-y-2">
                            <Label htmlFor="date_of_birth">
                                Tanggal Lahir <span className="text-destructive">*</span>
                            </Label>

                            <Controller
                                name="date_of_birth"
                                control={control}
                                rules={{required: "Tanggal lahir wajib diisi"}}
                                render={({field}) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4"/>
                                                {field.value
                                                    ? format(field.value, "dd MMMM yyyy")
                                                    : "Pilih tanggal lahir"}
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                                captionLayout="dropdown-buttons"
                                                fromYear={1900}
                                                toYear={new Date().getFullYear()}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />

                            {errors.date_of_birth && (
                                <p className="text-sm text-destructive">
                                    {errors.date_of_birth.message}
                                </p>
                            )}
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                            <Label htmlFor="gender">
                                Jenis Kelamin <span className="text-destructive">*</span>
                            </Label>
                            <Controller
                                name="gender"
                                control={control}
                                rules={{required: "Jenis kelamin wajib dipilih"}}
                                render={({field}) => (
                                    <div className="relative">
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className={field.value ? "w-full pr-9" : "w-full"}>
                                                <SelectValue placeholder="Pilih jenis kelamin"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pria">Pria</SelectItem>
                                                <SelectItem value="wanita">Wanita</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        {field.value && (
                                            <button
                                                type="button"
                                                className="absolute right-3 top-2.5 text-muted-foreground hover:text-destructive"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    field.onChange(undefined);
                                                }}
                                            >
                                                <X className="w-4 h-4"/>
                                            </button>
                                        )}
                                    </div>
                                )}
                            />
                            {errors.gender && (
                                <p className="text-sm text-destructive">{errors.gender.message}</p>
                            )}
                        </div>

                        {/* Religion */}
                        <div className="space-y-2">
                            <Label htmlFor="religion">
                                Agama <span className="text-destructive">*</span>
                            </Label>
                            <Controller
                                name="religion"
                                control={control}
                                rules={{required: "Agama wajib dipilih"}}
                                render={({field}) => (
                                    <div className="relative">
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className={field.value ? "w-full pr-9" : "w-full"}>
                                                <SelectValue placeholder="Pilih agama"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="islam">Islam</SelectItem>
                                                <SelectItem value="protestan">Protestan</SelectItem>
                                                <SelectItem value="katholik">Katholik</SelectItem>
                                                <SelectItem value="hindu">Hindu</SelectItem>
                                                <SelectItem value="budha">Budha</SelectItem>
                                                <SelectItem value="konghucu">Konghucu</SelectItem>
                                            </SelectContent>
                                        </Select>


                                        {field.value && (
                                            <button
                                                type="button"
                                                className="absolute right-3 top-2.5 text-muted-foreground hover:text-destructive"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    field.onChange(undefined);
                                                }}
                                            >
                                                <X className="w-4 h-4"/>
                                            </button>
                                        )}
                                    </div>
                                )}
                            />
                            {errors.religion && (
                                <p className="text-sm text-destructive">{errors.religion.message}</p>
                            )}
                        </div>

                        {/* Blood Type */}
                        <div className="space-y-2">
                            <Label htmlFor="blood_type">
                                Golongan Darah <span className="text-destructive">*</span>
                            </Label>
                            <Controller
                                name="blood_type"
                                control={control}
                                rules={{required: "Golongan darah wajib dipilih"}}
                                render={({field}) => (
                                    <div className="relative ">
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className={field.value ? "w-full pr-9" : "w-full"}>
                                                <SelectValue placeholder="Pilih golongan darah"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="a+">A+</SelectItem>
                                                <SelectItem value="a-">A-</SelectItem>
                                                <SelectItem value="b+">B+</SelectItem>
                                                <SelectItem value="b-">B-</SelectItem>
                                                <SelectItem value="ab+">AB+</SelectItem>
                                                <SelectItem value="ab-">AB-</SelectItem>
                                                <SelectItem value="o+">O+</SelectItem>
                                                <SelectItem value="o-">O-</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {field.value && (
                                            <button
                                                type="button"
                                                className="absolute right-3 top-2.5 text-muted-foreground hover:text-destructive"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    field.onChange(undefined);
                                                }}
                                            >
                                                <X className="w-4 h-4"/>
                                            </button>
                                        )}
                                    </div>
                                )}
                            />
                            {errors.blood_type && (
                                <p className="text-sm text-destructive">{errors.blood_type.message}</p>
                            )}
                        </div>

                        {/* Job */}
                        <div className="space-y-2">
                            <Label htmlFor="job">
                                Pekerjaan <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="job"
                                placeholder="Pekerjaan"
                                {...register("job", {required: "Pekerjaan wajib diisi"})}
                            />
                            {errors.job && (
                                <p className="text-sm text-destructive">{errors.job.message}</p>
                            )}
                        </div>

                        {/* KIS Number */}
                        <div className="space-y-2">
                            <Label htmlFor="kis_number">Nomor KIS</Label>
                            <Input
                                id="kis_number"
                                placeholder="Nomor KIS (opsional)"
                                {...register("kis_number")}
                            />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone">
                                Nomor Telepon <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="08xxxxxxxxxx"
                                {...register("phone", {required: "Nomor telepon wajib diisi"})}
                            />
                            {errors.phone && (
                                <p className="text-sm text-destructive">{errors.phone.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="email@example.com"
                                {...register("email", {
                                    required: "Email wajib diisi",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Format email tidak valid"
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Date of Consultation */}
                        <div className="space-y-2">
                            <Label htmlFor="date_of_consultation">
                                Tanggal Konsultasi <span className="text-destructive">*</span>
                            </Label>

                            <Controller
                                name="date_of_consultation"
                                control={control}
                                rules={{required: "Tanggal Konsultasi wajib diisi"}}
                                render={({field}) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4"/>
                                                {field.value
                                                    ? format(field.value, "dd MMMM yyyy")
                                                    : "Pilih tanggal konsultasi"}
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                                captionLayout="dropdown-buttons"
                                                fromYear={1900}
                                                toYear={new Date().getFullYear()}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />

                            {errors.date_of_birth && (
                                <p className="text-sm text-destructive">
                                    {errors.date_of_birth.message}
                                </p>
                            )}
                        </div>

                    </div>
                </CardContent>
            </Card>
        </>
    )
}


export default PatientGeneralInfoSection;