import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Calendar} from "@/components/ui/calendar.jsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command.jsx";
import {FileText, Calendar as CalendarIcon, ChevronsUpDown, Check} from "lucide-react";
import {Controller} from "react-hook-form";
import {useState} from "react";
import {format} from "date-fns";
import {cn} from "@/lib/utils";

export default function UserSTRInfoSection({register, control, errors, isDoctor, strData, handleInstituteType}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5"/>
                    Informasi Surat Tanda Registrasi (STR)
                </CardTitle>
                <CardDescription>Surat Tanda Registrasi (STR)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Lembaga Pendaftaran */}
                    <div className="space-y-2">
                        <Label htmlFor="str_institution_id">
                            Lembaga Pendaftaran
                            {isDoctor && <span className="text-destructive">*</span>}
                        </Label>
                        <Controller
                            name="str_institution_id"
                            control={control}
                            rules={{
                                required: isDoctor ? "Lembaga pendaftaran STR wajib diisi untuk dokter/perawat" : false
                            }}
                            render={({field}) => {
                                const [open, setOpen] = useState(false);
                                return (
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={open}
                                                className="w-full justify-between"
                                                onClick={() => {
                                                    if (strData.length === 0) {
                                                        handleInstituteType("str");
                                                    }
                                                }}
                                            >
                                                {field.value
                                                    ? strData.find((str) => str.id === field.value)?.name
                                                    : "Pilih lembaga..."}
                                                <ChevronsUpDown className="opacity-50"/>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Cari lembaga..." className="h-9"/>
                                                <CommandList>
                                                    <CommandEmpty>Lembaga tidak ditemukan.</CommandEmpty>
                                                    <CommandGroup className="w-full">
                                                        {strData.map((str) => (
                                                            <CommandItem
                                                                key={str.id}
                                                                value={str.id}
                                                                onSelect={() => {
                                                                    field.onChange(str.id === field.value ? "" : str.id);
                                                                    setOpen(false);
                                                                }}
                                                            >
                                                                {str.name}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto",
                                                                        field.value === str.id ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                );
                            }}
                        />
                        {errors.str_institution_id && (
                            <p className="text-sm text-destructive">{errors.str_institution_id.message}</p>
                        )}
                    </div>

                    {/* Nomor Registrasi */}
                    <div className="space-y-2">
                        <Label htmlFor="str_registration_number">
                            Nomor Registrasi STR
                            {isDoctor && <span className="text-destructive">*</span>}
                        </Label>
                        <Input
                            id="str_registration_number"
                            placeholder="Masukkan nomor registrasi"
                            {...register("str_registration_number", {
                                required: isDoctor ? "Nomor Registrasi STR wajib diisi untuk dokter/perawat" : false
                            })}
                        />
                        {errors.str_registration_number && (
                            <p className="text-sm text-destructive">{errors.str_registration_number.message}</p>
                        )}
                    </div>

                    {/* Masa Berlaku */}
                    <div className="space-y-2">
                        <Label htmlFor="str_active_period">
                            Masa Berlaku STR
                            {isDoctor && <span className="text-destructive">*</span>}
                        </Label>
                        <Controller
                            name="str_active_period"
                            control={control}
                            rules={{
                                required: isDoctor ? "Masa berlaku STR wajib diisi untuk dokter/perawat" : false
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
                        {errors.str_active_period && (
                            <p className="text-sm text-destructive">{errors.str_active_period.message}</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}