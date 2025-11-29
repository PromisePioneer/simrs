import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {AlertCircle} from "lucide-react";

function Modal({
                   open,
                   onOpenChange,
                   title,
                   description,
                   children,
                   onSubmit,
                   onCancel,
                   submitText = "Save",
                   cancelText = "Cancel",
                   isLoading = false,
                   size = "default",
                   type = "default"
               }) {
    const sizeClasses = {
        sm: "sm:max-w-[425px]",
        default: "sm:max-w-[525px]",
        lg: "sm:max-w-[725px]",
        xl: "sm:max-w-[925px]",
        full: "sm:max-w-[95vw]"
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={sizeClasses[size]}>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className={type === "danger" ? "text-destructive flex items-center gap-2" : ""}>
                            {type === "danger" && <AlertCircle className="h-5 w-5"/>}
                            {title}
                        </DialogTitle>
                        {description && (
                            <DialogDescription>{description}</DialogDescription>
                        )}
                    </DialogHeader>

                    <div className="py-4">
                        {children}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel || (() => onOpenChange(false))}
                            disabled={isLoading}
                        >
                            {cancelText}
                        </Button>
                        <Button
                            type="submit"
                            variant={type === "danger" ? "destructive" : "default"}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div
                                        className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2"></div>
                                    Loading...
                                </>
                            ) : (
                                submitText
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default Modal;