import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Calendar} from "@/components/ui/calendar.jsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {FileText, Calendar as CalendarIcon} from "lucide-react";
import {Controller} from "react-hook-form";
import {format} from "date-fns";
import {cn} from "@/lib/utils.js";
import {AsyncSelect} from "@/components/common/async-select.jsx";

export default function UserSIPInfoSection({
                                               register,
                                               control,
                                               errors,
                                               isDoctor,
                                               userValue,
                                               fetchSipOptions,
                                           }) {
    if (!isDoctor) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5"/>
                    Informasi Surat Izin Praktik (SIP)
                </CardTitle>
                <CardDescription>Surat Izin Praktik (SIP)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Lembaga Pendaftaran */}
                    <div className="space-y-2">
                        <Label htmlFor="sip_institution_id">
                            Lembaga Pendaftaran
                            {isDoctor && <span className="text-destructive">*</span>}
                        </Label>
                        <Controller
                            name="sip_institution_id"
                            control={control}
                            rules={{required: "Lembaga Pendaftaran (SIP) wajib dipilih"}}
                            render={({field}) => (
                                <AsyncSelect fetchFn={fetchSipOptions}
                                             value={field.value}
                                             onChange={field.onChange}
                                             placeholder="Cari Lembaga..."
                                             debounce={300}
                                             defaultLabel={userValue?.sip?.name ?? null}
                                />
                            )}
                        />
                        {errors.sip_institution_id && (
                            <p className="text-sm text-destructive">{errors.sip_institution_id.message}</p>
                        )}
                    </div>

                    {/* Nomor Registrasi */}
                    <div className="space-y-2">
                        <Label htmlFor="sip_registration_number">
                            Nomor Registrasi SIP
                            {isDoctor && <span className="text-destructive">*</span>}
                        </Label>
                        <Input
                            id="sip_registration_number"
                            placeholder="Masukkan nomor registrasi"
                            {...register("sip_registration_number", {
                                required: isDoctor ? "Nomor registrasi SIP wajib diisi untuk dokter/perawat" : false
                            })}
                        />
                        {errors.sip_registration_number && (
                            <p className="text-sm text-destructive">{errors.sip_registration_number.message}</p>
                        )}
                    </div>

                    {/* Masa Berlaku */}
                    <div className="space-y-2">
                        <Label htmlFor="sip_active_period">
                            Masa Berlaku SIP
                            {isDoctor && <span className="text-destructive">*</span>}
                        </Label>
                        <Controller
                            name="sip_active_period"
                            control={control}
                            rules={{
                                required: isDoctor ? "Masa berlaku SIP wajib diisi untuk dokter/perawat" : false
                            }}
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
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}
                        />
                        {errors.sip_active_period && (
                            <p className="text-sm text-destructive">{errors.sip_active_period.message}</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
