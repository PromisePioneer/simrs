import {X} from "lucide-react";

export function ClearSelectedOption({field}) {
    return (
        <>
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
        </>
    )
}