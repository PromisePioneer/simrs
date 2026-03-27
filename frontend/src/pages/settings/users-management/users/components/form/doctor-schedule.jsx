import {useEffect} from "react";
import {useWatch} from "react-hook-form";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {Clock} from "lucide-react";

const DAYS = [
    {value: "monday", label: "Senin"},
    {value: "tuesday", label: "Selasa"},
    {value: "wednesday", label: "Rabu"},
    {value: "thursday", label: "Kamis"},
    {value: "friday", label: "Jumat"},
    {value: "saturday", label: "Sabtu"},
    {value: "sunday", label: "Minggu"},
];

function UserDoctorScheduleSection({control, register, setValue, isDoctor}) {
    const scheduleValues = useWatch({control, name: "doctor_schedule"});
    useEffect(() => {
        if (!isDoctor) return;
        const current = scheduleValues || [];
        const existing = {};
        current.forEach((s) => {
            if (s?.day_of_week) existing[s.day_of_week] = s;
        });
        DAYS.forEach((day, index) => {
            setValue(`doctor_schedule.${index}.day_of_week`, day.value, {shouldDirty: false});
            setValue(
                `doctor_schedule.${index}.start_time`,
                existing[day.value]?.start_time ?? "",
                {shouldDirty: false}
            );
            setValue(
                `doctor_schedule.${index}.end_time`,
                existing[day.value]?.end_time ?? "",
                {shouldDirty: false}
            );
        });
    }, [isDoctor, JSON.stringify(scheduleValues)]);

    if (!isDoctor) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="w-4 h-4"/>
                    Jadwal Praktik
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="divide-y">
                    {DAYS.map((day, index) => (
                        <div
                            key={day.value}
                            className="grid grid-cols-3 items-center gap-4 py-3"
                        >
                            <input
                                type="hidden"
                                {...register(`doctor_schedule.${index}.day_of_week`)}
                            />

                            <Badge variant="outline" className="w-fit text-sm font-medium">
                                {day.label}
                            </Badge>

                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Jam Mulai</Label>
                                <Input
                                    type="time"
                                    {...register(`doctor_schedule.${index}.start_time`)}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Jam Selesai</Label>
                                <Input
                                    type="time"
                                    {...register(`doctor_schedule.${index}.end_time`)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default UserDoctorScheduleSection;