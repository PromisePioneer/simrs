import {Label} from "@shared/components/ui/label.jsx";
import {Input} from "@shared/components/ui/input.jsx";

export const RoleModalFormContent = ({register, errors}) => {
    return (
        <div className="space-y-2.5">
            <Label htmlFor="name" className="text-sm font-semibold">
                Nama<span className="text-destructive">*</span>
            </Label>
            <Input
                id="name"
                name="name"
                placeholder="e.g., Content Manager"
                {...register("name", {
                    required: "Nama tidak boleh kosong",
                })}
                className="h-11"
            />
            {errors.name && (
                <p className="text-xs text-destructive">
                    {errors.name.message}
                </p>
            )}
            <p className="text-xs text-muted-foreground">
                Pilih nama yang deskriptif untuk peran ini.
            </p>
        </div>
    );
}