import {useFieldArray, Controller} from "react-hook-form";
import {Plus, Trash2, Clock, CalendarDays} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.jsx";

const DAYS = [
    {value: "monday", label: "Senin"},
    {value: "tuesday", label: "Selasa"},
    {value: "wednesday", label: "Rabu"},
    {value: "thursday", label: "Kamis"},
    {value: "friday", label: "Jumat"},
    {value: "saturday", label: "Sabtu"},
    {value: "sunday", label: "Minggu"},
];

/**
 * UserDoctorScheduleSection
 *
 * Props:
 *  - control       : react-hook-form control
 *  - register      : react-hook-form register
 *  - errors        : react-hook-form errors
 *  - isDoctor      : boolean — show this section only when role is doctor/nurse
 */
function UserDoctorScheduleSection({control, register, errors, isDoctor}) {
    const {fields, append, remove} = useFieldArray({
        control,
        name: "doctor_schedules",
    });

    if (!isDoctor) return null;

    const addSchedule = () => {
        append({day_of_week: "", start_time: "", end_time: ""});
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <CalendarDays className="w-5 h-5 text-primary"/>
                    Jadwal Praktik Dokter
                </CardTitle>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    onClick={addSchedule}
                >
                    <Plus className="w-4 h-4"/>
                    Tambah Jadwal
                </Button>
            </CardHeader>

            <CardContent className="space-y-3">
                {fields.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-6">
                        Belum ada jadwal. Klik "Tambah Jadwal" untuk menambahkan.
                    </p>
                )}

                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="flex items-center  justify-between gap-6 p-3 rounded-lg border bg-muted/30"
                    >
                        {/* Day */}
                        <div className="space-y-1 w-full">
                            <label className="text-xs font-medium">
                                Hari
                            </label>
                            <Controller
                                control={control}
                                name={`doctor_schedules.${index}.day_of_week`}
                                rules={{
                                    required: "Hari wajib dipilih",
                                    validate: (val, formValues) => {
                                        const schedules = formValues.doctor_schedules || [];
                                        const duplicates = schedules.filter(
                                            (s, i) => s.day_of_week === val && i !== index
                                        );
                                        return duplicates.length === 0 || "Hari ini sudah ada jadwal";
                                    },
                                }}
                                render={({field: f}) => (
                                    <Select value={f.value} onValueChange={f.onChange}>
                                        <SelectTrigger className="h-9 w-full">
                                            <SelectValue placeholder="Pilih hari"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DAYS.map((d) => (
                                                <SelectItem key={d.value} value={d.value}>
                                                    {d.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors?.doctor_schedules?.[index]?.day_of_week && (
                                <p className="text-xs text-destructive">
                                    {errors.doctor_schedules[index].day_of_week.message}
                                </p>
                            )}
                        </div>

                        {/* Start Time */}
                        <div className="space-y-1 w-full">
                            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3"/> Jam Mulai
                            </label>
                            <input
                                type="time"
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                {...register(`doctor_schedules.${index}.start_time`, {
                                    required: "Jam mulai wajib diisi",
                                })}
                            />
                            {errors?.doctor_schedules?.[index]?.start_time && (
                                <p className="text-xs text-destructive">
                                    {errors.doctor_schedules[index].start_time.message}
                                </p>
                            )}
                        </div>

                        {/* End Time */}
                        <div className="space-y-1 w-full">
                            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3"/> Jam Selesai
                            </label>
                            <input
                                type="time"
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                {...register(`doctor_schedules.${index}.end_time`, {
                                    required: "Jam selesai wajib diisi",
                                    validate: (val, formValues) => {
                                        const start = formValues.doctor_schedules?.[index]?.start_time;
                                        if (start && val && val <= start) {
                                            return "Jam selesai harus lebih dari jam mulai";
                                        }
                                        return true;
                                    },
                                })}
                            />
                            {errors?.doctor_schedules?.[index]?.end_time && (
                                <p className="text-xs text-destructive">
                                    {errors.doctor_schedules[index].end_time.message}
                                </p>
                            )}
                        </div>

                        {/* Remove */}
                        <div className="pt-5">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => remove(index)}
                            >
                                <Trash2 className="w-4 h-4"/>
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export default UserDoctorScheduleSection;